package com.goodvision.service.impl;

import com.goodvision.dto.EvaluacionMedidaRequest;
import com.goodvision.entity.Cliente;
import com.goodvision.entity.DetalleMedida;
import com.goodvision.entity.EvaluacionMedida;
import com.goodvision.entity.Usuario;
import com.goodvision.exception.ResourceNotFoundException;
import com.goodvision.repository.ClienteRepository;
import com.goodvision.repository.EvaluacionMedidaRepository;
import com.goodvision.repository.UsuarioRepository;
import com.goodvision.service.EvaluacionMedidaService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EvaluacionMedidaServiceImpl implements EvaluacionMedidaService {

    private final EvaluacionMedidaRepository evaluacionRepository;
    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;

    public EvaluacionMedidaServiceImpl(
            EvaluacionMedidaRepository evaluacionRepository,
            ClienteRepository clienteRepository,
            UsuarioRepository usuarioRepository) {
        this.evaluacionRepository = evaluacionRepository;
        this.clienteRepository = clienteRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public List<EvaluacionMedida> findAll() {
        return evaluacionRepository.findAllOrderByFechaDesc();
    }

    @Override
    public EvaluacionMedida findById(Long id) {
        return evaluacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EvaluacionMedida", "id", id));
    }

    @Override
    @Transactional
    public EvaluacionMedida save(EvaluacionMedidaRequest request) {
        // Find cliente
        Cliente cliente = clienteRepository.findById(request.getIdCliente())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", "id", request.getIdCliente()));

        // Find usuario
        Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", request.getIdUsuario()));

        // Create evaluacion
        EvaluacionMedida evaluacion = new EvaluacionMedida();
        evaluacion.setCliente(cliente);
        evaluacion.setUsuario(usuario);
        evaluacion.setTipoEvaluacion(request.getTipoEvaluacion());
        evaluacion.setObservaciones(request.getObservaciones());

        // Add details
        for (EvaluacionMedidaRequest.DetalleMedidaRequest detalleReq : request.getDetalles()) {
            DetalleMedida detalle = new DetalleMedida();
            detalle.setOjo(detalleReq.getOjo());
            detalle.setEsfera(detalleReq.getEsfera());
            detalle.setCilindro(detalleReq.getCilindro());
            detalle.setEje(detalleReq.getEje());

            evaluacion.addDetalle(detalle);
        }

        return evaluacionRepository.save(evaluacion);
    }

    @Override
    public List<EvaluacionMedida> findByCliente(Long idCliente) {
        return evaluacionRepository.findByCliente_IdCliente(idCliente);
    }

    @Override
    public List<EvaluacionMedida> findByUsuario(Long idUsuario) {
        return evaluacionRepository.findByUsuario_IdUsuario(idUsuario);
    }

    @Override
    public void delete(Long id) {
        EvaluacionMedida evaluacion = findById(id);
        evaluacionRepository.delete(evaluacion);
    }
}
