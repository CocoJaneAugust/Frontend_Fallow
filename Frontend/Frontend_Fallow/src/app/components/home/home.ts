import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class Home implements OnInit, OnDestroy {
  // Variables para el Carrusel
  imagenActivaIndex: number = 0;
  private intervaloId: any;
  imagenes = [
  { url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop', alt: 'Moda Minimalista' },
  { url: 'https://images.pexels.com/photos/842811/pexels-photo-842811.jpeg?auto=compress&cs=tinysrgb&w=1920', alt: 'Tendencias de Temporada' },
  { url: 'https://images.pexels.com/photos/206512/pexels-photo-206512.jpeg?auto=compress&cs=tinysrgb&w=1920', alt: 'Estilo Vintage' },
  { url: 'https://images.pexels.com/photos/1040851/pexels-photo-1040851.jpeg?auto=compress&cs=tinysrgb&w=1920', alt: 'Moda Sostenible' },
  { url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop', alt: 'Nueva Colección' }
  
];

  productos: any[] = [];

  constructor(
    private productoService: ProductoService,
    private route: ActivatedRoute // Inyectar la ruta activa
  ) {}

ngOnInit(): void {
  this.iniciarCarrusel();
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

  ngOnDestroy(): void {
    if (this.intervaloId) {
      clearInterval(this.intervaloId);
    }
  }

  iniciarCarrusel() {
    this.intervaloId = setInterval(() => {
      this.imagenActivaIndex = (this.imagenActivaIndex + 1) % this.imagenes.length;
    }, 5000);
  }

  cargarProductos(categoria?: string): void {
    this.productoService.getProductos(categoria).subscribe(data => {
      this.productos = data;
    });
  }
}