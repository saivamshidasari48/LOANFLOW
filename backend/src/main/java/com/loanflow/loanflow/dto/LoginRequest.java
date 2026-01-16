package com.loanflow.loanflow.dto;

import lombok.Data;

/**
 * Data Transfer Object (DTO) used for authentication requests.
 *
 * This class represents the payload sent by the client when:
 *  - A user attempts to log in
 *  - A user registers a new account
 *
 * It contains only the minimum required credentials and does not
 * include any business logic or validation rules.
 *
 * Lombok @Data automatically generates:
 *  - Getters and setters
 *  - equals() and hashCode()
 *  - toString()
 */
@Data
public class LoginRequest {

    /**
     * Unique username provided by the user.
     */
    private String username;

    /**
     * Raw password provided by the user.
     * This value is never stored directly and is always encrypted
     * using a PasswordEncoder before persistence.
     */
    private String password;
}
