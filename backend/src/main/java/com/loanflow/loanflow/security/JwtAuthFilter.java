package com.loanflow.loanflow.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT Authentication Filter (runs once per request).
 *
 * Responsibility:
 *  - Read JWT token from the Authorization header (Bearer <token>)
 *  - Validate and extract the username from the token
 *  - Load user details from the database
 *  - Set the authentication object into Spring SecurityContext
 *
 * This enables role-based access control for protected endpoints without using server sessions.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    /**
     * Utility class for extracting/validating JWT token claims.
     */
    private final JwtUtil jwtUtil;

    /**
     * Service used to load user details (DbUserDetailsService implementation).
     */
    private final UserDetailsService userDetailsService;

    /**
     * Intercepts each incoming request and attempts to authenticate the user using JWT.
     */
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // Extract Authorization header: "Bearer <token>"
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        // Proceed only if a Bearer token exists
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7); // remove "Bearer "

            try {
                // Extract username from token (throws if token is invalid/expired depending on JwtUtil)
                String username = jwtUtil.extractUsername(token);

                // Set authentication only if not already authenticated in the security context
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                    // Load user from DB to attach authorities/roles to the SecurityContext
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                    // Build authentication object used by Spring Security downstream
                    UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    // Attach request details (IP, session id, etc.)
                    auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Store authentication so controllers/security rules can use it
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            } catch (Exception ex) {
                // If token is invalid/expired, we do not authenticate the request.
                // Protected endpoints will be blocked by Spring Security rules automatically.
            }
        }

        // Continue the filter chain (request continues to controllers or next filters)
        filterChain.doFilter(request, response);
    }
}
