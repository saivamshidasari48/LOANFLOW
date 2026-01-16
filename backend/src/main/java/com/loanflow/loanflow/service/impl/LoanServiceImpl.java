package com.loanflow.loanflow.service.impl;

import com.loanflow.loanflow.dto.LoanRequest;
import com.loanflow.loanflow.entity.*;
import com.loanflow.loanflow.repository.LoanRepository;
import com.loanflow.loanflow.service.EligibilityService;
import com.loanflow.loanflow.service.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * Implementation of LoanService responsible for processing
 * new loan applications.
 *
 * This service:
 *  - Accepts incoming loan requests
 *  - Evaluates eligibility and risk
 *  - Maps request data into a LoanApplication entity
 *  - Persists the loan into the database
 */
@Service
@RequiredArgsConstructor
public class LoanServiceImpl implements LoanService {

    /**
     * Repository used to persist loan applications.
     */
    private final LoanRepository loanRepository;

    /**
     * Service used to evaluate eligibility and compute risk metrics.
     */
    private final EligibilityService eligibilityService;

    /**
     * Creates and persists a new loan application.
     *
     * @param req loan request payload received from client
     * @return saved LoanApplication entity
     */
    @Override
    public LoanApplication applyLoan(LoanRequest req) {

        // Evaluate eligibility, risk score, decision, and interest rate
        var eval = eligibilityService.evaluate(req);

        // Map request fields into LoanApplication entity
        LoanApplication loan = new LoanApplication();
        loan.setAmount(req.getAmount());
        loan.setTenure(req.getTenure());

        loan.setFullName(req.getFullName());
        loan.setMonthlyIncome(req.getMonthlyIncome());
        loan.setMonthlyDebt(req.getMonthlyDebt());
        loan.setCreditScore(req.getCreditScore());
        loan.setEmploymentType(req.getEmploymentType());
        loan.setPurpose(req.getPurpose());

        // Populate computed analytics fields from evaluation result
        loan.setDti(eval.dti());
        loan.setRiskScore(eval.riskScore());
        loan.setEligibilityDecision(eval.decision());

        // Assign derived loan attributes
        loan.setInterestRate(eval.recommendedRate());
        loan.setStatus(LoanStatus.SUBMITTED);
        loan.setCreatedAt(LocalDateTime.now());

        // Persist and return the loan record
        return loanRepository.save(loan);
    }
}
