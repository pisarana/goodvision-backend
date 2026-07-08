import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';

export abstract class ClienteRepository {
  abstract findAll(): Observable<Cliente[]>;
  abstract searchByApellido(apellido: string): Observable<Cliente[]>;
  abstract save(cliente: Cliente): Observable<Cliente>;
  abstract update(id: number, cliente: Cliente): Observable<Cliente>;
  abstract delete(id: number): Observable<void>;
}
