import { Observable } from 'rxjs';
import { Inventario } from '../models/inventario.model';

export abstract class InventarioRepository {
  abstract findAll(): Observable<Inventario[]>;
  abstract searchByProducto(nombre: string): Observable<Inventario[]>;
  abstract save(inventario: Inventario): Observable<Inventario>;
  abstract update(id: number, inventario: Inventario): Observable<Inventario>;
  abstract delete(id: number): Observable<void>;
}
