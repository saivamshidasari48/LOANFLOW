import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import AppHeader from "../components/AppHeader";
import {
  listLoans,
  approveLoan,
  rejectLoan,
  LoanApplication,
  LoanStatus,
  LOAN_STATUS_LABEL,
} from "../api/loans";

type StatusFilter = "ALL" | LoanStatus;

/**
 * Status badge for the list rows (maps enum to a friendly label + color).
 */
function StatusChip({ status }: { status?: LoanStatus }) {
  if (!status) return <Chip size="small" label="-" variant="outlined" />;

  const label = LOAN_STATUS_LABEL[status] ?? status;

  const sx =
    status === "APPROVED"
      ? {
          borderColor: "rgba(67,209,122,0.55)",
          background: "rgba(67,209,122,0.14)",
        }
      : status === "REJECTED"
      ? {
          borderColor: "rgba(255,90,90,0.55)",
          background: "rgba(255,90,90,0.12)",
        }
      : {
          borderColor: "rgba(29,155,240,0.55)",
          background: "rgba(29,155,240,0.12)",
        };

  return (
    <Chip
      size="small"
      label={label}
      variant="outlined"
      sx={{ fontWeight: 800, ...sx }}
    />
  );
}

/**
 * Analyst dashboard page (loan review queue).
 *
 * Responsibilities:
 *  - Load recent loans (default filter: SUBMITTED)
 *  - Allow approve/reject actions on SUBMITTED loans only
 *  - Show loading/empty states and user feedback alerts
 */
export default function AnalystDashboard() {
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null); // lock UI while an action is running
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("SUBMITTED");
  const [rows, setRows] = useState<LoanApplication[]>([]);

  /**
   * Fetch loans from backend using current status filter.
   * Backend returns Spring Page: { content: [], totalElements, ... }
   */
  const fetchLoans = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const data = await listLoans({
        page: 0,
        size: 25,
        sortBy: "createdAt",
        direction: "desc",
        status: statusFilter === "ALL" ? undefined : statusFilter,
      });

      setRows(data?.content ?? []);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load loan queue.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh whenever the status filter changes
  useEffect(() => {
    fetchLoans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  // Derived counts for the summary chips
  const submittedCount = useMemo(
    () => rows.filter((r) => r.status === "SUBMITTED").length,
    [rows]
  );
  const approvedCount = useMemo(
    () => rows.filter((r) => r.status === "APPROVED").length,
    [rows]
  );
  const rejectedCount = useMemo(
    () => rows.filter((r) => r.status === "REJECTED").length,
    [rows]
  );

  /**
   * Approve flow: call API → show message → refresh list.
   */
  const onApprove = async (id: number) => {
    setBusyId(id);
    setError("");
    setSuccess("");
    try {
      await approveLoan(id);
      setSuccess(`Loan #${id} approved ✅`);
      await fetchLoans();
    } catch (e: any) {
      setError(e?.response?.data?.message || `Failed to approve Loan #${id}`);
    } finally {
      setBusyId(null);
    }
  };

  /**
   * Reject flow: call API → show message → refresh list.
   */
  const onReject = async (id: number) => {
    setBusyId(id);
    setError("");
    setSuccess("");
    try {
      await rejectLoan(id);
      setSuccess(`Loan #${id} rejected ❌`);
      await fetchLoans();
    } catch (e: any) {
      setError(e?.response?.data?.message || `Failed to reject Loan #${id}`);
    } finally {
      setBusyId(null);
    }
  };

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
      <AppHeader showLogout pageTitle="ANALYST DASHBOARD" />

      {/* Scrollable body area */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          pt: "72px",
          px: 2,
          pb: 3,
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <Container maxWidth="lg">
          {/* Header + quick stats */}
          <Paper
            elevation={0}
            sx={{
              mb: 2,
              p: 2,
              borderRadius: 3,
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.14)",
              backdropFilter: "blur(14px)",
              color: "white",
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems={{ xs: "stretch", md: "center" }}
              justifyContent="space-between"
            >
              <Box>
                <Typography sx={{ fontWeight: 900, fontSize: 20 }}>
                  Loan Review Queue
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.75)", mt: 0.3 }}>
                  Review submitted applications and take action.
                </Typography>
              </Box>

              <Stack
                direction="row"
                spacing={1}
                justifyContent="flex-end"
                flexWrap="wrap"
              >
                <Chip
                  label={`Submitted: ${submittedCount}`}
                  variant="outlined"
                  sx={{ color: "white" }}
                />
                <Chip
                  label={`Approved: ${approvedCount}`}
                  variant="outlined"
                  sx={{ color: "white" }}
                />
                <Chip
                  label={`Rejected: ${rejectedCount}`}
                  variant="outlined"
                  sx={{ color: "white" }}
                />
              </Stack>
            </Stack>
          </Paper>

          {/* API feedback */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {/* Filter + manual refresh */}
          <Paper
            elevation={0}
            sx={{
              mb: 2,
              p: 2,
              borderRadius: 3,
              background: "rgba(255,255,255,0.94)",
              border: "1px solid rgba(255,255,255,0.55)",
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems="center"
            >
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as StatusFilter)
                  }
                >
                  <MenuItem value="ALL">All</MenuItem>
                  <MenuItem value="SUBMITTED">Pending (Submitted)</MenuItem>
                  <MenuItem value="APPROVED">Approved</MenuItem>
                  <MenuItem value="REJECTED">Rejected</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                onClick={fetchLoans}
                sx={{
                  fontWeight: 900,
                  textTransform: "none",
                  whiteSpace: "nowrap",
                }}
              >
                Refresh
              </Button>
            </Stack>
          </Paper>

          {/* List of applications */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              background: "rgba(255,255,255,0.94)",
              border: "1px solid rgba(255,255,255,0.55)",
              overflow: "hidden",
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography sx={{ fontWeight: 900, fontSize: 18 }}>
                Applications
              </Typography>
              <Typography sx={{ color: "text.secondary", mt: 0.4 }}>
                Latest applications appear first.
              </Typography>
            </Box>

            <Divider />

            {loading ? (
              <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            ) : rows.length === 0 ? (
              <Box sx={{ p: 4 }}>
                <Typography sx={{ fontWeight: 800 }}>
                  No applications found.
                </Typography>
                <Typography sx={{ color: "text.secondary", mt: 0.5 }}>
                  Try changing the status filter or click Refresh.
                </Typography>
              </Box>
            ) : (
              <Box>
                {rows.map((r) => (
                  <Box
                    key={r.id}
                    sx={{ p: 2, borderTop: "1px solid rgba(0,0,0,0.06)" }}
                  >
                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      spacing={2}
                      alignItems={{ xs: "stretch", md: "center" }}
                      justifyContent="space-between"
                    >
                      <Box>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          flexWrap="wrap"
                        >
                          <Typography sx={{ fontWeight: 900 }}>
                            Loan #{r.id}
                          </Typography>
                          <StatusChip status={r.status} />
                        </Stack>

                        <Typography sx={{ color: "text.secondary", mt: 0.5 }}>
                          Name: <b>{r.fullName ?? "-"}</b> · Amount:{" "}
                          <b>${r.amount ?? "-"}</b> · Tenure:{" "}
                          <b>{r.tenure ?? "-"} mo</b>
                        </Typography>

                        <Typography sx={{ color: "text.secondary", mt: 0.2 }}>
                          Risk: <b>{r.riskScore ?? "-"}/100</b> · APR:{" "}
                          <b>{r.interestRate ?? "-"}%</b> · Decision:{" "}
                          <b>{r.eligibilityDecision ?? "-"}</b>
                        </Typography>
                      </Box>

                      {/* Approve/Reject enabled only while not busy and status is SUBMITTED */}
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button
                          variant="contained"
                          disabled={busyId !== null || r.status !== "SUBMITTED"}
                          onClick={() => onApprove(r.id)}
                          sx={{ fontWeight: 900, textTransform: "none" }}
                        >
                          {busyId === r.id ? "Working..." : "Approve"}
                        </Button>

                        <Button
                          variant="outlined"
                          disabled={busyId !== null || r.status !== "SUBMITTED"}
                          onClick={() => onReject(r.id)}
                          sx={{ fontWeight: 900, textTransform: "none" }}
                        >
                          {busyId === r.id ? "Working..." : "Reject"}
                        </Button>
                      </Stack>
                    </Stack>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
