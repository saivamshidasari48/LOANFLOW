package com.loanflow.loanflow.dto;

import lombok.Data;

/**
 * Data Transfer Object (DTO) used for capturing loan application input
 * from the client.
 *
 * This class represents the payload sent by the frontend when a customer
 * applies for a loan. It is intentionally kept simple and free of business
 * logic to ensure clean separation between API contracts and domain models.
 *
 * Lombok @Data automatically generates:
 *  - Getters and setters
 *  - equals() and hashCode()
 *  - toString()
 */
@Data
public class LoanRequest {

    /**
     * Applicant's full name.
     */
    private String fullName;

    /**
     * Requested loan amount.
     */
    private Double amount;

    /**
     * Loan tenure in months.
     */
    private Integer tenure;

    /**
     * Applicant's monthly income.
     */
    private Double monthlyIncome;

    /**
     * Applicant's existing monthly debt obligations.
     */
    private Double monthlyDebt;

    /**
     * Applicant's credit score used for eligibility evaluation.
     */
    private Integer creditScore;

    /**
     * Employment type of the applicant.
     * Expected values:
     *  - SALARIED
     *  - SELF_EMPLOYED
     *  - STUDENT
     *  - UNEMPLOYED
     */
    private String employmentType;

    /**
     * Purpose of the loan.
     * Expected values:
     *  - HOME
     *  - AUTO
     *  - PERSONAL
     *  - EDUCATION
     *  - MEDICAL
     */
    private String purpose;
}
