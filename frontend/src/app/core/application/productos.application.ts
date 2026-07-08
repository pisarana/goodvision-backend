import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from '../domain/models/producto.model';
import { ProductoRepository } from '../domain/repositories/producto.repository';

@Injectable({ providedIn: 'root' })
export class ProductosApplication {
  constructor(private readonly productoRepository: ProductoRepository) {}

  list(searchTerm = ''): Observable<Producto[]> {
    const term = searchTerm.trim();
    return term ? this.productoRepository.searchByNombre(term) : this.productoRepository.findAll();
  }

  save(producto: Producto): Observable<Producto> {
    if (producto.idProducto) {
      return this.productoRepository.update(producto.idProducto, producto);
    }

    return this.productoRepository.save(producto);
  }

  delete(id: number): Observable<void> {
    return this.productoRepository.delete(id);
  }
}
