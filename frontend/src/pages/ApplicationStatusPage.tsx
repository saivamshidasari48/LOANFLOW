// src/pages/ApplicationStatusPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import AppHeader from "../components/AppHeader";
import client from "../api/client";
import { LoanApplication, LoanStatus, LOAN_STATUS_LABEL } from "../api/loans";

/**
 * Small status badge used inside the table to display a readable label + color.
 */
function StatusChip({ status }: { status?: LoanStatus }) {
  if (!status) return <Chip label="-" size="small" />;

  const label = LOAN_STATUS_LABEL[status];

  const sx =
    status === "APPROVED"
      ? { bgcolor: "rgba(67,209,122,0.18)", borderColor: "rgba(67,209,122,0.4)" }
      : status === "REJECTED"
      ? { bgcolor: "rgba(255,90,90,0.18)", borderColor: "rgba(255,90,90,0.4)" }
      : { bgcolor: "rgba(29,155,240,0.18)", borderColor: "rgba(29,155,240,0.4)" };

  return (
    <Chip
      variant="outlined"
      label={label}
      size="small"
      sx={{ fontWeight: 800, ...sx }}
    />
  );
}

/**
 * Customer-facing page to view loan applications and their current status.
 *
 * Key points:
 *  - Uses the same /api/loans endpoint as admin/analyst
 *  - Supports filtering via status query param (SUBMITTED/APPROVED/REJECTED)
 *  - Backend may return Page<LoanApplication> (res.data.content), so we normalize the response
 */
export default function ApplicationStatusPage() {
  const [status, setStatus] = useState<LoanStatus | "ALL">("ALL");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<LoanApplication[]>([]);
  const [error, setError] = useState<string>("");

  /**
   * Build query string in a stable way whenever the status filter changes.
   * This matches the backend pagination + sorting parameters.
   */
  const query = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", "0");
    params.set("size", "50");
    params.set("sortBy", "createdAt");
    params.set("direction", "desc");

    if (status !== "ALL") params.set("status", status);

    return `/api/loans?${params.toString()}`;
  }, [status]);

  /**
   * Loads applications from backend and handles both possible response shapes:
   *  - Page<LoanApplication>  -> res.data.content
   *  - List<LoanApplication>  -> res.data
   */
  const load = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await client.get(query);

      const data = Array.isArray(res.data) ? res.data : res.data?.content ?? [];
      setRows(data);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load applications");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  // Reload data when query (i.e., filter) changes
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <Box
      sx={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        background:
          "radial-gradient(900px 600px at 18% 15%, rgba(29,155,240,0.16), transparent 55%)," +
          "radial-gradient(900px 700px at 82% 25%, rgba(44,199,165,0.14), transparent 55%)," +
          "linear-gradient(180deg, #071E2F 0%, #061827 100%)",
      }}
    >
      <AppHeader showLogout pageTitle="APPLICATION STATUS" />

      {/* Scrollable content area */}
      <Box sx={{ flex: 1, overflowY: "auto", pt: "72px", px: 2, pb: 3 }}>
        <Container maxWidth="lg">
          {/* Header + status filter */}
          <Paper
            elevation={0}
            sx={{
              p: 2.4,
              borderRadius: 3,
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.14)",
              backdropFilter: "blur(14px)",
              color: "white",
              mb: 2,
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Typography sx={{ fontWeight: 900, fontSize: 20 }}>
                  Your Applications
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.75)" }}>
                  Filter by status using backend values: SUBMITTED / APPROVED /
                  REJECTED.
                </Typography>
              </Box>

              <FormControl sx={{ minWidth: 260 }} size="small">
                <InputLabel sx={{ color: "rgba(255,255,255,0.85)" }}>
                  Status
                </InputLabel>
                <Select
                  value={status}
                  label="Status"
                  onChange={(e) => setStatus(e.target.value as any)}
                  sx={{
                    color: "white",
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255,255,255,0.25)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(255,255,255,0.35)",
                    },
                    ".MuiSvgIcon-root": { color: "rgba(255,255,255,0.85)" },
                  }}
                >
                  <MenuItem value="ALL">All</MenuItem>
                  <MenuItem value="SUBMITTED">
                    {LOAN_STATUS_LABEL.SUBMITTED}
                  </MenuItem>
                  <MenuItem value="APPROVED">
                    {LOAN_STATUS_LABEL.APPROVED}
                  </MenuItem>
                  <MenuItem value="REJECTED">
                    {LOAN_STATUS_LABEL.REJECTED}
                  </MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Paper>

          {/* Error message from API */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Applications table */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              background: "rgba(255,255,255,0.94)",
              border: "1px solid rgba(255,255,255,0.55)",
              boxShadow: "0 30px 90px rgba(0,0,0,0.35)",
              overflow: "hidden",
            }}
          >
            {loading ? (
              <Stack alignItems="center" sx={{ py: 6 }}>
                <CircularProgress />
                <Typography sx={{ mt: 2, color: "text.secondary" }}>
                  Loading...
                </Typography>
              </Stack>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Full Name</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <Typography sx={{ color: "text.secondary" }}>
                          No applications found.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.map((r) => (
                      <TableRow key={r.id} hover>
                        <TableCell>{r.id}</TableCell>
                        <TableCell>{r.fullName ?? "-"}</TableCell>
                        <TableCell>
                          {typeof r.amount === "number" ? `$${r.amount}` : "-"}
                        </TableCell>
                        <TableCell>
                          <StatusChip status={r.status} />
                        </TableCell>
                        <TableCell>
                          {r.createdAt
                            ? new Date(r.createdAt).toLocaleString()
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
