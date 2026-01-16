package com.loanflow.loanflow.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Entity representing a loan application in the system.
 *
 * This class is mapped to a database table using JPA/Hibernate and stores:
 *  - Customer-provided financial and personal details
 *  - Computed risk and eligibility metrics
 *  - Audit metadata and relationships
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoanApplication {

    /**
     * Primary key generated automatically by the database.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Loan amount requested by the applicant.
     */
    private Double amount;

    /**
     * Interest rate assigned after eligibility evaluation.
     */
    private Double interestRate;

    /**
     * Loan tenure in months.
     */
    private Integer tenure;

    /**
     * Current status of the loan (PENDING / APPROVED / REJECTED).
     * Stored as a string for readability and stability.
     */
    @Enumerated(EnumType.STRING)
    private LoanStatus status;

    /**
     * Timestamp indicating when the loan application was created.
     */
    private LocalDateTime createdAt;

    // ----------------------------
    // Customer-provided fields
    // ----------------------------

    /**
     * Applicant's full name.
     */
    private String fullName;

    /**
     * Applicant's monthly income.
     */
    private Double monthlyIncome;

    /**
     * Applicant's existing monthly debt obligations.
     */
    private Double monthlyDebt;

    /**
     * Applicant's credit score used for risk evaluation.
     */
    private Integer creditScore;

    /**
     * Applicant's employment type
     * (SALARIED, SELF_EMPLOYED, STUDENT, UNEMPLOYED).
     */
    private String employmentType;

    /**
     * Purpose of the loan
     * (HOME, AUTO, PERSONAL, EDUCATION, MEDICAL).
     */
    private String purpose;

    // ----------------------------
    // Computed / analytics fields
    // ----------------------------

    /**
     * Debt-to-Income ratio (0–1).
     * Used as a key indicator for financial risk evaluation.
     */
    private Double dti;

    /**
     * Computed risk score (0–100) derived from financial metrics.
     */
    private Integer riskScore;

    /**
     * Eligibility decision outcome:
     *  - ELIGIBLE
     *  - REVIEW
     *  - REJECT
     */
    private String eligibilityDecision;

    // ----------------------------
    // Relationships
    // ----------------------------

    /**
     * Many-to-one relationship linking the loan to the owning user.
     * A single user can have multiple loan applications.
     */
    @ManyToOne
    private User user;
}
