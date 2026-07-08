import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model';

export abstract class ProductoRepository {
  abstract findAll(): Observable<Producto[]>;
  abstract searchByNombre(nombre: string): Observable<Producto[]>;
  abstract save(producto: Producto): Observable<Producto>;
  abstract update(id: number, producto: Producto): Observable<Producto>;
  abstract delete(id: number): Observable<void>;
}
