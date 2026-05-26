package com.goodvision.service.impl;

import com.goodvision.entity.Cliente;
import com.goodvision.repository.ClienteRepository;
import com.goodvision.service.ClienteService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteServiceImpl implements ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteServiceImpl(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @Override
    public List<Cliente> listarClientes() {
        return clienteRepository.findAll();
    }

    @Override
    public Cliente obtenerClientePorId(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
    }

    @Override
    public Cliente guardarCliente(Cliente cliente) {

        clienteRepository.findByDocumento(cliente.getDocumento())
                .ifPresent(c -> {
                    throw new RuntimeException("Ya existe un cliente con ese documento");
                });

        return clienteRepository.save(cliente);
    }

    @Override
    public Cliente actualizarCliente(Long id, Cliente cliente) {

        Cliente clienteExistente = obtenerClientePorId(id);

        clienteExistente.setNombre(cliente.getNombre());
        clienteExistente.setApellido(cliente.getApellido());
        clienteExistente.setDocumento(cliente.getDocumento());
        clienteExistente.setTelefono(cliente.getTelefono());
        clienteExistente.setDireccion(cliente.getDireccion());
        clienteExistente.setCorreo(cliente.getCorreo());

        return clienteRepository.save(clienteExistente);
    }

    @Override
    public void eliminarCliente(Long id) {

        Cliente cliente = obtenerClientePorId(id);

        clienteRepository.delete(cliente);
    }

    @Override
    public List<Cliente> buscarPorApellido(String apellido) {
        return clienteRepository.findByApellidoContainingIgnoreCase(apellido);
    }
}