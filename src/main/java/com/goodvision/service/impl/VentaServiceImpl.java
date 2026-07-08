package com.goodvision.service.impl;

import com.goodvision.dto.VentaRequest;
import com.goodvision.entity.*;
import com.goodvision.exception.BusinessRuleViolationException;
import com.goodvision.exception.ResourceNotFoundException;
import com.goodvision.repository.ClienteRepository;
import com.goodvision.repository.InventarioRepository;
import com.goodvision.repository.ProductoRepository;
import com.goodvision.repository.VentaRepository;
import com.goodvision.service.VentaService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class VentaServiceImpl implements VentaService {

    private final VentaRepository ventaRepository;
    private final ClienteRepository clienteRepository;
    private final ProductoRepository productoRepository;
    private final InventarioRepository inventarioRepository;

    public VentaServiceImpl(
            VentaRepository ventaRepository,
            ClienteRepository clienteRepository,
            ProductoRepository productoRepository,
            InventarioRepository inventarioRepository) {
        this.ventaRepository = ventaRepository;
        this.clienteRepository = clienteRepository;
        this.productoRepository = productoRepository;
        this.inventarioRepository = inventarioRepository;
    }

    @Override
    public List<Venta> findAll() {
        return ventaRepository.findAllOrderByFechaDesc();
    }

    @Override
    public Venta findById(Long id) {
        return ventaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venta", "id", id));
    }

    @Override
    @Transactional
    public Venta save(VentaRequest request) {
        Cliente cliente = clienteRepository.findById(request.getIdCliente())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", "id", request.getIdCliente()));

        for (VentaRequest.DetalleVentaRequest detalleReq : request.getDetalles()) {
            Inventario inv = inventarioRepository.findByProductoIdProducto(detalleReq.getIdProducto())
                    .orElseThrow(() -> new ResourceNotFoundException("Inventario para producto", "id", detalleReq.getIdProducto()));
            if (inv.getStock() < detalleReq.getCantidad()) {
                throw new BusinessRuleViolationException(
                        "Stock insuficiente para producto id " + detalleReq.getIdProducto() +
                        ". Disponible: " + inv.getStock() + ", solicitado: " + detalleReq.getCantidad());
            }
        }

        Venta venta = new Venta();
        venta.setCliente(cliente);
        venta.setMetodoPago(request.getMetodoPago());

        BigDecimal total = BigDecimal.ZERO;
        for (VentaRequest.DetalleVentaRequest detalleReq : request.getDetalles()) {
            Producto producto = productoRepository.findById(detalleReq.getIdProducto())
                    .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", detalleReq.getIdProducto()));

            DetalleVenta detalle = new DetalleVenta();
            detalle.setProducto(producto);
            detalle.setCantidad(detalleReq.getCantidad());
            detalle.setPrecioUnitario(detalleReq.getPrecioUnitario());

            BigDecimal subtotal = detalleReq.getPrecioUnitario()
                    .multiply(BigDecimal.valueOf(detalleReq.getCantidad()));
            detalle.setSubtotal(subtotal);

            venta.addDetalle(detalle);
            total = total.add(subtotal);

            Inventario inv = inventarioRepository.findByProductoIdProducto(detalleReq.getIdProducto()).get();
            inv.setStock(inv.getStock() - detalleReq.getCantidad());
            inventarioRepository.save(inv);
        }

        venta.setTotal(total);

        return ventaRepository.save(venta);
    }

    @Override
    public List<Venta> findByCliente(Long idCliente) {
        return ventaRepository.findByCliente_IdCliente(idCliente);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Venta venta = findById(id);
        for (DetalleVenta detalle : venta.getDetalles()) {
            inventarioRepository.findByProductoIdProducto(detalle.getProducto().getIdProducto())
                    .ifPresent(inv -> {
                        inv.setStock(inv.getStock() + detalle.getCantidad());
                        inventarioRepository.save(inv);
                    });
        }
        ventaRepository.delete(venta);
    }
}
