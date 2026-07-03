package com.goodvision.config;

import com.goodvision.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        /*
         * FINAL JWT SECURITY CONFIGURATION
         *
         * This configuration:
         * - enables JWT authentication
         * - protects API endpoints
         * - allows public authentication routes
         * - disables Spring default login
         */

        http

                // Disable CSRF for REST API
                .csrf(csrf -> csrf.disable())

                // Stateless session for JWT
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // Endpoint authorization rules
                .authorizeHttpRequests(auth -> auth

                        // PUBLIC AUTH ENDPOINTS
                        .requestMatchers("/api/auth/**").permitAll()

                        // PROTECTED ENDPOINTS
                        .requestMatchers("/api/cliente/**").authenticated()
                        .requestMatchers("/api/inventario/**").authenticated()
                        .requestMatchers("/api/productos/**").authenticated()

                        // ANY OTHER REQUEST
                        .anyRequest().authenticated()
                )

                // ADD JWT FILTER
                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}


