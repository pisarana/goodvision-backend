package com.goodvision.controller;

import com.goodvision.entity.Cliente;
import com.goodvision.service.ClienteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cliente")
@CrossOrigin(origins = "*")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @GetMapping
    public ResponseEntity<List<Cliente>> listarClientes() {

        return ResponseEntity.ok(clienteService.listarClientes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> obtenerClientePorId(@PathVariable Long id) {

        return ResponseEntity.ok(clienteService.obtenerClientePorId(id));
    }

    @PostMapping
    public ResponseEntity<Cliente> guardarCliente(@RequestBody Cliente cliente) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(clienteService.guardarCliente(cliente));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cliente> actualizarCliente(
            @PathVariable Long id,
            @RequestBody Cliente cliente) {

        return ResponseEntity.ok(
                clienteService.actualizarCliente(id, cliente)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCliente(@PathVariable Long id) {

        clienteService.eliminarCliente(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Cliente>> buscarPorApellido(
            @RequestParam String apellido) {

        return ResponseEntity.ok(
                clienteService.buscarPorApellido(apellido)
        );
    }
}