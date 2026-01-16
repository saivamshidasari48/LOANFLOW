import React from "react";
import { Box } from "@mui/material";
import TopBar from "./TopBar";
import SideNav from "./SideNav";

/**
 * Shared application layout wrapper.
 *
 * Renders the top navigation bar, side navigation drawer,
 * and the main content area where pages are displayed.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const drawerWidth = 240; // Width of the side navigation drawer

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <TopBar drawerWidth={drawerWidth} />
      <SideNav drawerWidth={drawerWidth} />

      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: "64px", // Height of the AppBar
          ml: { sm: `${drawerWidth}px` }, // Offset for permanent drawer
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
