package com.loanflow.loanflow.service;

import com.loanflow.loanflow.dto.LoanRequest;
import com.loanflow.loanflow.entity.LoanApplication;

/**
 * Service interface responsible for handling core loan business operations.
 *
 * This abstraction allows the controller layer to remain independent
 * of implementation details and improves testability and maintainability.
 */
public interface LoanService {

    /**
     * Creates and processes a new loan application.
     *
     * This method:
     *  - Validates and maps request data
     *  - Evaluates eligibility and risk
     *  - Persists the loan record
     *
     * @param req loan request payload
     * @return persisted LoanApplication entity
     */
    LoanApplication applyLoan(LoanRequest req);
}
