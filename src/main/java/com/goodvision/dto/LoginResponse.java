package com.goodvision.dto;

public class LoginResponse {

    private String token;
    private Long idUsuario;
    private String role;

    public LoginResponse() {
    }

    public LoginResponse(String token, Long idUsuario, String role) {
        this.token = token;
        this.idUsuario = idUsuario;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}