package com.loanflow.loanflow.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Utility class that was originally used during development
 * to manually generate BCrypt password hashes for testing.
 *
 * ⚠️ This class is NOT used by the application at runtime.
 * Password hashing in production is handled automatically
 * through Spring Security's PasswordEncoder bean.
 *
 * This file is kept only for reference and documentation purposes.
 */
public class BcryptHashPrinter {

    /**
     * Local utility entry point.
     *
     * The console output was intentionally removed to avoid
     * committing test/debug prints into production code.
     *
     * If a hash needs to be generated manually in the future,
     * the commented example below can be temporarily enabled locally.
     */
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

       
    }
}
