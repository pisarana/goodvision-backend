import { Observable } from 'rxjs';
import { Categoria } from '../models/producto.model';

export abstract class CategoriaRepository {
  abstract findAll(): Observable<Categoria[]>;
  abstract findById(id: number): Observable<Categoria>;
  abstract findByNombre(nombre: string): Observable<Categoria[]>;
  abstract save(categoria: Categoria): Observable<Categoria>;
  abstract update(id: number, categoria: Categoria): Observable<Categoria>;
  abstract delete(id: number): Observable<void>;
}
