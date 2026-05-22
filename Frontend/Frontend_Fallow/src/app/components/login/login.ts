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

    // Validación simple de campos
    const correo = (this.user.correo || '').trim();
    const password = (this.user.password || '').trim();

    if (!correo || !password) {
      if (!correo && !password) {
        this.errorMessage = 'Por favor, ingresa correo y contraseña.';
      } else if (!correo) {
        this.errorMessage = 'Por favor, ingresa tu correo.';
      } else {
        this.errorMessage = 'Por favor, ingresa tu contraseña.';
      }
      return; // No enviar petición al backend
    }

    this.http.post('http://localhost:3000/api/login', this.user)
      .subscribe({
        next: (res: any) => {
          console.log('Respuesta login:', res);
          if (res.auth) {
            // Guardamos la sesión en el navegador
            localStorage.setItem('usuario', JSON.stringify(res.usuario));

            // Determinar id de usuario (flexible según nombre del campo)
            const userId = res.usuario?.id_usuario ?? res.usuario?.id ?? res.usuario?.userId;
            if (!userId) {
              console.warn('ID de usuario no encontrado en la respuesta:', res.usuario);
            }

            // Navegar al home inmediatamente (evita bloquear la navegación si el carrito falla)
            this.router.navigate(['/home']).catch(err => console.error('Error al navegar:', err));

            // Intentar cargar carrito, pero no bloquear la navegación si falla
            if (userId) {
              this.http.get(`http://localhost:3000/api/carrito/${userId}`)
                .subscribe({
                  next: (productos: any) => {
                    try {
                      this.cartService.cargarCarritoDesdeBD(productos);
                    } catch (e) {
                      console.warn('Error al cargar carrito en cartService:', e);
                    }
                  },
                  error: (err) => {
                    console.warn('No se pudo obtener el carrito:', err);
                  }
                });
            }
          } else {
            this.errorMessage = 'Correo o contraseña incorrectos';
          }
        },
        error: (err) => {
          this.errorMessage = 'Correo o contraseña incorrectos';
          console.error('Error de login:', err);
        }
      });
  }
}