import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http'; // 1. Importar HttpClient
import { Router, RouterModule } from '@angular/router'; // 2. Importar Router
import { CartService } from '../../services/cart';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, Navbar, Footer, RouterModule],
  templateUrl: './cart.html',
})
export class Cart implements OnInit {
  items: any[] = [];
  total: number = 0;

  // 3. Inyectar HttpClient y Router en el constructor
  constructor(
    private cartService: CartService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.items = this.cartService.getItems();
    this.calcularTotal();
  }

  calcularTotal() {
    this.total = this.items.reduce((acc, item) => acc + (Number(item.precio) || 0), 0);
  }

  eliminarItem(index: number) {
  const itemAEliminar = this.items[index];
  const user = JSON.parse(localStorage.getItem('usuario') || '{}');

  // 1. Quitar de la vista inmediatamente
  this.items.splice(index, 1);
  this.calcularTotal();

  // 2. Si hay usuario, avisar al Backend para que lo borre de MySQL
  if (user.id_usuario && itemAEliminar.id_producto) {
    this.http.delete(`http://localhost:3000/api/carrito/${user.id_usuario}/${itemAEliminar.id_producto}`)
      .subscribe({
        next: () => {
          console.log('Eliminado de la base de datos');
          // Actualizar el numerito del Navbar
          this.cartService.cargarCarritoDesdeBD(this.items);
        },
        error: (err) => console.error('Error al eliminar:', err)
      });
  }
}

  finalizarCompra() {
    // 4. Obtener datos del usuario desde el localStorage
    const datosUsuario = JSON.parse(localStorage.getItem('usuario') || '{}');

    if (!datosUsuario.id_usuario) {
      alert('Debes iniciar sesión para finalizar la compra');
      this.router.navigate(['/login']);
      return;
    }

    const pedido = {
      id_usuario: datosUsuario.id_usuario,
      total: this.total,
      productos: this.items
    };

    // 5. Enviar al Backend
    this.http.post('http://localhost:3000/api/pedidos', pedido).subscribe({
      next: (res: any) => {
        alert(res.message);
        this.items = []; // Limpiamos la vista
        this.cartService.limpiarCarrito(); // 6. Asegúrate que este método existe en tu servicio
        this.calcularTotal();
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Error al procesar compra', err);
        alert('Hubo un error al procesar tu compra.');
      }
    });
  }
}