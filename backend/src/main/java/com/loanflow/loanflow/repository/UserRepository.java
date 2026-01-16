package com.loanflow.loanflow.repository;

import com.loanflow.loanflow.entity.User;
import com.loanflow.loanflow.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for managing User entities.
 *
 * Provides CRUD operations and custom query methods using
 * Spring Data JPA naming conventions.
 */
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Finds a user by username.
     *
     * Used during authentication and validation workflows.
     *
     * @param username unique username of the user.
     * @return Optional containing user if found.
     */
    Optional<User> findByUsername(String username);

    /**
     * Counts the number of users assigned to a specific role.
     *
     * Used for administrative metrics and reporting.
     *
     * @param role user role to count.
     * @return total number of users with the given role.
     */
    long countByRole(UserRole role);

    /**
     * Retrieves all users belonging to a specific role.
     *
     * Used for admin filtering and user management screens.
     *
     * @param role role to filter by.
     * @return list of users matching the role.
     */
    List<User> findByRole(UserRole role);
}
