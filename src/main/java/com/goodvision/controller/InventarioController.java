package com.goodvision.controller;

import com.goodvision.entity.Inventario;
import com.goodvision.service.InventarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventario")
@CrossOrigin(origins = "*")
public class InventarioController {

    private final InventarioService inventarioService;

    public InventarioController(InventarioService inventarioService) {
        this.inventarioService = inventarioService;
    }

    @GetMapping
    public ResponseEntity<List<Inventario>> listarInventario() {
        return ResponseEntity.ok(inventarioService.listarInventario());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inventario> obtenerInventarioPorId(@PathVariable Long id) {
        return ResponseEntity.ok(inventarioService.obtenerInventarioPorId(id));
    }

    @PostMapping
    public ResponseEntity<Inventario> guardarInventario(@RequestBody @Valid Inventario inventario) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(inventarioService.guardarInventario(inventario));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Inventario> actualizarInventario(
            @PathVariable Long id,
            @RequestBody @Valid Inventario inventario) {

        return ResponseEntity.ok(inventarioService.actualizarInventario(id, inventario));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarInventario(@PathVariable Long id) {
        inventarioService.eliminarInventario(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Inventario>> buscarPorProducto(@RequestParam String nombre) {
        return ResponseEntity.ok(inventarioService.buscarPorProducto(nombre));
    }
}
