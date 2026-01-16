package com.loanflow.loanflow.entity;

/**
 * Enum representing the lifecycle status of a loan application.
 *
 * This enum is persisted as a string in the database to improve
 * readability and avoid ordinal-related issues during future changes.
 */
public enum LoanStatus {

    /**
     * Loan has been submitted by the customer and is awaiting review.
     */
    SUBMITTED,

    /**
     * Loan has been reviewed and approved by an analyst or admin.
     */
    APPROVED,

    /**
     * Loan has been reviewed and rejected.
     */
    REJECTED
}
