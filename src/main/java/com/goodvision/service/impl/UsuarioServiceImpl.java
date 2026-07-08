package com.goodvision.service.impl;

import com.goodvision.entity.Usuario;
import com.goodvision.exception.DuplicateResourceException;
import com.goodvision.exception.ResourceNotFoundException;
import com.goodvision.repository.UsuarioRepository;
import com.goodvision.service.UsuarioService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UsuarioServiceImpl(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @Override
    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    @Override
    public Usuario findById(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", id));
    }

    @Override
    @Transactional
    public Usuario update(Long id, Usuario usuario) {
        Usuario existing = findById(id);

        usuarioRepository.findByCorreo(usuario.getCorreo()).ifPresent(u -> {
            if (!u.getIdUsuario().equals(id)) {
                throw new DuplicateResourceException("Usuario", "correo", usuario.getCorreo());
            }
        });

        existing.setNombre(usuario.getNombre());
        existing.setApellido(usuario.getApellido());
        existing.setCorreo(usuario.getCorreo());
        existing.setTelefono(usuario.getTelefono());
        existing.setDireccion(usuario.getDireccion());
        existing.setEstado(usuario.getEstado());
        existing.setRole(usuario.getRole());

        if (usuario.getPassword() != null && !usuario.getPassword().isBlank()) {
            existing.setPassword(passwordEncoder.encode(usuario.getPassword()));
        }

        return usuarioRepository.save(existing);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Usuario usuario = findById(id);
        usuarioRepository.delete(usuario);
    }

    @Override
    public List<Usuario> findByNombre(String nombre) {
        return usuarioRepository.findAll().stream()
                .filter(u -> u.getNombre().toLowerCase().contains(nombre.toLowerCase())
                        || u.getApellido().toLowerCase().contains(nombre.toLowerCase()))
                .toList();
    }
}
