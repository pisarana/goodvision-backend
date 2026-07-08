package com.goodvision.service.impl;

import com.goodvision.entity.Categoria;
import com.goodvision.entity.Producto;
import com.goodvision.exception.BusinessRuleViolationException;
import com.goodvision.exception.ResourceNotFoundException;
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
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", id));
    }

    @Override
    public Producto guardarProducto(Producto producto) {
        // Validate category exists
        if (producto.getCategoria() == null || producto.getCategoria().getIdCategoria() == null) {
            throw new BusinessRuleViolationException("Debe especificar una categoría válida para el producto");
        }

        return productoRepository.save(producto);
    }

    @Override
    public Producto actualizarProducto(Long id, Producto producto) {

        Producto productoExistente = obtenerProductoPorId(id);

        // Validate category exists
        if (producto.getCategoria() == null || producto.getCategoria().getIdCategoria() == null) {
            throw new BusinessRuleViolationException("Debe especificar una categoría válida para el producto");
        }

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