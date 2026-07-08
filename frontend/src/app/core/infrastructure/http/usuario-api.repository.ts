import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CreateUsuarioRequest, Usuario } from '../../domain/models/usuario.model';
import { UsuarioRepository } from '../../domain/repositories/usuario.repository';

@Injectable()
export class UsuarioApiRepository implements UsuarioRepository {
  private readonly apiUrl = `${environment.apiBaseUrl}/usuarios`;

  constructor(private readonly http: HttpClient) {}

  findAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  findById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  searchByNombre(nombre: string): Observable<Usuario[]> {
    const params = new HttpParams().set('nombre', nombre);
    return this.http.get<Usuario[]>(`${this.apiUrl}/buscar`, { params });
  }

  create(data: CreateUsuarioRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  update(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
