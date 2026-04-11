const express = require('express');
const mysql = require('mysql2'); // Importamos el driver
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// CONFIGURACIÓN DE LA CONEXIÓN
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Tu usuario de MySQL
  password: 'JanethHolis2005', // Tu contraseña de MySQL (déjala vacía si no tienes)
  database: 'fallow'
});

db.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL 🗄️');
});

// NUEVA RUTA: Obtener productos desde la BD
app.get('/api/productos', (req, res) => {
  const { categoria, sub } = req.query;
  let query = 'SELECT * FROM productos WHERE disponible = TRUE';
  let params = [];

  if (categoria) {
    query += ' AND id_categoria IN (SELECT id_categoria FROM categorias WHERE nombre_categoria = ?)';
    params.push(categoria);
  }
  
  // NUEVO: Filtro por subcategoría (asegúrate de tener esta columna en tu BD)
  if (sub) {
    query += ' AND subcategoria = ?';
    params.push(sub);
  }

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});


app.post('/api/login', (req, res) => {
  const { correo, password } = req.body; 
  
  // Mantenemos tu query que ya trae el nombre
  const query = 'SELECT id_usuario, nombre, correo, rol FROM usuarios WHERE correo = ? AND contraseña = ?';

  db.query(query, [correo, password], (err, results) => {
    if (err) {
      return res.status(500).json({ auth: false, message: 'Error en el servidor' });
    }

    if (results.length > 0) {
      const user = results[0];
      console.log('Login exitoso para:', user.nombre);

      // Enviamos auth y el objeto usuario completo
      res.json({ 
        auth: true, 
        usuario: {
          id_usuario: user.id_usuario,
          nombre: user.nombre, // Este es el que usará el saludo
          correo: user.correo,
          rol: user.rol
        }
      });
    } else {
      res.status(401).json({ 
        auth: false, 
        message: 'Correo o contraseña incorrectos' 
      });
    }
  });
});

//API para crear un nuevo pedido. Recibe id_usuario, total y un array de productos con id_producto y precio. Para el cart
app.post('/api/pedidos', (req, res) => {
  const { id_usuario, total, productos } = req.body;

  const queryPedido = 'INSERT INTO pedidos (id_usuario, total) VALUES (?, ?)';
  
  db.query(queryPedido, [id_usuario, total], (err, result) => {
    if (err) return res.status(500).json(err);
    
    const id_pedido = result.insertId;
    const detalles = productos.map(p => [id_pedido, p.id_producto, p.precio]);
    
    // 1. Insertamos los detalles
    const queryDetalle = 'INSERT INTO detalle_pedidos (id_pedido, id_producto, precio_unitario) VALUES ?';
    db.query(queryDetalle, [detalles], (err) => {
      if (err) return res.status(500).json(err);

      // 2. ¡CLAVE!: Marcamos los productos como NO DISPONIBLES
      const idsProductos = productos.map(p => p.id_producto);
      const queryUpdate = 'UPDATE productos SET disponible = FALSE WHERE id_producto IN (?)';
      
      db.query(queryUpdate, [idsProductos], (err) => {
        if (err) return res.status(500).json(err);
        
        // 3. Limpiamos el carrito temporal
        db.query('DELETE FROM carrito_temporal WHERE id_usuario = ?', [id_usuario]);
        
        res.json({ success: true, message: '¡Compra exitosa! Esta prenda ya es tuya.' });
      });
    });
  });
});

// Guardar un producto en el carrito de la BD
app.post('/api/carrito/guardar', (req, res) => {
  const { id_usuario, id_producto } = req.body;
  const query = 'INSERT INTO carrito_temporal (id_usuario, id_producto) VALUES (?, ?)';
  db.query(query, [id_usuario, id_producto], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ success: true });
  });
});

// Obtener el carrito al iniciar sesión
app.get('/api/carrito/:id_usuario', (req, res) => {
  const query = `
    SELECT p.* FROM productos p 
    JOIN carrito_temporal c ON p.id_producto = c.id_producto 
    WHERE c.id_usuario = ?`;
  db.query(query, [req.params.id_usuario], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});


app.delete('/api/carrito/:id_usuario/:id_producto', (req, res) => {
  const { id_usuario, id_producto } = req.params;
  
  // Borramos solo UN registro que coincida con el usuario y el producto
  const query = 'DELETE FROM carrito_temporal WHERE id_usuario = ? AND id_producto = ? LIMIT 1';
  
  db.query(query, [id_usuario, id_producto], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ success: true, message: 'Producto eliminado' });
  });
});

app.get('/api/productos/buscar', (req, res) => {
  const termino = req.query.q;
  const valor = `%${termino}%`;

  // Asegúrate de que los nombres de las columnas coincidan con tu tabla productos
  const query = `
    SELECT * FROM productos 
    WHERE disponible = TRUE 
    AND (nombre LIKE ? OR marca LIKE ? OR descripcion LIKE ?)
  `;

  db.query(query, [valor, valor, valor], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});