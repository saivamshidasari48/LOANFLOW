import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Divider,
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { login } from "../api/auth";
import { setAuth } from "../auth/authStorage";
import logo from "../assets/loanflow-logo-cropped.png";
import bg from "../assets/login-bg1.jpg";
import AppHeader from "../components/AppHeader";

export default function LoginPage() {
  const nav = useNavigate();

  // Controlled inputs (kept in state for validation + submission)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Display backend/validation errors to the user
  const [error, setError] = useState<string | null>(null);

  /**
   * Calls backend login API, stores token/role in localStorage,
   * and routes user to the correct dashboard based on role.
   */
  const submit = async () => {
    setError(null);
    try {
      const data = await login({ username, password });

      // Persist auth details for axios interceptor + protected routes
      setAuth(data.token, data.role, data.username);

      // Role-based landing page after login
      if (data.role === "ADMIN") nav("/admin");
      else if (data.role === "ANALYST") nav("/analyst");
      else nav("/dashboard"); // CUSTOMER
    } catch (e: any) {
      setError(e?.response?.data?.message || "Login failed. Check username/password.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",

        // Background image with dark overlay for readability
        backgroundImage: `
          linear-gradient(
            rgba(7,30,47,0.55),
            rgba(7,30,47,0.55)
          ),
          url(${bg})
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Shared top header */}
      <AppHeader showCreateAccount pageTitle="LOGIN PAGE" />

      {/* Centered login card */}
      <Box
        sx={{
          flex: 1,
          display: "grid",
          placeItems: "center",
          px: 2,
        }}
      >
        <Container maxWidth="sm" sx={{ m: 0 }}>
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              p: { xs: 3, sm: 4 },
              borderRadius: 4,
              position: "relative",
              overflow: "hidden",

              // Glassy premium card styling
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(245,248,255,0.94) 100%)",
              border: "1px solid rgba(255,255,255,0.55)",
              boxShadow:
                "0 30px 90px rgba(0,0,0,0.40), 0 10px 24px rgba(0,0,0,0.18)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",

              // Brand accent bar at the top
              "&:after": {
                content: '""',
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                height: 6,
                background:
                  "linear-gradient(90deg, #1D9BF0 0%, #2CC7A5 55%, #43D17A 100%)",
                opacity: 0.9,
              },

              // Decorative glow blobs
              "&:before": {
                content: '""',
                position: "absolute",
                inset: -60,
                background:
                  "radial-gradient(circle at 20% 15%, rgba(29,155,240,0.18), transparent 45%)," +
                  "radial-gradient(circle at 85% 80%, rgba(44,199,165,0.16), transparent 45%)," +
                  "radial-gradient(circle at 50% 110%, rgba(67,209,122,0.12), transparent 55%)",
                filter: "blur(22px)",
                zIndex: 0,
              },

              // Small hover lift effect
              transition: "transform 220ms ease, box-shadow 220ms ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow:
                  "0 40px 110px rgba(0,0,0,0.45), 0 14px 30px rgba(0,0,0,0.22)",
              },
            }}
          >
            <Box sx={{ position: "relative", zIndex: 1 }}>
              {/* App logo */}
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Box
                  component="img"
                  src={logo}
                  alt="LoanFlow"
                  sx={{ width: "auto", height: 75, objectFit: "contain" }}
                />
              </Box>

              <Typography variant="h4" sx={{ fontWeight: 900, textAlign: "center" }}>
                Welcome back
              </Typography>
              <Typography
                variant="body1"
                sx={{ textAlign: "center", color: "text.secondary", mt: 0.8 }}
              >
                Sign in to access your account.
              </Typography>

              <Divider sx={{ my: 2.5 }} />

              {/* Error banner (from backend or validation) */}
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {/* Inputs */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                    backgroundColor: "rgba(240,245,255,0.75)",
                  },
                }}
              >
                <TextField
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  fullWidth
                  autoComplete="username"
                />

                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  autoComplete="current-password"
                  // Convenience: allow Enter key to submit
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submit();
                  }}
                />

                <Button
                  onClick={submit}
                  size="large"
                  sx={{
                    mt: 0.5,
                    py: 1.25,
                    borderRadius: 2.5,
                    textTransform: "none",
                    fontWeight: 900,
                    fontSize: 16,
                    color: "white",
                    background:
                      "linear-gradient(90deg, #1D9BF0 0%, #2CC7A5 55%, #43D17A 100%)",
                    boxShadow: "0 14px 30px rgba(44,199,165,0.30)",
                    "&:hover": {
                      background:
                        "linear-gradient(90deg, #168bd8 0%, #25b596 55%, #38be6d 100%)",
                    },
                  }}
                >
                  Login
                </Button>

                {/* Link to signup */}
                <Button
                  component={RouterLink}
                  to="/signup"
                  sx={{ textTransform: "none", fontWeight: 800 }}
                >
                  New user? Create account
                </Button>

                {/* Footer note */}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ textAlign: "center", mt: 0.5 }}
                >
                  By signing in, you agree to our Terms &amp; Privacy Policy.
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
