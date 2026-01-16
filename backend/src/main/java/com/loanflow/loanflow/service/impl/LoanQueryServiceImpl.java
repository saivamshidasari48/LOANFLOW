package com.loanflow.loanflow.service.impl;

import com.loanflow.loanflow.entity.LoanApplication;
import com.loanflow.loanflow.entity.LoanStatus;
import com.loanflow.loanflow.repository.LoanRepository;
import com.loanflow.loanflow.service.LoanQueryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

/**
 * Implementation of LoanQueryService responsible for retrieving
 * loan applications with pagination, sorting, and optional filtering.
 *
 * This service encapsulates query-related logic and keeps controllers
 * lightweight and focused on request handling.
 */
@Service
public class LoanQueryServiceImpl implements LoanQueryService {

    /**
     * Repository used to access loan data from the database.
     */
    private final LoanRepository loanRepository;

    /**
     * Constructor-based dependency injection.
     */
    public LoanQueryServiceImpl(LoanRepository loanRepository) {
        this.loanRepository = loanRepository;
    }

    /**
     * Retrieves a paginated list of loans based on request parameters.
     *
     * Supports:
     *  - Pagination (page number and page size)
     *  - Dynamic sorting (field + direction)
     *  - Optional filtering by loan status
     *
     * @param page      page index (0-based)
     * @param size      number of records per page
     * @param sortBy    entity field to sort by
     * @param direction sort direction (asc / desc)
     * @param status    optional loan status filter
     * @return paginated list of loan applications
     */
    @Override
    public Page<LoanApplication> listLoans(
            int page,
            int size,
            String sortBy,
            String direction,
            LoanStatus status
    ) {

        // Determine sorting direction dynamically
        Sort sort = "desc".equalsIgnoreCase(direction)
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        // Build pageable object combining pagination + sorting
        PageRequest pageable = PageRequest.of(page, size, sort);

        // If no status filter is provided, return all loans
        if (status == null) {
            return loanRepository.findAll(pageable);
        }

        // Otherwise filter loans by status
        return loanRepository.findByStatus(status, pageable);
    }
}
