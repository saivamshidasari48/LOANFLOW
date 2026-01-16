import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  Chip,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import {
  AdminUser,
  listAdminUsers,
  updateUserActive,
  updateUserRole,
  Role,
} from "../api/admin";

/**
 * Admin users management page.
 *
 * Features:
 *  - Optional role filtering via query param (?role=CUSTOMER|ANALYST|ADMIN)
 *  - Role updates (RBAC)
 *  - Activate/deactivate users (disabled users cannot log in)
 */
export default function AdminUsersPage() {
  const [params] = useSearchParams();

  // Read role filter from URL (used when navigating from dashboard cards)
  const roleParam = (params.get("role") as Role | null) || null;

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);

  // Page title changes based on current role filter
  const title = useMemo(() => {
    if (roleParam === "CUSTOMER") return "CUSTOMERS";
    if (roleParam === "ANALYST") return "ANALYSTS";
    if (roleParam === "ADMIN") return "ADMINS";
    return "ALL USERS";
  }, [roleParam]);

  /**
   * Fetches users from backend and applies role filtering when present.
   */
  const refresh = async () => {
    setLoading(true);
    try {
      const data = await listAdminUsers(roleParam || undefined);
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch whenever the role filter changes
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleParam]);

  /**
   * Updates user role and refreshes UI to reflect latest backend state.
   */
  const changeRole = async (id: number, role: Role) => {
    await updateUserRole(id, role);
    await refresh();
  };

  /**
   * Activates/deactivates a user account and refreshes UI.
   * Backend enforces login restriction for inactive users.
   */
  const toggleActive = async (id: number, active: boolean) => {
    await updateUserActive(id, active);
    await refresh();
  };

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        background:
          "radial-gradient(900px 600px at 18% 15%, rgba(29,155,240,0.16), transparent 55%)," +
          "radial-gradient(900px 700px at 82% 25%, rgba(44,199,165,0.14), transparent 55%)," +
          "linear-gradient(180deg, #071E2F 0%, #061827 100%)",
      }}
    >
      <AppHeader showLogout pageTitle={`ADMIN • ${title}`} />

      <Container maxWidth="lg" sx={{ pt: "84px", pb: 4 }}>
        {/* Page intro */}
        <Paper
          elevation={0}
          sx={{
            p: 2.2,
            borderRadius: 3,
            background: "rgba(255,255,255,0.10)",
            border: "1px solid rgba(255,255,255,0.14)",
            color: "white",
          }}
        >
          <Typography sx={{ fontWeight: 900, fontSize: 18 }}>
            {title} {loading ? "(Loading...)" : `(${users.length})`}
          </Typography>
          <Typography sx={{ opacity: 0.75, mt: 0.5 }}>
            Change roles and deactivate accounts. Deactivated users cannot login.
          </Typography>
        </Paper>

        {/* User cards */}
        <Stack spacing={1.4} sx={{ mt: 2 }}>
          {users.map((u) => (
            <Paper
              key={u.id}
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                background: "rgba(255,255,255,0.94)",
                border: "1px solid rgba(255,255,255,0.55)",
              }}
            >
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                alignItems={{ xs: "flex-start", md: "center" }}
                justifyContent="space-between"
              >
                {/* Left: identity + current state */}
                <Stack spacing={0.4}>
                  <Typography sx={{ fontWeight: 900 }}>{u.username}</Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip label={u.role} size="small" />
                    <Chip
                      label={u.active ? "ACTIVE" : "INACTIVE"}
                      size="small"
                      color={u.active ? "success" : "default"}
                      variant="outlined"
                    />
                  </Stack>
                </Stack>

                {/* Right: admin controls (role select + active toggle) */}
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1.5}
                  alignItems="center"
                >
                  <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={u.role}
                      label="Role"
                      onChange={(e) =>
                        changeRole(u.id, e.target.value as Role)
                      }
                    >
                      <MenuItem value="CUSTOMER">CUSTOMER</MenuItem>
                      <MenuItem value="ANALYST">ANALYST</MenuItem>
                      <MenuItem value="ADMIN">ADMIN</MenuItem>
                    </Select>
                  </FormControl>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography sx={{ fontWeight: 800 }}>Active</Typography>
                    <Switch
                      checked={u.active}
                      onChange={(e) => toggleActive(u.id, e.target.checked)}
                    />
                  </Stack>
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
