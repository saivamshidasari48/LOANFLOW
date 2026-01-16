import React from "react";
import { Navigate } from "react-router-dom";
import { isLoggedIn } from "./authStorage";

/**
 * Wrapper component that protects routes requiring authentication.
 *
 * If the user is not logged in, they are redirected to the login page.
 * Otherwise, the wrapped child components are rendered normally.
 */
export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isLoggedIn()) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
