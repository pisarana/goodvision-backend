package com.goodvision.repository;

import com.goodvision.entity.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {

    List<Venta> findByCliente_IdCliente(Long idCliente);

    List<Venta> findByFechaVentaBetween(LocalDate fechaInicio, LocalDate fechaFin);

    @Query("SELECT v FROM Venta v ORDER BY v.fechaVenta DESC")
    List<Venta> findAllOrderByFechaDesc();
}
