package com.goodvision.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.List;

public class VentaRequest {

    @NotNull(message = "Cliente es requerido")
    private Long idCliente;

    @NotNull(message = "Método de pago es requerido")
    private String metodoPago;

    @NotNull(message = "Detalles son requeridos")
    private List<DetalleVentaRequest> detalles;

    public VentaRequest() {
    }

    public Long getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(Long idCliente) {
        this.idCliente = idCliente;
    }

    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }

    public List<DetalleVentaRequest> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetalleVentaRequest> detalles) {
        this.detalles = detalles;
    }

    public static class DetalleVentaRequest {
        @NotNull(message = "Producto es requerido")
        private Long idProducto;

        @NotNull(message = "Cantidad es requerida")
        @Positive(message = "Cantidad debe ser positiva")
        private Integer cantidad;

        @NotNull(message = "Precio unitario es requerido")
        @Positive(message = "Precio unitario debe ser positivo")
        private BigDecimal precioUnitario;

        public DetalleVentaRequest() {
        }

        public Long getIdProducto() {
            return idProducto;
        }

        public void setIdProducto(Long idProducto) {
            this.idProducto = idProducto;
        }

        public Integer getCantidad() {
            return cantidad;
        }

        public void setCantidad(Integer cantidad) {
            this.cantidad = cantidad;
        }

        public BigDecimal getPrecioUnitario() {
            return precioUnitario;
        }

        public void setPrecioUnitario(BigDecimal precioUnitario) {
            this.precioUnitario = precioUnitario;
        }
    }
}
