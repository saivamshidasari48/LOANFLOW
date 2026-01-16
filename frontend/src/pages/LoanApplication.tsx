// src/pages/LoanApplication.tsx
import React, { useMemo, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Chip,
  LinearProgress,
} from "@mui/material";
import AppHeader from "../components/AppHeader";
import client from "../api/client";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

// Frontend enums aligned with backend values (employmentType/purpose are stored as strings)
type EmploymentType = "SALARIED" | "SELF_EMPLOYED" | "STUDENT" | "UNEMPLOYED";
type Purpose = "HOME" | "AUTO" | "PERSONAL" | "EDUCATION" | "MEDICAL";

/**
 * Small visual badge for the pre-decision shown in the "Instant Analysis" panel.
 * (This is client-side only; backend does final evaluation too.)
 */
function DecisionChip({ decision }: { decision: "ELIGIBLE" | "REVIEW" | "REJECT" }) {
  const styles =
    decision === "ELIGIBLE"
      ? {
          label: "Eligible",
          sx: {
            background: "rgba(67,209,122,0.16)",
            borderColor: "rgba(67,209,122,0.45)",
            color: "#0b3a5a",
          },
        }
      : decision === "REVIEW"
      ? {
          label: "Needs review",
          sx: {
            background: "rgba(29,155,240,0.14)",
            borderColor: "rgba(29,155,240,0.40)",
            color: "#0b3a5a",
          },
        }
      : {
          label: "High risk",
          sx: {
            background: "rgba(255,90,90,0.14)",
            borderColor: "rgba(255,90,90,0.35)",
            color: "#0b3a5a",
          },
        };

  return (
    <Chip
      label={styles.label}
      variant="outlined"
      sx={{
        fontWeight: 800,
        borderWidth: 1,
        ...styles.sx,
      }}
    />
  );
}

/**
 * Customer loan application form.
 *
 * UX flow:
 *  - User fills in details
 *  - Instant analysis panel shows risk/DTI once required fields are complete
 *  - Submit posts to backend: POST /api/loans/apply
 *  - Success modal confirms submission and redirects back to dashboard
 */
export default function LoanApplication() {
  // Start empty to avoid any "hardcoded values" in the UI
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();

  // Modal shown after successful submission
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Keep numeric fields as strings to allow empty input + controlled TextFields
  const [amount, setAmount] = useState<string>("");
  const [tenure, setTenure] = useState<string>("");

  const [monthlyIncome, setMonthlyIncome] = useState<string>("");
  const [monthlyDebt, setMonthlyDebt] = useState<string>("");
  const [creditScore, setCreditScore] = useState<string>("");

  const [employmentType, setEmploymentType] = useState<EmploymentType>("SALARIED");
  const [purpose, setPurpose] = useState<Purpose>("PERSONAL");

  // UI feedback messages
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Prevent double-submit
  const [submitting, setSubmitting] = useState(false);

  /**
   * Only compute analysis when all required fields are filled.
   * This avoids showing misleading results from partial data.
   */
  const canAnalyze = useMemo(() => {
    return (
      fullName.trim() !== "" &&
      amount.trim() !== "" &&
      tenure.trim() !== "" &&
      monthlyIncome.trim() !== "" &&
      monthlyDebt.trim() !== "" &&
      creditScore.trim() !== ""
    );
  }, [fullName, amount, tenure, monthlyIncome, monthlyDebt, creditScore]);

  /**
   * Client-side “instant analysis” preview.
   * Backend still performs the authoritative evaluation when the application is saved.
   */
  const analysis = useMemo(() => {
    if (!canAnalyze) return null;

    const amt = Number(amount);
    const ten = Number(tenure);
    const income = Number(monthlyIncome);
    const debt = Number(monthlyDebt);
    const cs = Number(creditScore);

    // Basic validation guards
    if ([amt, ten, income, debt, cs].some((n) => Number.isNaN(n))) return null;
    if (amt <= 0 || ten <= 0 || income <= 0) return null;
    if (cs < 300 || cs > 850) return null;

    const dti = income > 0 ? debt / income : 1;
    let risk = 0;

    // Credit score component
    if (cs >= 780) risk += 10;
    else if (cs >= 740) risk += 20;
    else if (cs >= 700) risk += 35;
    else if (cs >= 650) risk += 50;
    else risk += 70;

    // DTI component
    if (dti <= 0.2) risk += 5;
    else if (dti <= 0.35) risk += 20;
    else if (dti <= 0.5) risk += 40;
    else risk += 60;

    // Employment stability component
    if (employmentType === "SALARIED") risk += 5;
    else if (employmentType === "SELF_EMPLOYED") risk += 15;
    else if (employmentType === "STUDENT") risk += 25;
    else risk += 35;

    // Amount affordability vs annual income
    const amountToAnnualIncome = amt / (income * 12);
    if (amountToAnnualIncome <= 1.5) risk += 5;
    else if (amountToAnnualIncome <= 3) risk += 15;
    else risk += 25;

    risk = Math.max(0, Math.min(100, risk));

    // Simple decision buckets to guide the user (not final approval)
    let decision: "ELIGIBLE" | "REVIEW" | "REJECT" = "ELIGIBLE";
    if (cs < 600 || dti > 0.6 || risk >= 80) decision = "REJECT";
    else if (cs < 680 || dti > 0.45 || risk >= 55) decision = "REVIEW";

    // Recommended APR preview (based on risk score)
    const rate = Math.round((7.5 + risk * 0.08) * 10) / 10;

    return { dti, risk, decision, rate };
  }, [canAnalyze, amount, tenure, monthlyIncome, monthlyDebt, creditScore, employmentType]);

  /**
   * Small completion indicator for form UX (helps reduce abandonment).
   */
  const completion = useMemo(() => {
    let score = 0;
    if (fullName.trim()) score += 25;
    if (amount.trim()) score += 15;
    if (tenure.trim()) score += 15;
    if (monthlyIncome.trim()) score += 15;
    if (monthlyDebt.trim()) score += 10;
    if (creditScore.trim()) score += 10;
    if (employmentType) score += 7;
    if (purpose) score += 8;
    return Math.min(100, score);
  }, [fullName, amount, tenure, monthlyIncome, monthlyDebt, creditScore, employmentType, purpose]);

  /**
   * Submits to backend (authoritative persistence + eligibility evaluation happens server-side).
   */
  const submit = async () => {
    setSuccess("");
    setError("");

    const amt = Number(amount);
    const ten = Number(tenure);
    const income = Number(monthlyIncome);
    const debt = Number(monthlyDebt);
    const cs = Number(creditScore);

    // Client-side validation to provide fast feedback
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if ([amt, ten, income, debt, cs].some((n) => Number.isNaN(n))) {
      setError("Please fill all numeric fields correctly.");
      return;
    }
    if (amt <= 0 || ten <= 0) {
      setError("Loan amount and tenure must be greater than 0.");
      return;
    }
    if (income <= 0) {
      setError("Monthly income must be greater than 0.");
      return;
    }
    if (cs < 300 || cs > 850) {
      setError("Credit score must be between 300 and 850.");
      return;
    }

    setSubmitting(true);
    try {
      // Backend endpoint: POST /api/loans/apply
      await client.post("/api/loans/apply", {
        fullName,
        amount: amt,
        tenure: ten,
        monthlyIncome: income,
        monthlyDebt: debt,
        creditScore: cs,
        employmentType,
        purpose,
      });

      // Show confirmation modal on success
      setShowSuccessModal(true);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to submit loan");
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Closes success modal and returns user back to dashboard.
   */
  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    navigate("/dashboard");
  };

  /**
   * Resets the form back to defaults.
   */
  const reset = () => {
    setFullName("");
    setAmount("");
    setTenure("");
    setMonthlyIncome("");
    setMonthlyDebt("");
    setCreditScore("");
    setEmploymentType("SALARIED");
    setPurpose("PERSONAL");
    setError("");
    setSuccess("");
  };

  return (
    <Box
      sx={{
        height: "100dvh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background:
          "radial-gradient(900px 600px at 18% 15%, rgba(29,155,240,0.16), transparent 55%)," +
          "radial-gradient(900px 700px at 82% 25%, rgba(44,199,165,0.14), transparent 55%)," +
          "linear-gradient(180deg, #071E2F 0%, #061827 100%)",
      }}
    >
      <AppHeader showLogout pageTitle="LOAN APPLICATION" />

      {/* Scrollable content container (body stays fixed) */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          pt: "72px",
          px: 2,
          pb: 3,
          WebkitOverflowScrolling: "touch",
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <Container maxWidth="lg">
          {/* Top status banner */}
          <Paper
            elevation={0}
            sx={{
              mb: 2,
              p: 2,
              borderRadius: 3,
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.14)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              color: "white",
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems={{ xs: "flex-start", md: "center" }}
              justifyContent="space-between"
            >
              <Box>
                <Typography sx={{ fontWeight: 900, fontSize: 20 }}>
                  Apply in minutes
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.75)", mt: 0.2 }}>
                  Fill the form below. Instant analysis appears once all fields are filled.
                </Typography>
              </Box>

              {/* Progress indicator based on filled inputs */}
              <Box sx={{ width: { xs: "100%", md: 360 } }}>
                <Typography sx={{ color: "rgba(255,255,255,0.75)", mb: 0.6, fontWeight: 700 }}>
                  Completion: {completion}%
                </Typography>
                <LinearProgress variant="determinate" value={completion} />
              </Box>
            </Stack>
          </Paper>

          <Stack direction={{ xs: "column", lg: "row" }} spacing={2.2} alignItems="stretch">
            {/* Left: Form section */}
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                p: { xs: 2.4, sm: 3 },
                borderRadius: 3.2,
                background: "rgba(255,255,255,0.94)",
                border: "1px solid rgba(255,255,255,0.55)",
                boxShadow: "0 30px 90px rgba(0,0,0,0.35)",
                position: "relative",
                overflow: "hidden",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                  height: 6,
                  background: "linear-gradient(90deg, #1D9BF0 0%, #2CC7A5 55%, #43D17A 100%)",
                  opacity: 0.9,
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2.5,
                  backgroundColor: "rgba(240,245,255,0.75)",
                },
              }}
            >
              <Stack spacing={2}>
                {/* Server/client feedback */}
                {success && <Alert severity="success">{success}</Alert>}
                {error && <Alert severity="error">{error}</Alert>}

                <Box>
                  <Typography sx={{ fontWeight: 900, fontSize: 18 }}>
                    Applicant details
                  </Typography>
                  <Typography sx={{ color: "text.secondary", mt: 0.3 }}>
                    Enter your personal and financial info to calculate eligibility.
                  </Typography>
                </Box>

                <TextField
                  label="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  fullWidth
                />

                <Divider />

                <Typography sx={{ fontWeight: 900, fontSize: 18 }}>Loan details</Typography>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    label="Loan Amount ($)"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Tenure (Months)"
                    type="number"
                    value={tenure}
                    onChange={(e) => setTenure(e.target.value)}
                    fullWidth
                  />
                </Stack>

                <Divider />

                <Typography sx={{ fontWeight: 900, fontSize: 18 }}>Financial details</Typography>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    label="Monthly Income ($)"
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Monthly Debt Payments ($)"
                    type="number"
                    value={monthlyDebt}
                    onChange={(e) => setMonthlyDebt(e.target.value)}
                    fullWidth
                  />
                </Stack>

                <TextField
                  label="Credit Score (300 - 850)"
                  type="number"
                  value={creditScore}
                  onChange={(e) => setCreditScore(e.target.value)}
                  fullWidth
                />

                {/* Categorical inputs */}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel>Employment Type</InputLabel>
                    <Select
                      value={employmentType}
                      label="Employment Type"
                      onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
                    >
                      <MenuItem value="SALARIED">Salaried</MenuItem>
                      <MenuItem value="SELF_EMPLOYED">Self-Employed</MenuItem>
                      <MenuItem value="STUDENT">Student</MenuItem>
                      <MenuItem value="UNEMPLOYED">Unemployed</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Purpose</InputLabel>
                    <Select
                      value={purpose}
                      label="Purpose"
                      onChange={(e) => setPurpose(e.target.value as Purpose)}
                    >
                      <MenuItem value="HOME">Home</MenuItem>
                      <MenuItem value="AUTO">Auto</MenuItem>
                      <MenuItem value="PERSONAL">Personal</MenuItem>
                      <MenuItem value="EDUCATION">Education</MenuItem>
                      <MenuItem value="MEDICAL">Medical</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>

                {/* Submit / Reset actions */}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ pt: 0.5 }}>
                  <Button
                    variant="contained"
                    onClick={submit}
                    disabled={submitting}
                    sx={{
                      flex: 1,
                      textTransform: "none",
                      fontWeight: 900,
                      borderRadius: 2.5,
                      py: 1.2,
                      background: "linear-gradient(90deg, #1D9BF0 0%, #2CC7A5 55%, #43D17A 100%)",
                      boxShadow: "0 14px 30px rgba(44,199,165,0.28)",
                      "&:hover": {
                        background:
                          "linear-gradient(90deg, #168bd8 0%, #25b596 55%, #38be6d 100%)",
                      },
                    }}
                  >
                    {submitting ? "Submitting..." : "Submit Application"}
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={reset}
                    sx={{
                      textTransform: "none",
                      fontWeight: 900,
                      borderRadius: 2.5,
                      py: 1.2,
                    }}
                  >
                    Reset
                  </Button>
                </Stack>
              </Stack>
            </Paper>

            {/* Right: Instant analysis panel (client-side preview) */}
            <Paper
              elevation={0}
              sx={{
                width: { xs: "100%", lg: 420 },
                p: { xs: 2.4, sm: 3 },
                borderRadius: 3.2,
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.14)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                color: "white",
                boxShadow: "0 30px 90px rgba(0,0,0,0.35)",
                alignSelf: "flex-start",
              }}
            >
              <Typography sx={{ fontWeight: 900, fontSize: 18 }}>Instant Analysis</Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.72)", mt: 0.5 }}>
                Live eligibility indicators to help you understand your application.
              </Typography>

              <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.18)" }} />

              {!analysis ? (
                // Placeholder content until all required inputs are present
                <Stack spacing={1.2}>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.74)" }}>
                    Enter your details on the left to see:
                  </Typography>

                  <Box component="ul" sx={{ pl: 2, m: 0, color: "rgba(255,255,255,0.74)" }}>
                    <li>DTI (Debt-to-Income)</li>
                    <li>Risk score</li>
                    <li>Pre-decision</li>
                    <li>Recommended APR</li>
                  </Box>

                  <Divider sx={{ my: 1.2, borderColor: "rgba(255,255,255,0.18)" }} />

                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.74)" }}>
                    Instant analysis will appear once all required fields are filled.
                  </Typography>
                </Stack>
              ) : (
                // Live computed indicators based on current inputs
                <Stack spacing={1.2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ color: "rgba(255,255,255,0.80)" }}>DTI</Typography>
                    <Typography sx={{ fontWeight: 900 }}>
                      {(analysis.dti * 100).toFixed(1)}%
                    </Typography>
                  </Stack>

                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ color: "rgba(255,255,255,0.80)" }}>Risk Score</Typography>
                    <Typography sx={{ fontWeight: 900 }}>{analysis.risk}/100</Typography>
                  </Stack>

                  <Box>
                    <Typography sx={{ color: "rgba(255,255,255,0.80)", mb: 0.7 }}>
                      Risk level
                    </Typography>
                    <LinearProgress variant="determinate" value={analysis.risk} />
                  </Box>

                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ color: "rgba(255,255,255,0.80)" }}>Pre-decision</Typography>
                    <DecisionChip decision={analysis.decision} />
                  </Stack>

                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ color: "rgba(255,255,255,0.80)" }}>Recommended APR</Typography>
                    <Typography sx={{ fontWeight: 900 }}>{analysis.rate}%</Typography>
                  </Stack>

                  <Divider sx={{ my: 1.2, borderColor: "rgba(255,255,255,0.18)" }} />

                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.74)" }}>
                    This is a pre-analysis only. Final approval is reviewed by an analyst based on
                    documents and policy checks.
                  </Typography>
                </Stack>
              )}
            </Paper>
          </Stack>
        </Container>
      </Box>

      {/* Success modal shown after POST completes */}
      <Dialog open={showSuccessModal} onClose={closeSuccessModal}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          Application Submitted 🎉
          <IconButton onClick={closeSuccessModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Typography sx={{ mt: 1 }}>
            Your loan application has been submitted successfully.
            Our analysts will review it shortly.
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
