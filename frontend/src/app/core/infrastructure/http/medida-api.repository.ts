import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EvaluacionMedida, EvaluacionMedidaRequest } from '../../domain/models/medida.model';
import { MedidaRepository } from '../../domain/repositories/medida.repository';

@Injectable()
export class MedidaApiRepository implements MedidaRepository {
  private readonly apiUrl = `${environment.apiBaseUrl}/medidas`;

  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private readonly http: HttpClient) {}

  findAll(): Observable<EvaluacionMedida[]> {
    return this.http.get<EvaluacionMedida[]>(this.apiUrl);
  }

  findById(id: number): Observable<EvaluacionMedida> {
    return this.http.get<EvaluacionMedida>(`${this.apiUrl}/${id}`);
  }

  findByCliente(idCliente: number): Observable<EvaluacionMedida[]> {
    return this.http.get<EvaluacionMedida[]>(`${this.apiUrl}/cliente/${idCliente}`);
  }

  findByUsuario(idUsuario: number): Observable<EvaluacionMedida[]> {
    return this.http.get<EvaluacionMedida[]>(`${this.apiUrl}/usuario/${idUsuario}`);
  }

  save(medida: EvaluacionMedidaRequest): Observable<EvaluacionMedida> {
    return this.http.post<EvaluacionMedida>(this.apiUrl, medida, this.httpOptions);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
