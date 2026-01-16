package com.loanflow.loanflow.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Utility class responsible for generating, parsing, and validating JWT tokens.
 *
 * This class encapsulates all JWT-related operations:
 *  - Token generation with claims
 *  - Username and role extraction
 *  - Signature verification and expiration validation
 *
 * Tokens are signed using HS256 with a secret key provided via application configuration.
 */
@Component
public class JwtUtil {

    /**
     * Cryptographic signing key used to sign and verify JWT tokens.
     */
    private final SecretKey signingKey;

    /**
     * Token expiration duration in milliseconds.
     */
    private final long expirationMs;

    /**
     * Constructs JwtUtil and validates the secret key length.
     *
     * HS256 requires a minimum of 32 bytes secret for security reasons.
     */
    public JwtUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expirationMs:86400000}") long expirationMs
    ) {
        // Validate minimum secret length for HS256 algorithm
        if (secret.getBytes(StandardCharsets.UTF_8).length < 32) {
            throw new IllegalArgumentException(
                    "JWT secret must be at least 32 bytes for HS256"
            );
        }

        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    /**
     * Generates a signed JWT token for an authenticated user.
     *
     * Token includes:
     *  - Subject: username
     *  - Custom claim: role
     *  - Issued timestamp
     *  - Expiration timestamp
     */
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role) // Custom claim used for role-based authorization
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis() + expirationMs)
                )
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Extracts username (subject) from the JWT token.
     *
     * Automatically validates signature before parsing.
     */
    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    /**
     * Extracts role claim from the JWT token.
     */
    public String extractRole(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("role", String.class);
    }

    /**
     * Validates token signature and expiration.
     *
     * @return true if token is valid, false otherwise.
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(signingKey)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            // Any parsing or validation error indicates an invalid token
            return false;
        }
    }
}
