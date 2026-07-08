import { Observable } from 'rxjs';
import { CreateUsuarioRequest, Usuario } from '../models/usuario.model';

export abstract class UsuarioRepository {
  abstract findAll(): Observable<Usuario[]>;
  abstract findById(id: number): Observable<Usuario>;
  abstract searchByNombre(nombre: string): Observable<Usuario[]>;
  abstract create(data: CreateUsuarioRequest): Observable<any>;
  abstract update(id: number, usuario: Usuario): Observable<Usuario>;
  abstract delete(id: number): Observable<void>;
}
