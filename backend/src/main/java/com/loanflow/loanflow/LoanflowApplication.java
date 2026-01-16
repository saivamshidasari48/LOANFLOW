package com.loanflow.loanflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the LoanFlow Spring Boot application.
 *
 * This class bootstraps the Spring context, initializes all beans,
 * and starts the embedded web server.
 */
@SpringBootApplication
public class LoanflowApplication {

    /**
     * Application startup method.
     *
     * @param args command-line arguments (if any)
     */
    public static void main(String[] args) {
        SpringApplication.run(LoanflowApplication.class, args);
    }
}
