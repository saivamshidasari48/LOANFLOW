package com.loanflow.loanflow.dto;

import lombok.Data;

/**
 * Data Transfer Object (DTO) used for updating a user's profile information.
 *
 * This class represents the payload sent by the client when a user updates
 * personal details such as name and contact information.
 *
 * It is intentionally kept lightweight and contains no business logic.
 * Validation rules (if any) are handled at the controller or service layer.
 *
 * Lombok @Data automatically generates:
 *  - Getters and setters
 *  - equals() and hashCode()
 *  - toString()
 */
@Data
public class UpdateProfileRequest {

    /**
     * User's full name displayed in the application.
     */
    private String fullName;

    /**
     * User's email address used for communication and notifications.
     */
    private String email;

    /**
     * User's contact phone number.
     */
    private String phone;
}
