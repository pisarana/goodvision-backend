import { Observable } from 'rxjs';
import { Venta, VentaRequest } from '../models/venta.model';

export abstract class VentaRepository {
  abstract findAll(): Observable<Venta[]>;
  abstract findById(id: number): Observable<Venta>;
  abstract findByCliente(idCliente: number): Observable<Venta[]>;
  abstract save(venta: VentaRequest): Observable<Venta>;
  abstract delete(id: number): Observable<void>;
}
