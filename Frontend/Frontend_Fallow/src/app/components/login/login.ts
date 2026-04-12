import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html'
})

export class Login {
  // Objeto inicializado para evitar errores de undefined en el HTML
  user = {
    correo: '',
    password: '' // Usamos password consistentemente
  };
  
  errorMessage: string = '';

  constructor(private router: Router, private http: HttpClient, private cartService: CartService) {}

  onLogin() {
    this.errorMessage = ''; // Limpiamos errores previos

    this.http.post('http://localhost:3000/api/login', this.user)
      .subscribe({
        next: (res: any) => {
          if (res.auth) {
            // Guardamos la sesión en el navegador
            localStorage.setItem('usuario', JSON.stringify(res.usuario));
            // Dentro de onLogin() en login.ts, después de guardar el usuario en localStorage:
this.http.get(`http://localhost:3000/api/carrito/${res.usuario.id_usuario}`)
  .subscribe((productos: any) => {
    // Supongamos que tu cartService tiene un método para cargar varios
    this.cartService.cargarCarritoDesdeBD(productos);
    this.router.navigate(['/home']);
  });
          }
        },
        error: (err) => {
          this.errorMessage = 'Correo o contraseña incorrectos';
          console.error('Error de login:', err);
        }
      });
  }
}