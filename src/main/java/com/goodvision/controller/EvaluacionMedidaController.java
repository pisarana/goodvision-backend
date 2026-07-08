package com.goodvision.controller;

import com.goodvision.dto.EvaluacionMedidaRequest;
import com.goodvision.entity.EvaluacionMedida;
import com.goodvision.service.EvaluacionMedidaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medidas")
@CrossOrigin(origins = "*")
public class EvaluacionMedidaController {

    private final EvaluacionMedidaService medidaService;

    public EvaluacionMedidaController(EvaluacionMedidaService medidaService) {
        this.medidaService = medidaService;
    }

    @GetMapping
    public ResponseEntity<List<EvaluacionMedida>> findAll() {
        return ResponseEntity.ok(medidaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EvaluacionMedida> findById(@PathVariable Long id) {
        return ResponseEntity.ok(medidaService.findById(id));
    }

    @GetMapping("/cliente/{idCliente}")
    public ResponseEntity<List<EvaluacionMedida>> findByCliente(@PathVariable Long idCliente) {
        return ResponseEntity.ok(medidaService.findByCliente(idCliente));
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<EvaluacionMedida>> findByUsuario(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(medidaService.findByUsuario(idUsuario));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ESPECIALISTA')")
    public ResponseEntity<EvaluacionMedida> save(@RequestBody @Valid EvaluacionMedidaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(medidaService.save(request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        medidaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
