import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html'
})
export class Register {
  newUser = {
    nombre: '',
    correo: '',
    password: '',
    rol: 'cliente' // Rol por defecto
  };

  constructor(private http: HttpClient, private router: Router) {}

  onRegister() {
    this.http.post('http://localhost:3000/api/registro', this.newUser)
      .subscribe({
        next: (res: any) => {
          alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Error al registrar:', err);
          alert('Hubo un error al crear la cuenta. Intenta con otro correo.');
        }
      });
  }
}
