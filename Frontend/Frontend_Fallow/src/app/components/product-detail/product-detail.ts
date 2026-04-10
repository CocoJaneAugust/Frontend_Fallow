import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router'; // Para leer el ID de la URL
import { ProductoService } from '../../services/producto';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';
import { CartService } from '../../services/cart';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, Navbar, Footer],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetailComponent implements OnInit {
  producto: any; // Aquí guardaremos el producto encontrado

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private cartService: CartService,
    private http: HttpClient
  ) {}

agregarAlCarrito() {
  if (this.producto) {
    this.cartService.addToCart(this.producto);
    
    // Si hay un usuario logueado, lo guardamos en la BD también
    const user = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (user.id_usuario) {
      this.http.post('http://localhost:3000/api/carrito/guardar', {
        id_usuario: user.id_usuario,
        id_producto: this.producto.id_producto
      }).subscribe();
    }
  }
}

ngOnInit(): void {
  const id = Number(this.route.snapshot.paramMap.get('id'));
  
  this.productoService.getProductos().subscribe(productos => {
    // Cambiamos p.id por p.id_producto
    this.producto = productos.find(p => p.id_producto === id);
  });
}
}