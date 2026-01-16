import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Stack,
  Button,
  LinearProgress,
  Chip,
  Skeleton,
  Divider,
} from "@mui/material";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import RequestQuoteRoundedIcon from "@mui/icons-material/RequestQuoteRounded";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader";
import { getAdminMetrics, AdminMetrics } from "../api/admin";

/**
 * Metric card used in the admin dashboard to display a single KPI.
 * Clicking the card navigates to the relevant detail page.
 */
type MetricCardProps = {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
  accent: string; // gradient
  onClick: () => void;
  progress?: number; // 0-100
  extraRight?: React.ReactNode;
  loading?: boolean;
};

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  accent,
  onClick,
  progress,
  extraRight,
  loading,
}: MetricCardProps) {
  return (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{
        width: { xs: "100%", sm: 360 },
        borderRadius: 4,
        overflow: "hidden",
        cursor: "pointer",
        border: "1px solid rgba(255,255,255,0.14)",
        background: "rgba(255,255,255,0.10)",
        backdropFilter: "blur(18px)",
        color: "white",
        boxShadow: "0 14px 40px rgba(0,0,0,0.30)",
        transition: "all 0.25s ease",
        position: "relative",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 22px 55px rgba(0,0,0,0.42)",
        },
        "&:active": {
          transform: "translateY(-3px)",
        },
      }}
    >
      {/* Accent strip to visually differentiate cards */}
      <Box sx={{ height: 10, background: accent }} />

      <Box sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1.3} alignItems="center">
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 3,
                display: "grid",
                placeItems: "center",
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              {icon}
            </Box>

            <Box>
              <Typography
                sx={{
                  fontWeight: 800,
                  letterSpacing: 0.6,
                  opacity: 0.9,
                  textTransform: "uppercase",
                  fontSize: 12,
                }}
              >
                {title}
              </Typography>
              <Typography sx={{ opacity: 0.75, fontSize: 13, mt: 0.2 }}>
                {subtitle}
              </Typography>
            </Box>
          </Stack>

          {extraRight}
        </Stack>

        <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.12)" }} />

        <Stack direction="row" alignItems="baseline" justifyContent="space-between">
          <Box>
            {/* Skeleton keeps layout stable while metrics are loading */}
            {loading ? (
              <Skeleton
                variant="text"
                width={120}
                height={54}
                sx={{ bgcolor: "rgba(255,255,255,0.12)" }}
              />
            ) : (
              <Typography sx={{ fontWeight: 900, fontSize: 44, lineHeight: 1.05 }}>
                {value}
              </Typography>
            )}
            <Typography sx={{ opacity: 0.7, fontSize: 13, mt: 0.7 }}>
              Click to open details
            </Typography>
          </Box>

          <Chip
            size="small"
            label="LIVE"
            sx={{
              color: "white",
              bgcolor: "rgba(44,199,165,0.18)",
              border: "1px solid rgba(44,199,165,0.35)",
              fontWeight: 800,
              letterSpacing: 0.4,
            }}
          />
        </Stack>

        {/* Optional progress bar used to show % share for users */}
        {typeof progress === "number" && (
          <Box sx={{ mt: 2 }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.8 }}>
              <Typography sx={{ opacity: 0.75, fontSize: 12 }}>
                Share of users
              </Typography>
              <Typography sx={{ opacity: 0.85, fontSize: 12, fontWeight: 800 }}>
                {Math.round(progress)}%
              </Typography>
            </Stack>

            <LinearProgress
              variant="determinate"
              value={Math.max(0, Math.min(100, progress))}
              sx={{
                height: 8,
                borderRadius: 10,
                bgcolor: "rgba(255,255,255,0.10)",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 10,
                  background: accent,
                },
              }}
            />
          </Box>
        )}
      </Box>
    </Paper>
  );
}

/**
 * Admin dashboard page.
 * Loads aggregated admin metrics and provides navigation to admin sections.
 */
export default function AdminDashboard() {
  const nav = useNavigate();
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  // Fetch metrics once on initial load
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const m = await getAdminMetrics();
        setMetrics(m);
        setUpdatedAt(new Date());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Derive totals from API result (memoized to avoid unnecessary recompute)
  const totalUsers = useMemo(() => {
    const c = metrics?.customers ?? 0;
    const a = metrics?.analysts ?? 0;
    const ad = metrics?.admins ?? 0;
    return c + a + ad;
  }, [metrics]);

  // Converts a role count to percentage share
  const pct = (value: number) => (totalUsers ? (value / totalUsers) * 100 : 0);

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        background:
          "radial-gradient(900px 600px at 18% 15%, rgba(29,155,240,0.18), transparent 55%)," +
          "radial-gradient(900px 700px at 82% 25%, rgba(44,199,165,0.16), transparent 55%)," +
          "linear-gradient(180deg, #071E2F 0%, #061827 100%)",
      }}
    >
      <AppHeader showLogout pageTitle="ADMIN DASHBOARD" />

      <Container maxWidth="lg" sx={{ pt: "96px", pb: 6 }}>
        {/* Overview banner */}
        <Paper
          elevation={0}
          sx={{
            mb: 3,
            p: 2.6,
            borderRadius: 4,
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(16px)",
            color: "white",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1.5}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
          >
            <Box>
              <Typography sx={{ fontWeight: 900, fontSize: 24 }}>
                Overview
              </Typography>
              <Typography sx={{ opacity: 0.75, mt: 0.4 }}>
                Quick snapshot of users & loans. Drill into details from any card.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              <Chip
                icon={<AdminPanelSettingsRoundedIcon sx={{ color: "white !important" }} />}
                label={totalUsers ? `${totalUsers} total users` : "No users yet"}
                sx={{
                  color: "white",
                  bgcolor: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.16)",
                  fontWeight: 800,
                }}
              />
              <Chip
                label={
                  updatedAt
                    ? `Updated ${updatedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                    : "Loading…"
                }
                sx={{
                  color: "white",
                  bgcolor: "rgba(29,155,240,0.12)",
                  border: "1px solid rgba(29,155,240,0.25)",
                  fontWeight: 800,
                }}
              />
            </Stack>
          </Stack>
        </Paper>

        {/* KPI cards */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          justifyContent="center"
          alignItems="stretch"
          sx={{ mb: 4 }}
        >
          <MetricCard
            title="Customers"
            value={metrics?.customers ?? 0}
            subtitle="Registered borrowers"
            icon={<PeopleAltRoundedIcon />}
            accent="linear-gradient(90deg, rgba(29,155,240,1), rgba(29,155,240,0.35))"
            onClick={() => nav("/admin/users?role=CUSTOMER")}
            progress={pct(metrics?.customers ?? 0)}
            loading={loading}
            extraRight={
              <Chip
                size="small"
                label={totalUsers ? `${metrics?.customers ?? 0}/${totalUsers}` : "0/0"}
                sx={{
                  color: "white",
                  bgcolor: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  fontWeight: 800,
                }}
              />
            }
          />

          <MetricCard
            title="Analysts"
            value={metrics?.analysts ?? 0}
            subtitle="Review & approve loans"
            icon={<ManageAccountsRoundedIcon />}
            accent="linear-gradient(90deg, rgba(44,199,165,1), rgba(44,199,165,0.35))"
            onClick={() => nav("/admin/users?role=ANALYST")}
            progress={pct(metrics?.analysts ?? 0)}
            loading={loading}
            extraRight={
              <Chip
                size="small"
                label={totalUsers ? `${metrics?.analysts ?? 0}/${totalUsers}` : "0/0"}
                sx={{
                  color: "white",
                  bgcolor: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  fontWeight: 800,
                }}
              />
            }
          />

          <MetricCard
            title="Loans"
            value={metrics?.loans ?? 0}
            subtitle="Applications in the system"
            icon={<RequestQuoteRoundedIcon />}
            accent="linear-gradient(90deg, rgba(255,193,7,1), rgba(255,193,7,0.35))"
            onClick={() => nav("/admin/loans")}
            loading={loading}
            extraRight={
              <Chip
                size="small"
                label="All statuses"
                sx={{
                  color: "white",
                  bgcolor: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  fontWeight: 800,
                }}
              />
            }
          />
        </Stack>

        {/* Primary actions */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
        >
          <Button
            variant="contained"
            onClick={() => nav("/admin/users")}
            sx={{ px: 3.2, py: 1.2, borderRadius: 3, fontWeight: 900 }}
          >
            Manage All Users
          </Button>

          <Button
            variant="outlined"
            onClick={() => nav("/admin/loans")}
            sx={{
              px: 3.2,
              py: 1.2,
              borderRadius: 3,
              fontWeight: 900,
              borderColor: "rgba(255,255,255,0.35)",
              color: "white",
              "&:hover": {
                borderColor: "rgba(255,255,255,0.55)",
                background: "rgba(255,255,255,0.06)",
              },
            }}
          >
            View All Loans
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
