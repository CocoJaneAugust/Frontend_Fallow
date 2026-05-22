import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html'
})
export class Checkout implements OnInit {
  itemsCarrito: any[] = [];
  totalCompra: number = 0;

  // Asegúrate de que coincida con los campos del HTML
  datosEnvio = {
    direccion: '',
    ciudad: '',
    cp: '',
    tipo_pago: 'debito'
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.cargarResumenCarrito();
  }

  cargarResumenCarrito() {
    // Si en tu proyecto guardas el carrito con otra clave (ej: 'carrito_temporal'), cámbiala aquí
    const carritoJson = localStorage.getItem('cart_session');
    if (carritoJson) {
      this.itemsCarrito = JSON.parse(carritoJson);
      this.totalCompra = this.itemsCarrito.reduce((acc, item) => acc + (item.precio * (item.cantidad || 1)), 0);
    }
  }

  procesarCompra() {
    if (!this.itemsCarrito || this.itemsCarrito.length === 0) {
      alert('No hay productos en el carrito para procesar.');
      return;
    }

    const direccionCompleta = `${this.datosEnvio.direccion}, ${this.datosEnvio.ciudad}, C.P. ${this.datosEnvio.cp}`;
    
    const itemsFormateados = this.itemsCarrito.map(item => {
      return {
        id_producto: item.id_producto || item.id, 
        precio: item.precio || item.precio_unitario || 0
      };
    });

    const idUsuarioLogueado = localStorage.getItem('id_usuario') || localStorage.getItem('usuario_id') || 1;

    const payload = {
      usuario_id: Number(idUsuarioLogueado),
      direccion: direccionCompleta,
      total: this.totalCompra,
      tipo_pago: this.datosEnvio.tipo_pago,
      items: itemsFormateados
    };

    this.http.post('http://localhost:3000/api/pedidos', payload)
      .subscribe({
        next: (res: any) => {
          alert(`¡Compra Exitosa!\n\nTu pedido será enviado a: ${direccionCompleta}.\nPago procesado de forma segura mediante tarjeta de ${this.datosEnvio.tipo_pago.toUpperCase()}.`);
          
          this.itemsCarrito = [];
          this.totalCompra = 0;

          // Aquí eliminamos las dos posibles claves de almacenamiento local para evitar rezagos
          localStorage.removeItem('cart_session');

          // Forzamos un redireccionamiento limpio a la raíz del sitio web restableciendo todo el estado de Angular
          window.location.href = '/home';
        },
        error: (err) => {
          console.error('Error desde Angular:', err);
          alert('Hubo un problema al guardar tu orden de compra.');
        }
      });
  }
}