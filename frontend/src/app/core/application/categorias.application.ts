import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria } from '../domain/models/producto.model';
import { CategoriaRepository } from '../domain/repositories/categoria.repository';

@Injectable({ providedIn: 'root' })
export class CategoriasApplication {
  constructor(private readonly categoriaRepository: CategoriaRepository) {}

  list(): Observable<Categoria[]> {
    return this.categoriaRepository.findAll();
  }

  findById(id: number): Observable<Categoria> {
    return this.categoriaRepository.findById(id);
  }

  findByNombre(nombre: string): Observable<Categoria[]> {
    return this.categoriaRepository.findByNombre(nombre);
  }

  save(categoria: Categoria): Observable<Categoria> {
    return this.categoriaRepository.save(categoria);
  }

  update(id: number, categoria: Categoria): Observable<Categoria> {
    return this.categoriaRepository.update(id, categoria);
  }

  delete(id: number): Observable<void> {
    return this.categoriaRepository.delete(id);
  }
}
