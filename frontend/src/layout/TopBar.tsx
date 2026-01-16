import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { clearAuth, getAuth } from "../auth/authStorage";

/**
 * Top navigation bar displayed across authenticated pages.
 *
 * Shows:
 *  - Application title
 *  - Logged-in user identity and role
 *  - Logout action
 */
export default function TopBar({ drawerWidth }: { drawerWidth: number }) {
  const nav = useNavigate();
  const { username, role } = getAuth();

  /**
   * Clears authentication state and redirects to login page.
   */
  const logout = () => {
    clearAuth();
    nav("/login");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        // Keep top bar above the side drawer
        zIndex: (theme) => theme.zIndex.drawer + 1,

        // Offset width and position based on drawer size
        ml: { sm: `${drawerWidth}px` },
        width: { sm: `calc(100% - ${drawerWidth}px)` },
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">LoanFlow</Typography>

        {/* User identity + logout action */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body2">
            Logged in as <b>{username ?? "?"}</b> ({role ?? "?"})
          </Typography>

          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
