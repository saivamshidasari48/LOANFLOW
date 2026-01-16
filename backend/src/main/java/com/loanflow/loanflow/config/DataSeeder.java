package com.loanflow.loanflow.config;

import com.loanflow.loanflow.entity.User;
import com.loanflow.loanflow.entity.UserRole;
import com.loanflow.loanflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * DataSeeder initializes default application data at startup.
 *
 * This class runs automatically when the Spring Boot application starts
 * and ensures that essential users exist in the system. This is useful for:
 *  - Local development and testing.
 *  - Demo environments.
 *  - Providing initial admin and role-based access accounts.
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    /**
     * Repository used to interact with the User table.
     * Injected automatically via constructor injection (Lombok).
     */
    private final UserRepository userRepository;

    /**
     * Password encoder used to securely hash raw passwords
     * before persisting them to the database.
     */
    private final PasswordEncoder passwordEncoder;

    /**
     * Executes automatically when the application starts.
     * Creates default users only if they do not already exist,
     * preventing duplicate records on every restart.
     */
    @Override
    public void run(String... args) {
        createUserIfMissing("admin", "admin123", UserRole.ADMIN);
        createUserIfMissing("analyst", "analyst123", UserRole.ANALYST);
        createUserIfMissing("customer", "customer123", UserRole.CUSTOMER);
    }

    /**
     * Creates a user account if it does not already exist.
     *
     * Steps:
     *  1. Check if the username already exists in the database.
     *  2. If present, exit early to avoid duplicate users.
     *  3. Otherwise, create a new User entity.
     *  4. Encode the password securely using BCrypt.
     *  5. Assign the appropriate role.
     *  6. Persist the user into the database.
     *
     * @param username     unique username for the user.
     * @param rawPassword  plaintext password (encoded before saving).
     * @param role         role assigned to the user (ADMIN / ANALYST / CUSTOMER).
     */
    private void createUserIfMissing(String username, String rawPassword, UserRole role) {
        // Exit if user already exists to keep the operation idempotent
        if (userRepository.findByUsername(username).isPresent()) return;

        // Create and populate the User entity
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(rawPassword)); // Encrypt password before saving
        user.setRole(role);

        // Persist user to database
        userRepository.save(user);
    }
}
