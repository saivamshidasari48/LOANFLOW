package com.loanflow.loanflow.repository;

import com.loanflow.loanflow.entity.LoanApplication;
import com.loanflow.loanflow.entity.LoanStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository interface for accessing LoanApplication entities.
 *
 * Extends JpaRepository to automatically provide:
 *  - Standard CRUD operations
 *  - Pagination and sorting support
 *  - Transaction handling managed by Spring
 *
 * Custom query methods can be declared using Spring Data JPA
 * method naming conventions.
 */
public interface LoanRepository extends JpaRepository<LoanApplication, Long> {

    /**
     * Retrieves a paginated list of loan applications filtered by status.
     *
     * Spring automatically generates the implementation based on the
     * method name and parameter types.
     *
     * @param status   loan status to filter by (e.g., SUBMITTED, APPROVED).
     * @param pageable pagination and sorting configuration.
     * @return paginated list of matching loan applications.
     */
    Page<LoanApplication> findByStatus(LoanStatus status, Pageable pageable);
}
