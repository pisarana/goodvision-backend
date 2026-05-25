package com.goodvision.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        /*
         * TEMPORARY SECURITY CONFIGURATION
         *
         * This configuration is used during backend development
         * to allow testing API endpoints without authentication.
         *
         * Later this configuration will be replaced with:
         * - JWT authentication
         * - Role-based authorization
         * - Protected endpoints
         */

        http

                // Disable CSRF for REST API testing
                .csrf(csrf -> csrf.disable())

                // Allow access to all API endpoints temporarily
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/**").permitAll()
                        .anyRequest().authenticated()
                )

                // Default basic authentication
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}