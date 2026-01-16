import React from "react";
import { Box, Container, Paper, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import bg from "../assets/home.jpg";

/**
 * Public landing page of the application.
 *
 * Purpose:
 *  - Introduce the LoanFlow platform
 *  - Provide entry points to Login and Signup
 *  - Keep branding consistent with the rest of the app
 */
export default function HomePage() {
  const nav = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",

        // Full-screen hero background image
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Shared header with Create Account action */}
      <AppHeader showCreateAccount pageTitle="Welcome" />

      {/* Hero content section */}
      <Box sx={{ flex: 1, display: "grid", placeItems: "center", px: 2 }}>
        <Container maxWidth="md">
          {/* Glass-style hero card */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 4,
              position: "relative",
              overflow: "hidden",
              color: "white",

              background:
                "linear-gradient(180deg, rgba(20,40,70,0.78), rgba(15,30,55,0.82))",
              border: "1px solid rgba(255,255,255,0.22)",
              backdropFilter: "blur(18px) saturate(130%)",
              WebkitBackdropFilter: "blur(18px) saturate(130%)",
              boxShadow: "0 30px 90px rgba(0,0,0,0.55)",

              // Subtle inner highlight for depth
              "&:before": {
                content: '""',
                position: "absolute",
                inset: 0,
                borderRadius: 4,
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
                pointerEvents: "none",
              },
            }}
          >
            {/* App branding */}
            <Typography variant="h3" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
              LoanFlow
            </Typography>

            {/* Short product description */}
            <Typography
              sx={{
                mt: 1.5,
                maxWidth: 680,
                color: "rgba(255,255,255,0.85)",
              }}
            >
              Track applications, analyze eligibility, and manage loan workflows
              with a clean, secure, role-based dashboard built for speed and clarity.
              <br></br>(admin creds: admin/admin123, analyst creds: analyst3/Ana (these are in username/password format))
            </Typography>

            {/* Primary call-to-action buttons */}
            <Box sx={{ display: "flex", gap: 2, mt: 3, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => nav("/login")}
                sx={{
                  textTransform: "none",
                  fontWeight: 900,
                  borderRadius: 2.5,
                  px: 4,
                  py: 1.2,
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

              <Button
                variant="outlined"
                size="large"
                onClick={() => nav("/signup")}
                sx={{
                  textTransform: "none",
                  fontWeight: 900,
                  borderRadius: 2.5,
                  px: 4,
                  py: 1.2,
                  borderColor: "rgba(255,255,255,0.35)",
                  color: "rgba(255,255,255,0.92)",
                  "&:hover": {
                    borderColor: "rgba(255,255,255,0.55)",
                    backgroundColor: "rgba(255,255,255,0.08)",
                  },
                }}
              >
                Create account
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
