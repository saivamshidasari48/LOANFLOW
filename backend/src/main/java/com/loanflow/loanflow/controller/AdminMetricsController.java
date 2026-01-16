package com.loanflow.loanflow.controller;

import com.loanflow.loanflow.entity.UserRole;
import com.loanflow.loanflow.repository.LoanRepository;
import com.loanflow.loanflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller responsible for exposing administrative metrics.
 *
 * This endpoint provides high-level system statistics that are useful
 * for dashboards and monitoring, such as:
 *  - Number of users by role.
 *  - Total number of loan applications in the system.
 *
 * Access to this controller is protected via Spring Security and
 * restricted to ADMIN users.
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminMetricsController {

    /**
     * Repository used to query user-related metrics from the database.
     */
    private final UserRepository userRepository;

    /**
     * Repository used to query loan-related metrics from the database.
     */
    private final LoanRepository loanRepository;

    /**
     * Returns aggregated system metrics for the admin dashboard.
     *
     * This method:
     *  - Counts users grouped by role (CUSTOMER, ANALYST, ADMIN).
     *  - Retrieves the total number of loan records.
     *  - Packages the results into an immutable response DTO.
     *
     * @return AdminMetricsResponse containing system statistics.
     */
    @GetMapping("/metrics")
    public AdminMetricsResponse metrics() {

        // Count users by role using repository-level aggregation queries
        long customers = userRepository.countByRole(UserRole.CUSTOMER);
        long analysts  = userRepository.countByRole(UserRole.ANALYST);
        long admins    = userRepository.countByRole(UserRole.ADMIN);

        // Total number of loan applications in the system
        long loans = loanRepository.count();

        // Return metrics in a lightweight immutable response object
        return new AdminMetricsResponse(customers, analysts, admins, loans);
    }

    /**
     * Immutable response DTO implemented using Java Record.
     *
     * Benefits:
     *  - Automatically generates constructor, getters, equals, and toString.
     *  - Thread-safe and immutable by design.
     *  - Reduces boilerplate compared to traditional DTO classes.
     *
     * This record is serialized automatically by Spring into JSON.
     */
    public record AdminMetricsResponse(
            long customers,
            long analysts,
            long admins,
            long loans
    ) {}
}
