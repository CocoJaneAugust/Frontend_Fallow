import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Importar HttpClient
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:3000/api/productos'; // La URL de tu Backend

  constructor(private http: HttpClient) { }

  // Ahora pedimos los datos al servidor de verdad
  getProductos(categoria?: string): Observable<any[]> {
    let url = this.apiUrl;
    if (categoria) {
      url += `?categoria=${categoria}`;
    }
    return this.http.get<any[]>(url);
  }

  buscarProductos(termino: string): Observable<any[]> {
  return this.http.get<any[]>(`http://localhost:3000/api/productos/buscar?q=${termino}`);
}
}