package com.loanflow.loanflow.controller;

import com.loanflow.loanflow.entity.User;
import com.loanflow.loanflow.entity.UserRole;
import com.loanflow.loanflow.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * REST controller that allows administrators to manage users.
 *
 * Features:
 *  - View all users or filter users by role.
 *  - Update a user's role.
 *  - Enable or disable a user's account.
 *
 * All endpoints under this controller are protected and accessible
 * only by ADMIN users via Spring Security configuration.
 */
@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    /**
     * Repository for performing CRUD operations on User entities.
     */
    private final UserRepository userRepository;

    /**
     * Returns a list of users.
     *
     * Optional filtering by role allows admins to retrieve
     * only a subset of users when needed.
     *
     * Example:
     *   GET /api/admin/users
     *   GET /api/admin/users?role=ANALYST
     *
     * @param role optional query parameter for filtering users by role.
     * @return list of users mapped into lightweight response DTOs.
     */
    @GetMapping
    public List<UserResponse> listUsers(@RequestParam(required = false) UserRole role) {

        // Fetch users based on optional role filter
        List<User> users = (role == null)
                ? userRepository.findAll()
                : userRepository.findByRole(role);

        // Convert entities into DTOs to avoid exposing internal fields
        return users.stream()
                .map(UserResponse::from)
                .toList();
    }

    /**
     * Updates the role of a specific user.
     *
     * Validation is performed to ensure the role is provided.
     * Returns appropriate HTTP error codes for invalid requests
     * or missing users.
     *
     * @param id  user identifier.
     * @param req request body containing the new role.
     * @return updated user information.
     */
    @PutMapping("/{id}/role")
    public UserResponse updateRole(@PathVariable Long id,
                                   @RequestBody UpdateRoleRequest req) {

        // Validate request payload
        if (req == null || req.role == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Role is required"
            );
        }

        // Fetch user or throw 404 if not found
        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND, "User not found"
                        ));

        // Update role and persist changes
        user.setRole(req.role);
        userRepository.save(user);

        return UserResponse.from(user);
    }

    /**
     * Enables or disables a user's account.
     *
     * This allows administrators to deactivate users without deleting them,
     * preserving audit history and relationships.
     *
     * @param id  user identifier.
     * @param req request body containing active flag.
     * @return updated user information.
     */
    @PutMapping("/{id}/active")
    public UserResponse updateActive(@PathVariable Long id,
                                     @RequestBody UpdateActiveRequest req) {

        // Validate request payload
        if (req == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Active flag required"
            );
        }

        // Fetch user or throw 404 if not found
        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND, "User not found"
                        ));

        // Update active flag and persist changes
        user.setActive(req.active);
        userRepository.save(user);

        return UserResponse.from(user);
    }

    /**
     * Request DTO for updating a user's role.
     */
    @Data
    public static class UpdateRoleRequest {
        public UserRole role;
    }

    /**
     * Request DTO for enabling/disabling a user.
     */
    @Data
    public static class UpdateActiveRequest {
        public boolean active;
    }

    /**
     * Response DTO exposed to clients.
     *
     * This avoids exposing sensitive fields such as passwords
     * and internal database details.
     */
    @Data
    @AllArgsConstructor
    public static class UserResponse {
        private Long id;
        private String username;
        private UserRole role;
        private boolean active;

        /**
         * Maps User entity to UserResponse DTO.
         */
        public static UserResponse from(User u) {
            return new UserResponse(
                    u.getId(),
                    u.getUsername(),
                    u.getRole(),
                    u.isActive()
            );
        }
    }
}
