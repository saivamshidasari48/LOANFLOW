package com.loanflow.loanflow.security;

import com.loanflow.loanflow.entity.User;
import com.loanflow.loanflow.entity.UserRole;
import com.loanflow.loanflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Custom UserDetailsService implementation backed by the database.
 *
 * This service is used by Spring Security during authentication to:
 *  - Load user credentials from the database
 *  - Map application roles to Spring Security authorities
 *  - Enforce account activation rules
 */
@Service
@RequiredArgsConstructor
public class DbUserDetailsService implements UserDetailsService {

    /**
     * Repository used to fetch user records from the database.
     */
    private final UserRepository userRepository;

    /**
     * Loads a user by username for authentication.
     *
     * Spring Security automatically calls this method during login
     * and JWT validation flows.
     *
     * @param username username provided during authentication
     * @return UserDetails object used internally by Spring Security
     * @throws UsernameNotFoundException if user does not exist
     */
    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        // Fetch user from database or throw exception if not found
        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found"));

        // Fallback to CUSTOMER role if role is null in database
        // This prevents NullPointerExceptions and ensures safe defaults
        UserRole role = (user.getRole() == null)
                ? UserRole.CUSTOMER
                : user.getRole();

        // Build Spring Security User object with:
        //  - Username
        //  - Encrypted password
        //  - Granted authorities (ROLE_* convention)
        //  - Disabled flag mapped from "active" field in DB
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .authorities(
                        List.of(new SimpleGrantedAuthority("ROLE_" + role.name()))
                )
                // If active=false in DB, user will not be allowed to authenticate
                .disabled(!user.isActive())
                .build();
    }
}
