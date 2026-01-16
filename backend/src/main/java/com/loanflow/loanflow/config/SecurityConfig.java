package com.loanflow.loanflow.config;

import com.loanflow.loanflow.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Central security configuration for the application.
 *
 * Responsibilities:
 *  - Configures JWT-based authentication.
 *  - Enforces stateless session management.
 *  - Defines role-based access control rules.
 *  - Enables and configures CORS for frontend communication.
 *  - Registers custom security filters.
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    /**
     * Custom JWT authentication filter responsible for:
     *  - Extracting JWT token from Authorization header.
     *  - Validating token integrity and expiration.
     *  - Populating Spring SecurityContext with authenticated user details.
     */
    private final JwtAuthFilter jwtAuthFilter;

    /**
     * Defines the security filter chain used by Spring Security.
     *
     * This method configures:
     *  - CORS rules
     *  - CSRF handling
     *  - Session management policy
     *  - Endpoint authorization rules
     *  - JWT filter integration
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Enable CORS using a custom configuration source
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // Disable CSRF because the API is stateless and uses JWT tokens
            .csrf(csrf -> csrf.disable())

            // Enforce stateless session management (no HTTP sessions stored on server)
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // Define authorization rules for all incoming requests
            .authorizeHttpRequests(auth -> auth

                // Allow preflight OPTIONS requests for CORS
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Public authentication endpoints (login / register)
                .requestMatchers("/api/auth/**").permitAll()

                // Admin-only endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // Loan approval/rejection accessible to ANALYST and ADMIN roles
                .requestMatchers(HttpMethod.PATCH, "/api/loans/*/approve").hasAnyRole("ANALYST", "ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/loans/*/reject").hasAnyRole("ANALYST", "ADMIN")

                // All other API endpoints require authentication
                .requestMatchers("/api/**").authenticated()

                // Any remaining endpoints are publicly accessible (static files, health checks, etc.)
                .anyRequest().permitAll()
            )

            // Register JWT filter before Spring's default authentication filter
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Configures Cross-Origin Resource Sharing (CORS) settings.
     *
     * This allows the frontend (running on a different domain/port)
     * to communicate with the backend securely.
     *
     * Adjust allowed origins when deploying to production.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOriginPatterns(List.of(
                "http://localhost:3000",
                "https://loanflow-k5zk.vercel.app",
                "https://*.vercel.app"
        ));

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

}
