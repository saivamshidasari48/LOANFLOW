package com.loanflow.loanflow.service;

import com.loanflow.loanflow.dto.LoanRequest;

/**
 * Service interface responsible for evaluating loan eligibility and risk.
 *
 * Implementations of this interface analyze financial inputs and return
 * computed metrics used to determine loan approval and pricing.
 */
public interface EligibilityService {

    /**
     * Evaluates a loan request and calculates eligibility metrics.
     *
     * @param req loan request input data
     * @return EligibilityResult containing computed values
     */
    EligibilityResult evaluate(LoanRequest req);

    /**
     * Immutable result object returned by eligibility evaluation.
     *
     * Implemented as a Java record for:
     *  - Immutability
     *  - Thread safety
     *  - Reduced boilerplate
     */
    record EligibilityResult(
            double dti,
            int riskScore,
            String decision,
            double recommendedRate
    ) {}
}
