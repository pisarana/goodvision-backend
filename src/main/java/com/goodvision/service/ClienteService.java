package com.goodvision.service;

import com.goodvision.entity.Cliente;

import java.util.List;

public interface ClienteService {

    List<Cliente> listarClientes();

    Cliente obtenerClientePorId(Long id);

    Cliente guardarCliente(Cliente cliente);

    Cliente actualizarCliente(Long id, Cliente cliente);

    void eliminarCliente(Long id);

    List<Cliente> buscarPorApellido(String apellido);
}