package com.goodvision.repository;

import com.goodvision.entity.Inventario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InventarioRepository extends JpaRepository<Inventario, Long> {

    List<Inventario> findByProductoNombreProductoContainingIgnoreCase(String nombreProducto);

    Optional<Inventario> findByProductoIdProducto(Long idProducto);
}
