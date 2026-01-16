package com.loanflow.loanflow.service;

import com.loanflow.loanflow.entity.LoanApplication;
import com.loanflow.loanflow.entity.LoanStatus;
import org.springframework.data.domain.Page;

/**
 * Service interface responsible for querying loan applications.
 *
 * Provides abstraction for pagination, sorting, and filtering logic
 * so that controllers remain lightweight and focused on HTTP handling.
 */
public interface LoanQueryService {

    /**
     * Retrieves a paginated list of loan applications based on query parameters.
     *
     * @param page      page index (0-based)
     * @param size      number of records per page
     * @param sortBy    entity field to sort by
     * @param direction sort direction (asc / desc)
     * @param status    optional loan status filter
     * @return paginated list of loan applications
     */
    Page<LoanApplication> listLoans(
            int page,
            int size,
            String sortBy,
            String direction,
            LoanStatus status
    );
}
