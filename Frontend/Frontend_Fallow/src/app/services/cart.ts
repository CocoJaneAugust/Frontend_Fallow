import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'; // Para que el Navbar se entere de los cambios

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: any[] = [];
  
  // Este "Subject" es como una campana: cuando cambia el carrito, la hace sonar
  private _cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this._cartCount.asObservable();

  constructor() {
    // Si ya tenías algo en memoria local al recargar la página, lo recuperamos
    const savedCart = localStorage.getItem('cart_session');
    if (savedCart) {
      this.items = JSON.parse(savedCart);
      this._cartCount.next(this.items.length);
    }
  }

  // EL MÉTODO QUE NECESITAS:
  cargarCarritoDesdeBD(productos: any[]) {
    // Reemplazamos los ítems actuales por los que vienen de la base de datos
    this.items = productos;
    // Avisamos al Navbar que el número de productos cambió
    this._cartCount.next(this.items.length);
    // Guardamos una copia en el navegador por si refresca la página
    localStorage.setItem('cart_session', JSON.stringify(this.items));
  }

  addToCart(producto: any) {
  // Verificamos si ya existe por su ID único
  const existe = this.items.find(item => item.id_producto === producto.id_producto);

  if (existe) {
    alert('Esta es una prenda única y ya está en tu carrito 🌿');
    return;
  }

  this.items.push(producto);
  this._cartCount.next(this.items.length);
  localStorage.setItem('cart_session', JSON.stringify(this.items));
}

  getItems() {
    return this.items;
  }

  limpiarCarrito() {
    this.items = [];
    this._cartCount.next(0);
    localStorage.removeItem('cart_session');
  }
}