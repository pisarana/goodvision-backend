package com.goodvision.service;

import com.goodvision.dto.VentaRequest;
import com.goodvision.entity.Venta;

import java.util.List;

public interface VentaService {
    List<Venta> findAll();
    Venta findById(Long id);
    Venta save(VentaRequest request);
    List<Venta> findByCliente(Long idCliente);
    void delete(Long id);
}
