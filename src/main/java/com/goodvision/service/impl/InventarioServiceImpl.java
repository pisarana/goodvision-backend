package com.goodvision.service.impl;

import com.goodvision.entity.Inventario;
import com.goodvision.entity.Producto;
import com.goodvision.repository.InventarioRepository;
import com.goodvision.repository.ProductoRepository;
import com.goodvision.service.InventarioService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventarioServiceImpl implements InventarioService {

    private final InventarioRepository inventarioRepository;
    private final ProductoRepository productoRepository;

    public InventarioServiceImpl(
            InventarioRepository inventarioRepository,
            ProductoRepository productoRepository) {

        this.inventarioRepository = inventarioRepository;
        this.productoRepository = productoRepository;
    }

    @Override
    public List<Inventario> listarInventario() {
        return inventarioRepository.findAll();
    }

    @Override
    public Inventario obtenerInventarioPorId(Long id) {
        return inventarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventario no encontrado"));
    }

    @Override
    public Inventario guardarInventario(Inventario inventario) {
        Producto producto = obtenerProducto(inventario);

        inventarioRepository.findByProductoIdProducto(producto.getIdProducto())
                .ifPresent(existente -> {
                    throw new RuntimeException("El producto ya tiene inventario registrado");
                });

        inventario.setProducto(producto);
        normalizarValores(inventario);

        return inventarioRepository.save(inventario);
    }

    @Override
    public Inventario actualizarInventario(Long id, Inventario inventario) {
        Inventario inventarioExistente = obtenerInventarioPorId(id);
        Producto producto = obtenerProducto(inventario);

        inventarioRepository.findByProductoIdProducto(producto.getIdProducto())
                .filter(existente -> !existente.getIdInventario().equals(id))
                .ifPresent(existente -> {
                    throw new RuntimeException("El producto ya tiene inventario registrado");
                });

        inventarioExistente.setProducto(producto);
        inventarioExistente.setStock(inventario.getStock());
        inventarioExistente.setStockMinimo(inventario.getStockMinimo());
        normalizarValores(inventarioExistente);

        return inventarioRepository.save(inventarioExistente);
    }

    @Override
    public void eliminarInventario(Long id) {
        Inventario inventario = obtenerInventarioPorId(id);
        inventarioRepository.delete(inventario);
    }

    @Override
    public List<Inventario> buscarPorProducto(String nombre) {
        return inventarioRepository.findByProductoNombreProductoContainingIgnoreCase(nombre);
    }

    private Producto obtenerProducto(Inventario inventario) {
        if (inventario.getProducto() == null || inventario.getProducto().getIdProducto() == null) {
            throw new RuntimeException("Producto requerido");
        }

        return productoRepository.findById(inventario.getProducto().getIdProducto())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    private void normalizarValores(Inventario inventario) {
        if (inventario.getStock() == null) {
            inventario.setStock(0);
        }

        if (inventario.getStockMinimo() == null) {
            inventario.setStockMinimo(5);
        }
    }
}
