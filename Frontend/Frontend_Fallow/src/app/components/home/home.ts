import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  productos: any[] = [];

  constructor(
    private productoService: ProductoService,
    private route: ActivatedRoute // Inyectar la ruta activa
  ) {}

ngOnInit(): void {
  this.route.queryParams.subscribe(params => {
    const categoria = params['cat'];
    const busqueda = params['q']; // Capturamos la 'q' de la URL

    if (busqueda) {
      // Si hay búsqueda, usamos el nuevo método
      this.productoService.buscarProductos(busqueda).subscribe({
        next: (data) => {
          this.productos = data;
          console.log('Resultados de búsqueda:', data);
        },
        error: (err) => console.error(err)
      });
    } else {
      // Si no hay búsqueda, cargamos por categoría o todo
      this.cargarProductos(categoria);
    }
  });
}

  cargarProductos(categoria?: string): void {
    this.productoService.getProductos(categoria).subscribe(data => {
      this.productos = data;
    });
  }
}