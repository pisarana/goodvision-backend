package com.goodvision.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "`INVENTARIO`")
public class Inventario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_inventario")
    private Long idInventario;

    @NotNull(message = "Producto es requerido")
    @OneToOne
    @JoinColumn(name = "id_producto", nullable = false, unique = true)
    private Producto producto;

    @NotNull(message = "Stock es requerido")
    @Min(value = 0, message = "Stock debe ser mayor o igual a 0")
    @Column(name = "stock", nullable = false)
    private Integer stock;

    @NotNull(message = "Stock mínimo es requerido")
    @Min(value = 0, message = "Stock mínimo debe ser mayor o igual a 0")
    @Column(name = "stock_minimo", nullable = false)
    private Integer stockMinimo;

    public Inventario() {
    }

    public Long getIdInventario() {
        return idInventario;
    }

    public void setIdInventario(Long idInventario) {
        this.idInventario = idInventario;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Integer getStockMinimo() {
        return stockMinimo;
    }

    public void setStockMinimo(Integer stockMinimo) {
        this.stockMinimo = stockMinimo;
    }
}
