package com.goodvision.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

@Entity
@Table(name = "`DETALLE_MEDIDA`")
public class DetalleMedida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detallemedida")
    private Long idDetalleMedida;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_evaluacion", nullable = false)
    private EvaluacionMedida evaluacion;

    @NotNull(message = "Ojo es requerido")
    @Size(max = 20, message = "Ojo no puede exceder 20 caracteres")
    @Column(name = "ojo", nullable = false, length = 20)
    private String ojo; // "OJO_DERECHO" o "OJO_IZQUIERDO"

    @Column(name = "esfera", precision = 5, scale = 2)
    private BigDecimal esfera;

    @Column(name = "cilindro", precision = 5, scale = 2)
    private BigDecimal cilindro;

    @Column(name = "eje")
    private Integer eje;

    public DetalleMedida() {
    }

    // Getters and Setters
    public Long getIdDetalleMedida() {
        return idDetalleMedida;
    }

    public void setIdDetalleMedida(Long idDetalleMedida) {
        this.idDetalleMedida = idDetalleMedida;
    }

    public EvaluacionMedida getEvaluacion() {
        return evaluacion;
    }

    public void setEvaluacion(EvaluacionMedida evaluacion) {
        this.evaluacion = evaluacion;
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
