package com.loanflow.loanflow.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Utility class originally used during local development
 * to generate BCrypt password hashes manually.
 *
 * ⚠️ This class is NOT used by the application runtime.
 * All real password hashing is handled through Spring's
 * PasswordEncoder bean configuration.
 *
 * The console output has been removed to avoid committing
 * test/debug prints into the repository.
 */
public class HashPrinter {

    /**
     * Local utility entry point.
     *
     * If a hash needs to be generated manually for testing,
     * temporarily uncomment the example below and run locally.
     * Do NOT commit console output back into source control.
     */
    public static void main(String[] args) {

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        
    }
}
