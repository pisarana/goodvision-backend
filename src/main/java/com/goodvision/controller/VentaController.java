package com.goodvision.controller;

import com.goodvision.dto.VentaRequest;
import com.goodvision.entity.Venta;
import com.goodvision.service.VentaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ventas")
@CrossOrigin(origins = "*")
public class VentaController {

    private final VentaService ventaService;

    public VentaController(VentaService ventaService) {
        this.ventaService = ventaService;
    }

    @GetMapping
    public ResponseEntity<List<Venta>> findAll() {
        return ResponseEntity.ok(ventaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Venta> findById(@PathVariable Long id) {
        return ResponseEntity.ok(ventaService.findById(id));
    }

    @GetMapping("/cliente/{idCliente}")
    public ResponseEntity<List<Venta>> findByCliente(@PathVariable Long idCliente) {
        return ResponseEntity.ok(ventaService.findByCliente(idCliente));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ESPECIALISTA')")
    public ResponseEntity<Venta> save(@RequestBody @Valid VentaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ventaService.save(request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        ventaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
