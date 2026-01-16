import React from "react";
import { Container, Typography, Button } from "@mui/material";
import { clearAuth, getUsername, getRole } from "../auth/authStorage";
import { useNavigate } from "react-router-dom";

/**
 * Simple generic dashboard page.
 *
 * This component is mainly used as:
 *  - A fallback / basic landing page after login
 *  - A quick way to verify authentication state during development
 *
 * Displays current user info and allows logout.
 */
export default function DashboardPage() {
  const nav = useNavigate();

  // Read authenticated user info from localStorage helpers
  const username = getUsername();
  const role = getRole();

  return (
    <Container sx={{ mt: 8 }}>
      <Typography variant="h4">Dashboard</Typography>

      {/* Display logged-in user identity */}
      <Typography sx={{ mt: 2 }}>
        Logged in as <b>{username}</b> ({role})
      </Typography>

      {/* Clears auth state and redirects back to login */}
      <Button
        sx={{ mt: 3 }}
        variant="outlined"
        onClick={() => {
          clearAuth();
          nav("/login");
        }}
      >
        Logout
      </Button>
    </Container>
  );
}
