import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoanApplication from "./pages/LoanApplication";

import ApplicationStatusPage from "./pages/ApplicationStatusPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

import ProtectedRoute from "./auth/ProtectedRoute";
import RoleDashboardRedirect from "./routes/RoleDashboardRedirect";
import RoleRoute from "./routes/RoleRoute";

import CustomerDashboard from "./pages/CustomerDashboard";
import AnalystDashboard from "./pages/AnalystDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import AdminUsersPage from "./pages/AdminUsersPage";
import AdminLoansPage from "./pages/AdminLoansPage";

/**
 * Root application router.
 * Handles public routes, authentication guards, and role-based access control.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =======================
            Public Routes
           ======================= */}

        {/* Landing / marketing page */}
        <Route path="/" element={<HomePage />} />

        {/* Authentication pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* =======================
            Authenticated Redirects
           ======================= */}

        {/* After login, redirect user to dashboard based on role */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <RoleDashboardRedirect />
            </ProtectedRoute>
          }
        />

        {/* Loan application flow (customer access) */}
        <Route
          path="/loan-application"
          element={
            <ProtectedRoute>
              <LoanApplication />
            </ProtectedRoute>
          }
        />

        {/* Customer loan tracking page */}
        <Route
          path="/application-status"
          element={
            <ProtectedRoute>
              <ApplicationStatusPage />
            </ProtectedRoute>
          }
        />

        {/* =======================
            Role-Based Dashboards
           ======================= */}

        {/* Customer dashboard */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute>
              <RoleRoute allow={["CUSTOMER"]}>
                <CustomerDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Analyst dashboard */}
        <Route
          path="/analyst"
          element={
            <ProtectedRoute>
              <RoleRoute allow={["ANALYST"]}>
                <AnalystDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* =======================
            Admin Routes
           ======================= */}

        {/* Admin main dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleRoute allow={["ADMIN"]}>
                <AdminDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Admin user management */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <RoleRoute allow={["ADMIN"]}>
                <AdminUsersPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Admin loan management */}
        <Route
          path="/admin/loans"
          element={
            <ProtectedRoute>
              <RoleRoute allow={["ADMIN"]}>
                <AdminLoansPage />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* =======================
            Fallback
           ======================= */}

        {/* Unknown routes redirect back to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
