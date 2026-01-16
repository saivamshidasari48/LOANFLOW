package com.loanflow.loanflow.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Entity representing an application user.
 *
 * This table stores authentication and authorization data used by
 * Spring Security and the business layer.
 *
 * Sensitive data such as passwords are stored in encrypted form only.
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    /**
     * Primary key generated automatically by the database.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Unique username used for authentication.
     * Enforced at the database level to prevent duplicates.
     */
    @Column(unique = true, nullable = false)
    private String username;

    /**
     * Encrypted password (BCrypt hash).
     * Raw passwords are never stored.
     */
    private String password;

    /**
     * Role assigned to the user (ADMIN / ANALYST / CUSTOMER).
     * Stored as string for readability and safe migrations.
     */
    @Enumerated(EnumType.STRING)
    private UserRole role;

    /**
     * Indicates whether the user account is active.
     * Allows soft deactivation without deleting records.
     */
    @Column(nullable = false)
    private boolean active = true;
}
