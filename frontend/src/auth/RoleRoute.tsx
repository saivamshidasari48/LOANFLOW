import React, { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * Route guard that restricts access based on user role.
 *
 * If the user's role is not included in the allowed list,
 * they are redirected to their appropriate dashboard.
 */
export default function RoleRoute({
  allow,
  children,
}: {
  allow: string[];
  children: JSX.Element;
}) {
  const location = useLocation();

  // Retrieve role from localStorage and normalize it
  const roleRaw = localStorage.getItem("role") || "";
  const role = roleRaw.toUpperCase().replace("ROLE_", "");

  // If no role exists, redirect to login
  if (!role) return <Navigate to="/login" replace />;

  // If role is not allowed, redirect user to their correct dashboard
  if (!allow.includes(role)) {
    const target =
      role === "ADMIN"
        ? "/admin"
        : role === "ANALYST"
        ? "/analyst"
        : "/customer";

    // Prevent redirect loop if already on the target route
    if (location.pathname === target) return children;

    return <Navigate to={target} replace />;
  }

  // Role is allowed → render the protected page
  return children;
}
