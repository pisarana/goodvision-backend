package com.goodvision.dto;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public class EvaluacionMedidaRequest {

    @NotNull(message = "Usuario es requerido")
    private Long idUsuario;

    @NotNull(message = "Cliente es requerido")
    private Long idCliente;

    private String tipoEvaluacion;

    private String observaciones;

    @NotNull(message = "Detalles son requeridos")
    private List<DetalleMedidaRequest> detalles;

    public EvaluacionMedidaRequest() {
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Long getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(Long idCliente) {
        this.idCliente = idCliente;
    }

    public String getTipoEvaluacion() {
        return tipoEvaluacion;
    }

    public void setTipoEvaluacion(String tipoEvaluacion) {
        this.tipoEvaluacion = tipoEvaluacion;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public List<DetalleMedidaRequest> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetalleMedidaRequest> detalles) {
        this.detalles = detalles;
    }

    public static class DetalleMedidaRequest {
        @NotNull(message = "Ojo es requerido")
        private String ojo; // "OJO_DERECHO" o "OJO_IZQUIERDO"

        private BigDecimal esfera;
        private BigDecimal cilindro;
        private Integer eje;

        public DetalleMedidaRequest() {
        }

        public String getOjo() {
            return ojo;
        }

        public void setOjo(String ojo) {
            this.ojo = ojo;
        }

        public BigDecimal getEsfera() {
            return esfera;
        }

        public void setEsfera(BigDecimal esfera) {
            this.esfera = esfera;
        }

        public BigDecimal getCilindro() {
            return cilindro;
        }

        public void setCilindro(BigDecimal cilindro) {
            this.cilindro = cilindro;
        }

        public Integer getEje() {
            return eje;
        }

        public void setEje(Integer eje) {
            this.eje = eje;
        }
    }
}
