package com.loanflow.loanflow.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Application-level configuration class.
 *
 * This class is used to define reusable Spring Beans that can be injected
 * throughout the application. Keeping common configurations centralized
 * improves maintainability and consistency.
 */
@Configuration
public class AppConfig {

    /**
     * Creates and exposes a PasswordEncoder bean for the application.
     *
     * BCrypt is used because:
     *  - It automatically handles salting.
     *  - It is computationally expensive, making brute-force attacks harder.
     *  - It is an industry-standard hashing algorithm for password security.
     *
     * This bean will be injected wherever password encoding or verification
     * is required (e.g., user registration, authentication services).
     *
     * @return PasswordEncoder implementation using BCrypt hashing.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
