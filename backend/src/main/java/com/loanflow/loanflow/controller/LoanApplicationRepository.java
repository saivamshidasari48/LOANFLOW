package com.loanflow.loanflow.repository;

import com.loanflow.loanflow.entity.LoanApplication;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository interface for managing LoanApplication entities.
 *
 * This interface extends JpaRepository, which automatically provides:
 *  - CRUD operations (save, findById, findAll, delete, etc.)
 *  - Pagination and sorting support
 *  - Transaction management handled by Spring
 *
 * No implementation is required because Spring Data JPA
 * generates the concrete implementation at runtime.
 *
 * Custom query methods can be added here later if needed
 * (e.g., findByStatus, findByCustomerId, etc.).
 */
public interface LoanApplicationRepository
        extends JpaRepository<LoanApplication, Long> {
}
