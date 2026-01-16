// src/api/loans.ts
import client from "./client";

/**
 * Must match backend enum exactly:
 * public enum LoanStatus {
 *   SUBMITTED,
 *   APPROVED,
 *   REJECTED
 * }
 */
export type LoanStatus = "SUBMITTED" | "APPROVED" | "REJECTED";

/**
 * UI-friendly labels for loan status values.
 */
export const LOAN_STATUS_LABEL: Record<LoanStatus, string> = {
  SUBMITTED: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

/**
 * Loan application model returned from the backend API.
 * Optional fields allow flexibility as backend evolves.
 */
export type LoanApplication = {
  id: number;
  fullName?: string;
  amount?: number;
  tenure?: number;
  interestRate?: number;
  riskScore?: number;
  eligibilityDecision?: string;
  status?: LoanStatus;
  createdAt?: string;

  // Optional fields if backend expands response in future
  username?: string;
  applicantUsername?: string;
};

/**
 * Retrieves paginated loan records from the backend.
 * Supports pagination, sorting, and optional status filtering.
 */
export async function listLoans(params?: {
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: "asc" | "desc";
  status?: LoanStatus;
}) {
  const res = await client.get("/api/loans", { params });
  return res.data; // Spring Page<LoanApplication>
}

/**
 * Approves a loan by ID.
 */
export async function approveLoan(id: number) {
  const res = await client.patch(`/api/loans/${id}/approve`);
  return res.data;
}

/**
 * Rejects a loan by ID.
 */
export async function rejectLoan(id: number) {
  const res = await client.patch(`/api/loans/${id}/reject`);
  return res.data;
}
