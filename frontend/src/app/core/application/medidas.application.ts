import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EvaluacionMedida, EvaluacionMedidaRequest } from '../domain/models/medida.model';
import { MedidaRepository } from '../domain/repositories/medida.repository';

@Injectable({ providedIn: 'root' })
export class MedidasApplication {
  constructor(private readonly medidaRepository: MedidaRepository) {}

  list(): Observable<EvaluacionMedida[]> {
    return this.medidaRepository.findAll();
  }

  findById(id: number): Observable<EvaluacionMedida> {
    return this.medidaRepository.findById(id);
  }

  findByCliente(idCliente: number): Observable<EvaluacionMedida[]> {
    return this.medidaRepository.findByCliente(idCliente);
  }

  findByUsuario(idUsuario: number): Observable<EvaluacionMedida[]> {
    return this.medidaRepository.findByUsuario(idUsuario);
  }

  save(medida: EvaluacionMedidaRequest): Observable<EvaluacionMedida> {
    return this.medidaRepository.save(medida);
  }

  delete(id: number): Observable<void> {
    return this.medidaRepository.delete(id);
  }
}
