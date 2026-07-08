package com.goodvision.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

@Entity
@Table(name = "`PRODUCTOS`")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_producto")
    private Long idProducto;

    @NotBlank(message = "Nombre del producto es requerido")
    @Size(max = 150, message = "Nombre del producto no puede exceder 150 caracteres")
    @Column(name = "nombre_producto", nullable = false, length = 150)
    private String nombreProducto;

    @NotNull(message = "Precio es requerido")
    @DecimalMin(value = "0.0", inclusive = true, message = "Precio debe ser mayor o igual a 0")
    @Column(name = "precio", nullable = false)
    private BigDecimal precio;

    @NotNull(message = "Categoría es requerida")
    @ManyToOne
    @JoinColumn(name = "id_categoria", nullable = false)
    private Categoria categoria;

    public Producto() {
    }

    public Long getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(Long idProducto) {
        this.idProducto = idProducto;
    }

    public String getNombreProducto() {
        return nombreProducto;
    }

    public void setNombreProducto(String nombreProducto) {
        this.nombreProducto = nombreProducto;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }
}