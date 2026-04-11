import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})

export class Navbar implements OnInit {
  cantidadCarrito: number = 0;
  terminoBusqueda: string = '';

  constructor(
    private cartService: CartService,
    private router: Router // Inyectar Router
  ) {}

  nombreUsuario: string = '';
  saludo: string = '';

  ngOnInit() {
    this.obtenerDatosUsuario();
    this.cartService.cartCount$.subscribe(count => {
      this.cantidadCarrito = count;
    });
  }

 obtenerDatosUsuario() {
    const usuarioJson = localStorage.getItem('usuario');
    if (usuarioJson) {
      const usuario = JSON.parse(usuarioJson);
      // Extraemos el nombre. Si no existe, usamos 'Invitado'
      this.nombreUsuario = usuario.nombre || 'Usuario'; 
      this.establecerSaludo();
    }
  }

  establecerSaludo() {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) {
      this.saludo = 'Buenos días';
    } else if (hora >= 12 && hora < 19) {
      this.saludo = 'Buenas tardes';
    } else {
      this.saludo = 'Buenas noches';
    }
  }

  get estaLogueado(): boolean {
    return localStorage.getItem('usuario') !== null;
  }


  cerrarSesion() {
    // 1. Borramos los datos del usuario
    localStorage.removeItem('usuario');
    
    // 2. Opcional: Borramos el carrito de la sesión actual
    this.cartService.limpiarCarrito();

    // 3. Redirigimos al Login
    this.router.navigate(['/login']);
  }

buscar() {
  if (this.terminoBusqueda.trim()) {
    // Navegamos al home pasando el término 'q'
    this.router.navigate(['/home'], { queryParams: { q: this.terminoBusqueda } });
    this.terminoBusqueda = ''; // Limpiamos el buscador
  }
}
}
