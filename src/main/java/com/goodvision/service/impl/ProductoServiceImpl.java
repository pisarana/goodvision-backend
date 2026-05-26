package com.goodvision.service.impl;

import com.goodvision.entity.Producto;
import com.goodvision.repository.ProductoRepository;
import com.goodvision.service.ProductoService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;

    public ProductoServiceImpl(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @Override
    public List<Producto> listarProductos() {
        return productoRepository.findAll();
    }

    @Override
    public Producto obtenerProductoPorId(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    @Override
    public Producto guardarProducto(Producto producto) {
        return productoRepository.save(producto);
    }

    @Override
    public Producto actualizarProducto(Long id, Producto producto) {

        Producto productoExistente = obtenerProductoPorId(id);

        productoExistente.setNombreProducto(producto.getNombreProducto());
        productoExistente.setPrecio(producto.getPrecio());
        productoExistente.setCategoria(producto.getCategoria());

        return productoRepository.save(productoExistente);
    }

    @Override
    public void eliminarProducto(Long id) {

        Producto producto = obtenerProductoPorId(id);

        productoRepository.delete(producto);
    }

    @Override
    public List<Producto> buscarPorNombre(String nombre) {
        return productoRepository.findByNombreProductoContainingIgnoreCase(nombre);
    }
}