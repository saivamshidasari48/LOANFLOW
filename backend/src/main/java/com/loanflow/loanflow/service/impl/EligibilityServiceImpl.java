package com.loanflow.loanflow.service.impl;

import com.loanflow.loanflow.dto.LoanRequest;
import com.loanflow.loanflow.service.EligibilityService;
import org.springframework.stereotype.Service;

/**
 * Implementation of the EligibilityService responsible for evaluating
 * loan eligibility, risk score, and interest rate.
 *
 * This service applies simple rule-based scoring using:
 *  - Credit score
 *  - Debt-to-Income (DTI) ratio
 *  - Employment type
 *
 * The output is an EligibilityResult that drives downstream decisions
 * such as approval, review, or rejection.
 */
@Service
public class EligibilityServiceImpl implements EligibilityService {

    /**
     * Evaluates a loan request and computes:
     *  - Debt-to-Income (DTI) ratio
     *  - Risk score (0–100)
     *  - Eligibility decision (ELIGIBLE / REVIEW / REJECT)
     *  - Interest rate based on risk
     *
     * @param req incoming loan request data
     * @return calculated eligibility result
     */
    @Override
    public EligibilityResult evaluate(LoanRequest req) {

        // Safely extract numeric inputs and default to 0 when missing
        double income = req.getMonthlyIncome() == null ? 0 : req.getMonthlyIncome();
        double debt   = req.getMonthlyDebt() == null ? 0 : req.getMonthlyDebt();
        int credit    = req.getCreditScore() == null ? 0 : req.getCreditScore();

        // Calculate Debt-to-Income ratio (DTI)
        // If income is zero or invalid, assume maximum risk (DTI = 1.0)
        double dti = (income <= 0) ? 1.0 : (debt / income);

        int risk = 0;

        // ----------------------------
        // Credit score contribution
        // ----------------------------
        if (credit >= 760) risk += 10;
        else if (credit >= 700) risk += 25;
        else if (credit >= 650) risk += 45;
        else risk += 70;

        // ----------------------------
        // DTI contribution
        // ----------------------------
        if (dti <= 0.25) risk += 5;
        else if (dti <= 0.35) risk += 15;
        else if (dti <= 0.50) risk += 35;
        else risk += 55;

        // ----------------------------
        // Employment type contribution
        // ----------------------------
        String emp = safe(req.getEmploymentType());
        if (emp.equals("SALARIED")) risk += 5;
        else if (emp.equals("SELF_EMPLOYED")) risk += 15;
        else if (emp.equals("STUDENT")) risk += 25;
        else risk += 35;

        // Clamp risk score to valid range (0–100)
        risk = Math.min(100, Math.max(0, risk));

        // ----------------------------
        // Eligibility decision rules
        // ----------------------------
        String decision;
        if (credit < 600 || dti > 0.60) decision = "REJECT";
        else if (credit < 680 || dti > 0.45) decision = "REVIEW";
        else decision = "ELIGIBLE";

        // ----------------------------
        // Interest rate calculation
        // ----------------------------
        double base = 8.5;                       // Base interest rate
        double rate = base + (risk * 0.05);      // Risk-adjusted increment
        rate = Math.round(rate * 10.0) / 10.0;   // Round to one decimal place

        return new EligibilityResult(dti, risk, decision, rate);
    }

    /**
     * Normalizes string inputs safely by:
     *  - Handling null values
     *  - Trimming whitespace
     *  - Converting to uppercase
     *
     * @param v raw string input
     * @return normalized string value
     */
    private String safe(String v) {
        return v == null ? "" : v.trim().toUpperCase();
    }
}
