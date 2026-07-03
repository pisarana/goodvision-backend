package com.goodvision.service;

import com.goodvision.entity.Inventario;

import java.util.List;

public interface InventarioService {

    List<Inventario> listarInventario();

    Inventario obtenerInventarioPorId(Long id);

    Inventario guardarInventario(Inventario inventario);

    Inventario actualizarInventario(Long id, Inventario inventario);

    void eliminarInventario(Long id);

    List<Inventario> buscarPorProducto(String nombre);
}
