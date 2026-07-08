package com.goodvision.repository;

import com.goodvision.entity.EvaluacionMedida;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvaluacionMedidaRepository extends JpaRepository<EvaluacionMedida, Long> {

    List<EvaluacionMedida> findByCliente_IdCliente(Long idCliente);

    List<EvaluacionMedida> findByUsuario_IdUsuario(Long idUsuario);

    @Query("SELECT e FROM EvaluacionMedida e ORDER BY e.fechaEvaluacion DESC")
    List<EvaluacionMedida> findAllOrderByFechaDesc();
}
