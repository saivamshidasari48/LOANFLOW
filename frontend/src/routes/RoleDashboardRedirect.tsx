import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Redirects the user to the correct dashboard based on their role.
 * This is typically used after login or when landing on a generic dashboard route.
 */
export default function RoleDashboardRedirect() {
  // Read role from localStorage (stored during login)
  const roleRaw = localStorage.getItem("role") || "";

  // Normalize role value (remove ROLE_ prefix and enforce uppercase)
  const role = roleRaw.toUpperCase().replace("ROLE_", "");

  // Route user to the correct dashboard based on role
  if (role === "ADMIN") return <Navigate to="/admin" replace />;
  if (role === "ANALYST") return <Navigate to="/analyst" replace />;

  // Default fallback → customer dashboard
  return <Navigate to="/customer" replace />;
}
