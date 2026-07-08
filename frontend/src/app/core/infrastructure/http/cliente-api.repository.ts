import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Cliente } from '../../domain/models/cliente.model';
import { ClienteRepository } from '../../domain/repositories/cliente.repository';

@Injectable()
export class ClienteApiRepository implements ClienteRepository {
  private readonly apiUrl = `${environment.apiBaseUrl}/cliente`;

  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private readonly http: HttpClient) {}

  findAll(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  searchByApellido(apellido: string): Observable<Cliente[]> {
    const params = new HttpParams().set('apellido', apellido);
    return this.http.get<Cliente[]>(`${this.apiUrl}/buscar`, { params });
  }

  save(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente, this.httpOptions);
  }

  update(id: number, cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, cliente, this.httpOptions);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
