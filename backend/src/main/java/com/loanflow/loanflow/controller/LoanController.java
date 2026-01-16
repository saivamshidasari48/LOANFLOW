package com.loanflow.loanflow.controller;

import com.loanflow.loanflow.dto.LoanRequest;
import com.loanflow.loanflow.entity.LoanApplication;
import com.loanflow.loanflow.entity.LoanStatus;
import com.loanflow.loanflow.repository.LoanRepository;
import com.loanflow.loanflow.service.LoanQueryService;
import com.loanflow.loanflow.service.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

/**
 * LoanController exposes REST endpoints for:
 *  - Creating (applying for) a loan application
 *  - Listing loans with pagination/sorting/filtering
 *  - Approving or rejecting a loan (role-restricted by SecurityConfig)
 *
 * Note: Business logic is intentionally kept out of the controller and handled by services,
 * keeping this layer focused on HTTP request/response handling.
 */
@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
public class LoanController {

    /**
     * Service responsible for validating and creating new loan applications.
     */
    private final LoanService loanService;

    /**
     * Service responsible for querying loans (pagination, sorting, filtering).
     */
    private final LoanQueryService loanQueryService;

    /**
     * Repository used here for direct status updates (approve/reject).
     * This keeps the approve/reject endpoints simple and efficient.
     */
    private final LoanRepository loanRepository;

    /**
     * Creates a new loan application.
     *
     * @param request request payload containing loan applicant details
     * @return the saved LoanApplication entity
     */
    @PostMapping("/apply")
    public LoanApplication apply(@RequestBody LoanRequest request) {
        return loanService.applyLoan(request);
    }

    /**
     * Returns a paginated list of loan applications.
     *
     * Supports:
     *  - Pagination: page, size
     *  - Sorting: sortBy, direction
     *  - Optional filtering by status (e.g., PENDING / APPROVED / REJECTED)
     */
    @GetMapping
    public Page<LoanApplication> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(required = false) LoanStatus status
    ) {
        return loanQueryService.listLoans(page, size, sortBy, direction, status);
    }

    /**
     * Approves a loan application by ID.
     *
     * - Returns 404 if the loan does not exist.
     * - Updates status to APPROVED and persists the change.
     *
     * Authorization is enforced via SecurityConfig (ANALYST/ADMIN).
     */
    @PatchMapping("/{id}/approve")
    public LoanApplication approve(@PathVariable Long id) {
        LoanApplication loan = loanRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Loan not found"));

        loan.setStatus(LoanStatus.APPROVED);
        return loanRepository.save(loan);
    }

    /**
     * Rejects a loan application by ID.
     *
     * - Returns 404 if the loan does not exist.
     * - Updates status to REJECTED and persists the change.
     *
     * Authorization is enforced via SecurityConfig (ANALYST/ADMIN).
     */
    @PatchMapping("/{id}/reject")
    public LoanApplication reject(@PathVariable Long id) {
        LoanApplication loan = loanRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Loan not found"));

        loan.setStatus(LoanStatus.REJECTED);
        return loanRepository.save(loan);
    }
}
