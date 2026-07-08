import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Venta, VentaRequest } from '../../domain/models/venta.model';
import { VentaRepository } from '../../domain/repositories/venta.repository';

@Injectable()
export class VentaApiRepository implements VentaRepository {
  private readonly apiUrl = `${environment.apiBaseUrl}/ventas`;

  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private readonly http: HttpClient) {}

  findAll(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.apiUrl);
  }

  findById(id: number): Observable<Venta> {
    return this.http.get<Venta>(`${this.apiUrl}/${id}`);
  }

  findByCliente(idCliente: number): Observable<Venta[]> {
    return this.http.get<Venta[]>(`${this.apiUrl}/cliente/${idCliente}`);
  }

  save(venta: VentaRequest): Observable<Venta> {
    return this.http.post<Venta>(this.apiUrl, venta, this.httpOptions);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
