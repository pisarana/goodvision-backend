package com.goodvision.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    // SECRET KEY FOR TOKEN SIGNING
    // In production this should be stored securely
    private static final String SECRET_KEY =
            "goodvisionbackendsecretkeygoodvisionbackendsecretkey";

    // TOKEN EXPIRATION: 24 HOURS
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24;

    // GENERATE SIGNING KEY
    private Key getSigningKey() {

        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    // GENERATE JWT TOKEN
    public String generateToken(String correo) {

        return Jwts.builder()
                .subject(correo)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // EXTRACT EMAIL FROM TOKEN
    public String extractCorreo(String token) {

        return extractClaims(token).getSubject();
    }

    // VALIDATE TOKEN
    public boolean isTokenValid(String token, String correo) {

        String extractedCorreo = extractCorreo(token);

        return extractedCorreo.equals(correo)
                && !isTokenExpired(token);
    }

    // CHECK IF TOKEN EXPIRED
    private boolean isTokenExpired(String token) {

        return extractClaims(token)
                .getExpiration()
                .before(new Date());
    }

    // EXTRACT CLAIMS
    private Claims extractClaims(String token) {

        return Jwts.parser()
                .verifyWith((javax.crypto.SecretKey) getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}