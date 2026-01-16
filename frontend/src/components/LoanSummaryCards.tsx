import React from "react";
import type { Loan, LoanStatus } from "../services/loanApi";

/**
 * Utility helper to count loans by a specific status.
 */
function countByStatus(loans: Loan[], status: LoanStatus) {
  return loans.filter((l) => l.status === status).length;
}

/**
 * Displays a summary view of loan statistics using simple cards.
 *
 * Shows:
 *  - Total loans
 *  - Pending (Submitted)
 *  - Approved
 *  - Rejected
 */
export default function LoanSummaryCards({ loans }: { loans: Loan[] }) {
  const total = loans.length;
  const submitted = countByStatus(loans, "SUBMITTED");
  const approved = countByStatus(loans, "APPROVED");
  const rejected = countByStatus(loans, "REJECTED");

  /**
   * Reusable card component for displaying a single metric.
   */
  const Card = ({ title, value }: { title: string; value: number }) => (
    <div style={styles.card}>
      <div style={styles.cardTitle}>{title}</div>
      <div style={styles.cardValue}>{value}</div>
    </div>
  );

  return (
    <div style={styles.grid}>
      <Card title="Total Loans" value={total} />
      <Card title="Pending" value={submitted} />
      <Card title="Approved" value={approved} />
      <Card title="Rejected" value={rejected} />
    </div>
  );
}

/**
 * Inline styles used for lightweight layout and visual consistency.
 */
const styles: Record<string, React.CSSProperties> = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 16,
    marginTop: 16,
  },
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 16,
    background: "#fff",
  },
  cardTitle: { fontSize: 14, color: "#6b7280" },
  cardValue: { fontSize: 28, fontWeight: 700, marginTop: 8 },
};
