package com.goodvision.service.impl;

import com.goodvision.dto.LoginRequest;
import com.goodvision.dto.LoginResponse;
import com.goodvision.dto.RegisterRequest;
import com.goodvision.entity.Usuario;
import com.goodvision.exception.BusinessRuleViolationException;
import com.goodvision.exception.DuplicateResourceException;
import com.goodvision.exception.ResourceNotFoundException;
import com.goodvision.repository.UsuarioRepository;
import com.goodvision.security.JwtService;
import com.goodvision.service.AuthService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class AuthServiceImpl implements AuthService {

    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public AuthServiceImpl(
            UsuarioRepository usuarioRepository,
            JwtService jwtService) {

        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;
    }

    @Override
    public String register(RegisterRequest request) {

        // VERIFY IF EMAIL EXISTS
        if (usuarioRepository.findByCorreo(request.getCorreo()).isPresent()) {
            throw new DuplicateResourceException("Usuario", "correo", request.getCorreo());
        }

        Usuario usuario = new Usuario();

        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        usuario.setCorreo(request.getCorreo());
        usuario.setTelefono(request.getTelefono());
        usuario.setDireccion(request.getDireccion());

        // ENCRYPT PASSWORD
        usuario.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        usuario.setRole(request.getRole());

        usuario.setEstado("ACTIVO");

        usuario.setFechaRegistro(LocalDate.now());

        usuarioRepository.save(usuario);

        return "Usuario registrado correctamente";
    }

    @Override
    public LoginResponse login(LoginRequest request) {

        Usuario usuario = usuarioRepository.findByCorreo(
                request.getCorreo()
        ).orElseThrow(() ->
                new ResourceNotFoundException("Usuario", "correo", request.getCorreo())
        );

        // VALIDATE PASSWORD
        boolean passwordCorrect =
                passwordEncoder.matches(
                        request.getPassword(),
                        usuario.getPassword()
                );

        if (!passwordCorrect) {
            throw new BusinessRuleViolationException("Contraseña incorrecta");
        }

        // GENERATE JWT TOKEN WITH ROLE
        String token = jwtService.generateToken(
                usuario.getCorreo(),
                usuario.getRole().name()
        );

        return new LoginResponse(token, usuario.getIdUsuario(), usuario.getRole().name());
    }
}