package com.goodvision.service.impl;

import com.goodvision.entity.Cliente;
import com.goodvision.exception.BusinessRuleViolationException;
import com.goodvision.exception.DuplicateResourceException;
import com.goodvision.exception.ResourceNotFoundException;
import com.goodvision.repository.ClienteRepository;
import com.goodvision.service.ClienteService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

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
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", "id", id));
    }

    @Override
    public Cliente guardarCliente(Cliente cliente) {

        clienteRepository.findByDocumento(cliente.getDocumento())
                .ifPresent(c -> {
                    throw new DuplicateResourceException("Cliente", "documento", cliente.getDocumento());
                });

        return clienteRepository.save(cliente);
    }

    @Override
    public Cliente actualizarCliente(Long id, Cliente cliente) {

        Cliente clienteExistente = obtenerClientePorId(id);

        // Check if documento is being changed to a duplicate
        if (!clienteExistente.getDocumento().equals(cliente.getDocumento())) {
            Optional<Cliente> clienteConMismoDocumento = clienteRepository.findByDocumento(cliente.getDocumento());
            if (clienteConMismoDocumento.isPresent() && !clienteConMismoDocumento.get().getIdCliente().equals(id)) {
                throw new DuplicateResourceException("Cliente", "documento", cliente.getDocumento());
            }
        }

        clienteExistente.setNombre(cliente.getNombre());
        clienteExistente.setApellido(cliente.getApellido());
        clienteExistente.setDocumento(cliente.getDocumento());
        clienteExistente.setTelefono(cliente.getTelefono());
        clienteExistente.setDireccion(cliente.getDireccion());
        clienteExistente.setCorreo(cliente.getCorreo());

        return clienteRepository.save(clienteExistente);
    }

    @Override
    @Transactional
    public void eliminarCliente(Long id) {
        Cliente cliente = obtenerClientePorId(id);
        try {
            clienteRepository.delete(cliente);
            clienteRepository.flush();
        } catch (DataIntegrityViolationException e) {
            throw new BusinessRuleViolationException(
                "No se puede eliminar el cliente porque tiene ventas o evaluaciones asociadas"
            );
        }
    }

    @Override
    public List<Cliente> buscarPorApellido(String apellido) {
        return clienteRepository.findByApellidoContainingIgnoreCase(apellido);
    }
}