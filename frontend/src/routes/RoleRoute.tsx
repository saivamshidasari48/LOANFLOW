import React, { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * Role-based route guard.
 * Ensures that only users with allowed roles can access a route.
 * If a user tries to access a forbidden route, they are redirected
 * to their own dashboard based on role.
 */
export default function RoleRoute({
  allow,
  children,
}: {
  allow: string[];          // List of roles allowed to access this route
  children: JSX.Element;   // Protected page component
}) {
  const location = useLocation();

  // Read role from localStorage and normalize it
  const roleRaw = localStorage.getItem("role") || "";
  const role = roleRaw.toUpperCase().replace("ROLE_", "");

  // If role is missing (not logged in), redirect to login
  if (!role) return <Navigate to="/login" replace />;

  // If user role is NOT allowed for this route
  if (!allow.includes(role)) {
    // Redirect user to their appropriate dashboard
    const target =
      role === "ADMIN" ? "/admin" :
      role === "ANALYST" ? "/analyst" :
      "/customer";

    // Prevent infinite redirect loop if already on the target page
    if (location.pathname === target) return children;

    return <Navigate to={target} replace />;
  }

  // Role is allowed → render the protected content
  return children;
}
