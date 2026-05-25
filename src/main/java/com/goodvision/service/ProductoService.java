package com.goodvision.service;

import com.goodvision.entity.Producto;

import java.util.List;

public interface ProductoService {

    List<Producto> listarProductos();

    Producto obtenerProductoPorId(Long id);

    Producto guardarProducto(Producto producto);

    Producto actualizarProducto(Long id, Producto producto);

    void eliminarProducto(Long id);

    List<Producto> buscarPorNombre(String nombre);
}