package com.loanflow.loanflow.controller;

import com.loanflow.loanflow.dto.LoginRequest;
import com.loanflow.loanflow.dto.LoginResponse;
import com.loanflow.loanflow.entity.User;
import com.loanflow.loanflow.entity.UserRole;
import com.loanflow.loanflow.repository.UserRepository;
import com.loanflow.loanflow.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

/**
 * Authentication controller responsible for:
 *  - Registering new users (signup)
 *  - Logging in existing users and issuing JWT tokens
 *
 * This controller is intentionally lightweight:
 *  - Validates input
 *  - Delegates persistence to repository
 *  - Uses PasswordEncoder for secure password hashing
 *  - Uses JwtUtil to generate signed JWT tokens
 */
@CrossOrigin(origins = "http://localhost:3000") // Allows frontend (React) to call auth APIs during development
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    /**
     * Repository for fetching/saving users.
     */
    private final UserRepository userRepository;

    /**
     * BCrypt-based encoder used to hash passwords and verify login credentials.
     */
    private final PasswordEncoder passwordEncoder;

    /**
     * Utility class used to generate JWT tokens for authenticated users.
     */
    private final JwtUtil jwtUtil;

    /**
     * Registers a new user account (Signup).
     *
     * Flow:
     *  1) Validate that username/password exist and are not blank
     *  2) Ensure username is unique
     *  3) Hash password using BCrypt before storing
     *  4) Assign default role (CUSTOMER)
     *  5) Save user and return 201 Created
     *
     * @param request contains username and password
     * @return success message if registered
     */
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody LoginRequest request) {

        // Basic input validation to avoid storing invalid/empty credentials
        if (request.getUsername() == null || request.getUsername().isBlank()
                || request.getPassword() == null || request.getPassword().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Username and password are required"
            );
        }

        // Enforce unique usernames
        boolean exists = userRepository.findByUsername(request.getUsername()).isPresent();
        if (exists) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Username already exists"
            );
        }

        // Create new user entity and securely hash password before saving
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Default role for new registrations (keeps role assignment controlled)
        user.setRole(UserRole.CUSTOMER);

        userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("User registered successfully");
    }

    /**
     * Authenticates a user and returns a JWT token if credentials are valid.
     *
     * Flow:
     *  1) Lookup user by username
     *  2) Verify password using PasswordEncoder.matches()
     *  3) Generate JWT token containing username and role
     *  4) Return token + basic user identity info to the frontend
     *
     * @param request contains username and password
     * @return LoginResponse containing token and user details
     */
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        // Find user or return 401 to avoid leaking which part failed
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Invalid username or password"
                ));

        // Compare raw password with stored BCrypt hash
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Invalid username or password"
            );
        }

        // Generate JWT token using username + role (used later for authorization)
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());

        // Return token + identity info so frontend can store it and display role-based UI
        return new LoginResponse(token, user.getUsername(), user.getRole());
    }
}
