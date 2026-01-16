import client from "../api/client";

/**
 * Loan status values must match backend enum exactly.
 */
export type LoanStatus = "SUBMITTED" | "APPROVED" | "REJECTED";

/**
 * Loan model returned from backend APIs.
 */
export interface Loan {
  id: number;
  amount: number;
  tenure: number;
  interestRate: number;
  status: LoanStatus;
  createdAt: string; // ISO timestamp string
}

/**
 * Generic Spring Boot pagination response structure.
 */
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // current page index
  size: number;   // page size
}

/**
 * Optional mock data used as fallback when API fails
 * (helps local UI testing and demo resilience).
 */
const mockLoans: Loan[] = [
  {
    id: 101,
    amount: 12000,
    tenure: 24,
    interestRate: 10.5,
    status: "SUBMITTED",
    createdAt: new Date().toISOString(),
  },
  {
    id: 99,
    amount: 8000,
    tenure: 12,
    interestRate: 9.8,
    status: "APPROVED",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

/**
 * Submits a new loan application.
 */
export async function applyLoan(amount: number, tenure: number): Promise<Loan> {
  const res = await client.post<Loan>("/api/loans/apply", { amount, tenure });
  return res.data;
}

/**
 * Fetches paginated loans with optional sorting and filtering.
 */
export async function fetchLoansPage(params: {
  page: number;
  size: number;
  sortBy?: string;
  direction?: "asc" | "desc";
  status?: LoanStatus;
}): Promise<PageResponse<Loan>> {
  const res = await client.get<PageResponse<Loan>>("/api/loans", { params });
  return res.data;
}

/**
 * Fetches all customer loans sorted by newest first.
 * Falls back to mock data if API request fails.
 */
export async function fetchCustomerLoans(): Promise<Loan[]> {
  try {
    const page = await fetchLoansPage({
      page: 0,
      size: 200,
      sortBy: "createdAt",
      direction: "desc",
    });
    return page.content;
  } catch {
    return mockLoans;
  }
}
