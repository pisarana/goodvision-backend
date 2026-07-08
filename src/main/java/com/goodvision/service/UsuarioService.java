package com.goodvision.service;

import com.goodvision.entity.Usuario;

import java.util.List;

public interface UsuarioService {

    List<Usuario> findAll();

    Usuario findById(Long id);

    Usuario update(Long id, Usuario usuario);

    void delete(Long id);

    List<Usuario> findByNombre(String nombre);
}
