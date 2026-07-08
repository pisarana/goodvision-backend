import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Venta, VentaRequest } from '../domain/models/venta.model';
import { VentaRepository } from '../domain/repositories/venta.repository';

@Injectable({ providedIn: 'root' })
export class VentasApplication {
  constructor(private readonly ventaRepository: VentaRepository) {}

  list(): Observable<Venta[]> {
    return this.ventaRepository.findAll();
  }

  findById(id: number): Observable<Venta> {
    return this.ventaRepository.findById(id);
  }

  findByCliente(idCliente: number): Observable<Venta[]> {
    return this.ventaRepository.findByCliente(idCliente);
  }

  save(venta: VentaRequest): Observable<Venta> {
    return this.ventaRepository.save(venta);
  }

  delete(id: number): Observable<void> {
    return this.ventaRepository.delete(id);
  }
}
