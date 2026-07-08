import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Inventario } from '../domain/models/inventario.model';
import { InventarioRepository } from '../domain/repositories/inventario.repository';

@Injectable({ providedIn: 'root' })
export class InventarioApplication {
  constructor(private readonly inventarioRepository: InventarioRepository) {}

  list(searchTerm = ''): Observable<Inventario[]> {
    const term = searchTerm.trim();
    return term ? this.inventarioRepository.searchByProducto(term) : this.inventarioRepository.findAll();
  }

  save(inventario: Inventario): Observable<Inventario> {
    if (inventario.idInventario) {
      return this.inventarioRepository.update(inventario.idInventario, inventario);
    }

    return this.inventarioRepository.save(inventario);
  }

  delete(id: number): Observable<void> {
    return this.inventarioRepository.delete(id);
  }
}
