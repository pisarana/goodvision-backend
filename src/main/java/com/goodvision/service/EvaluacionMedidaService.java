package com.goodvision.service;

import com.goodvision.dto.EvaluacionMedidaRequest;
import com.goodvision.entity.EvaluacionMedida;

import java.util.List;

public interface EvaluacionMedidaService {
    List<EvaluacionMedida> findAll();
    EvaluacionMedida findById(Long id);
    EvaluacionMedida save(EvaluacionMedidaRequest request);
    List<EvaluacionMedida> findByCliente(Long idCliente);
    List<EvaluacionMedida> findByUsuario(Long idUsuario);
    void delete(Long id);
}
