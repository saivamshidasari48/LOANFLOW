import React from "react";
import { AppBar, Toolbar, Box, Button, Typography } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import logo from "../assets/loanflow-logo-cropped.png";

/**
 * Props used to control header behavior and visibility.
 */
interface AppHeaderProps {
  showCreateAccount?: boolean;
  showLogout?: boolean;
  pageTitle?: string;
}

/**
 * Application header component.
 *
 * Displays:
 *  - Logo with home navigation
 *  - Optional page title
 *  - Optional actions (Create Account / Logout)
 *
 * Styling uses a glassmorphism effect for a modern UI look.
 */
export default function AppHeader({
  showCreateAccount = false,
  showLogout = false,
  pageTitle = "",
}: AppHeaderProps) {
  const nav = useNavigate();

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        // Semi-transparent glass background
        background: "rgba(120, 110, 40, 0.28)",

        // Blur + saturation for glass effect
        backdropFilter: "blur(16px) saturate(160%)",
        WebkitBackdropFilter: "blur(16px) saturate(160%)",

        // Subtle borders and shadow for depth
        borderBottom: "1px solid rgba(255,255,255,0.14)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.45)",

        // Inner highlight line
        position: "relative",
        "&:before": {
          content: '""',
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 1,
          background: "rgba(255,255,255,0.10)",
          pointerEvents: "none",
        },
      }}
    >
      <Toolbar
        sx={{
          height: 72,
          minHeight: 72,
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          alignItems: "center",
          px: { xs: 2.5, sm: 4 },
        }}
      >
        {/* Logo → navigates to home */}
        <Box
          component="img"
          src={logo}
          alt="LoanFlow Logo"
          onClick={() => nav("/")}
          sx={{
            height: 25,
            width: "auto",
            objectFit: "contain",
            cursor: "pointer",
            transform: "scale(1.45)",
            ml: 1.5,
            filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5))",
          }}
        />

        {/* Page title */}
        <Typography
          sx={{
            textAlign: "center",
            fontWeight: 700,
            letterSpacing: 0.3,
            color: "rgba(255,255,255,0.88)",
            fontSize: { xs: 16, sm: 18 },
            userSelect: "none",
          }}
        >
          {pageTitle}
        </Typography>

        {/* Right-side actions */}
        <Box sx={{ display: "flex", gap: 1.8, justifyContent: "flex-end" }}>
          {showCreateAccount && (
            <Button
              component={RouterLink}
              to="/signup"
              variant="contained"
              sx={{
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 2,
                px: 2.4,
                height: 40,

                // Glass-styled button
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.10))",
                boxShadow: "none",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",

                "&:hover": {
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.28), rgba(255,255,255,0.14))",
                },
              }}
            >
              Create Account
            </Button>
          )}

          {showLogout && (
            <Button
              onClick={() => {
                localStorage.clear();
                nav("/");
              }}
              variant="contained"
              color="error"
              sx={{
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 2,
                px: 2.2,
                height: 40,
              }}
            >
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
