import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateUsuarioRequest, Usuario } from '../domain/models/usuario.model';
import { UsuarioRepository } from '../domain/repositories/usuario.repository';

@Injectable({ providedIn: 'root' })
export class UsuariosApplication {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  list(searchTerm = ''): Observable<Usuario[]> {
    const term = searchTerm.trim();
    return term ? this.usuarioRepository.searchByNombre(term) : this.usuarioRepository.findAll();
  }

  create(data: CreateUsuarioRequest): Observable<any> {
    return this.usuarioRepository.create(data);
  }

  update(id: number, usuario: Usuario): Observable<Usuario> {
    return this.usuarioRepository.update(id, usuario);
  }

  delete(id: number): Observable<void> {
    return this.usuarioRepository.delete(id);
  }
}
