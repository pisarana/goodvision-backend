import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../domain/models/cliente.model';
import { ClienteRepository } from '../domain/repositories/cliente.repository';

@Injectable({ providedIn: 'root' })
export class ClientesApplication {
  constructor(private readonly clienteRepository: ClienteRepository) {}

  list(searchTerm = ''): Observable<Cliente[]> {
    const term = searchTerm.trim();
    return term ? this.clienteRepository.searchByApellido(term) : this.clienteRepository.findAll();
  }

  save(cliente: Cliente): Observable<Cliente> {
    if (cliente.idCliente) {
      return this.clienteRepository.update(cliente.idCliente, cliente);
    }

    return this.clienteRepository.save(cliente);
  }

  delete(id: number): Observable<void> {
    return this.clienteRepository.delete(id);
  }
}
