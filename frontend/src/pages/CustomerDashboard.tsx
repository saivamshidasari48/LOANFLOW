import React from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import { getAuth } from "../auth/authStorage";

import bg from "../assets/login-bg1.jpg";

/**
 * Customer landing page after login.
 *
 * Provides quick actions:
 *  - Start a new loan application
 *  - View existing applications and their current status
 */
export default function CustomerDashboard() {
  const nav = useNavigate();
  const { username, role } = getAuth();

  // Normalizes role format in case backend ever returns "ROLE_CUSTOMER" style values
  const displayRole = (role || "").toUpperCase().replace("ROLE_", "");

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",

        // Reuse the same background treatment as Login/Signup for consistent branding
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
      {/* Shared app header (logout + page title) */}
      <AppHeader showLogout pageTitle="CUSTOMER DASHBOARD" />

      {/* Centered layout wrapper */}
      <Box
        sx={{
          minHeight: "100dvh",
          display: "flex",
          paddingTop: "1%",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          overflow: "hidden", // prevent page-level scroll; card handles its own scroll
        }}
      >
        <Container maxWidth="md">
          {/* Main "glass" card container */}
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              p: { xs: 3, sm: 4 },
              borderRadius: 4,
              position: "relative",
              overflow: "hidden",
              maxHeight: "calc(100vh - 160px)",

              // Allow card content to scroll if needed, without showing scrollbar
              overflowY: "auto",
              "&::-webkit-scrollbar": { display: "none" },
              scrollbarWidth: "none",
              msOverflowStyle: "none",

              background:
                "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(245,248,255,0.94) 100%)",
              border: "1px solid rgba(255,255,255,0.55)",
              boxShadow:
                "0 30px 90px rgba(0,0,0,0.40), 0 10px 24px rgba(0,0,0,0.18)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",

              // Accent bar at top for visual identity
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

              // Subtle background glow for depth
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
            }}
          >
            {/* Content placed above the glow layers */}
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 900 }}>
                Welcome, {username || "Customer"}
              </Typography>

              <Typography sx={{ color: "text.secondary", mt: 0.6 }}>
                Logged in as <b>{username || "-"}</b>
              </Typography>

              <Divider sx={{ my: 2.5 }} />

              {/* Primary customer actions */}
              <Stack spacing={2}>
                {/* Start new application */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.2,
                    borderRadius: 3,
                    border: "1px solid rgba(0,0,0,0.08)",
                    background: "rgba(240,245,255,0.75)",
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Apply for a Loan
                  </Typography>
                  <Typography sx={{ color: "text.secondary", mt: 0.4 }}>
                    Start a new loan application in a guided workflow.
                  </Typography>

                  <Button
                    variant="contained"
                    // Uses a direct redirect to open the form route
                    onClick={() => (window.location.href = "/loan-application")}
                    sx={{
                      mt: 1.6,
                      textTransform: "none",
                      fontWeight: 900,
                      borderRadius: 2.5,
                      px: 3,
                      background:
                        "linear-gradient(90deg, #1D9BF0 0%, #2CC7A5 55%, #43D17A 100%)",
                      boxShadow: "0 14px 30px rgba(44,199,165,0.25)",
                      "&:hover": {
                        background:
                          "linear-gradient(90deg, #168bd8 0%, #25b596 55%, #38be6d 100%)",
                      },
                    }}
                  >
                    New Application
                  </Button>
                </Paper>

                {/* View application status table */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.2,
                    borderRadius: 3,
                    border: "1px solid rgba(0,0,0,0.08)",
                    background: "rgba(240,245,255,0.75)",
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    My Applications
                  </Typography>
                  <Typography sx={{ color: "text.secondary", mt: 0.4 }}>
                    Track status, view approvals, and check updates.
                  </Typography>

                  <Button
                    variant="contained"
                    onClick={() => nav("/application-status")}
                    sx={{
                      mt: 1.6,
                      textTransform: "none",
                      fontWeight: 900,
                      borderRadius: 2.5,
                      px: 3,
                      background:
                        "linear-gradient(90deg, #1D9BF0 0%, #2CC7A5 55%, #43D17A 100%)",
                      boxShadow: "0 14px 30px rgba(44,199,165,0.25)",
                      "&:hover": {
                        background:
                          "linear-gradient(90deg, #168bd8 0%, #25b596 55%, #38be6d 100%)",
                      },
                    }}
                  >
                    View Status
                  </Button>
                </Paper>
              </Stack>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
