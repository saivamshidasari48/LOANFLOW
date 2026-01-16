package com.loanflow.loanflow.entity;

/**
 * Enum representing user roles within the system.
 *
 * Roles are used for role-based access control (RBAC) and are enforced
 * through Spring Security configuration.
 */
public enum UserRole {

    /**
     * System administrator with full access to all endpoints
     * and administrative operations.
     */
    ADMIN,

    /**
     * Analyst responsible for reviewing and approving/rejecting loans.
     */
    ANALYST,

    /**
     * End user who submits loan applications and views their own data.
     */
    CUSTOMER
}
