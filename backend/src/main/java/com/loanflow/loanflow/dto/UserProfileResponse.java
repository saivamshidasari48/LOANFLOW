package com.loanflow.loanflow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Data Transfer Object (DTO) returned when fetching a user's profile.
 *
 * This object contains non-sensitive user information that can safely
 * be exposed to the frontend for display and profile management.
 *
 * Sensitive fields such as passwords or internal audit fields
 * are intentionally excluded.
 */
@Data
@AllArgsConstructor
public class UserProfileResponse {

    /**
     * Unique identifier of the user.
     */
    private Long id;

    /**
     * Username used for authentication and display.
     */
    private String username;

    /**
     * Role assigned to the user (e.g., ADMIN, ANALYST, CUSTOMER).
     * Stored as a string for easy serialization and UI usage.
     */
    private String role;

    /**
     * User's full name.
     */
    private String fullName;

    /**
     * User's email address.
     */
    private String email;

    /**
     * User's phone number.
     */
    private String phone;
}
