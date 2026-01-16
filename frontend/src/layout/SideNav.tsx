import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Divider,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth } from "../auth/authStorage";

type NavItem = { label: string; path: string };

/**
 * Side navigation drawer displayed for authenticated users.
 *
 * Navigation items are dynamically selected based on the user's role.
 */
export default function SideNav({ drawerWidth }: { drawerWidth: number }) {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const { role } = getAuth();

  // Navigation options for each role
  const customerItems: NavItem[] = [
    { label: "Customer Dashboard", path: "/customer" },
    // Future routes can be added here
  ];

  const analystItems: NavItem[] = [
    { label: "Analyst Dashboard", path: "/analyst" },
    // Future routes can be added here
  ];

  const adminItems: NavItem[] = [
    { label: "Admin Dashboard", path: "/admin" },
    // Future routes can be added here
  ];

  // Select navigation items based on current user role
  const items =
    role === "ADMIN"
      ? adminItems
      : role === "ANALYST"
      ? analystItems
      : customerItems;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
        display: { xs: "none", sm: "block" }, // Hidden on small screens
      }}
      open
    >
      <Toolbar />
      <Divider />

      {/* Navigation list */}
      <List>
        {items.map((it) => (
          <ListItemButton
            key={it.path}
            selected={pathname === it.path}
            onClick={() => nav(it.path)}
          >
            <ListItemText primary={it.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
