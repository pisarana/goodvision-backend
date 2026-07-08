import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Inventario } from '../../domain/models/inventario.model';
import { InventarioRepository } from '../../domain/repositories/inventario.repository';

@Injectable()
export class InventarioApiRepository implements InventarioRepository {
  private readonly apiUrl = `${environment.apiBaseUrl}/inventario`;

  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private readonly http: HttpClient) {}

  findAll(): Observable<Inventario[]> {
    return this.http.get<Inventario[]>(this.apiUrl);
  }

  searchByProducto(nombre: string): Observable<Inventario[]> {
    const params = new HttpParams().set('nombre', nombre);
    return this.http.get<Inventario[]>(`${this.apiUrl}/buscar`, { params });
  }

  save(inventario: Inventario): Observable<Inventario> {
    return this.http.post<Inventario>(this.apiUrl, inventario, this.httpOptions);
  }

  update(id: number, inventario: Inventario): Observable<Inventario> {
    return this.http.put<Inventario>(`${this.apiUrl}/${id}`, inventario, this.httpOptions);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
