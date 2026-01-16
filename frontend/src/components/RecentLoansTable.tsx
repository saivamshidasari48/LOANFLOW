import React from "react";
import type { Loan } from "../services/loanApi";

/**
 * Safely formats ISO date strings for display.
 * Falls back to raw value if parsing fails.
 */
function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

/**
 * Displays a table of the most recent loan records.
 *
 * Shows up to the latest 5 loans with key details such as
 * amount, tenure, interest, status, and creation date.
 */
export default function RecentLoansTable({ loans }: { loans: Loan[] }) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.headerRow}>
        <h3 style={{ margin: 0 }}>Recent Loans</h3>
        <span style={{ color: "#6b7280", fontSize: 13 }}>
          Showing latest {Math.min(loans.length, 5)}
        </span>
      </div>

      {/* Horizontal scroll support for small screens */}
      <div style={{ overflowX: "auto" }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Loan ID</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Tenure (months)</th>
              <th style={styles.th}>Interest</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Created</th>
            </tr>
          </thead>
          <tbody>
            {loans.slice(0, 5).map((l) => (
              <tr key={l.id}>
                <td style={styles.td}>{l.id}</td>
                <td style={styles.td}>${l.amount.toLocaleString()}</td>
                <td style={styles.td}>{l.tenure}</td>
                <td style={styles.td}>{l.interestRate}%</td>
                <td style={styles.td}>
                  <span style={badgeStyle(l.status)}>{l.status}</span>
                </td>
                <td style={styles.td}>{formatDate(l.createdAt)}</td>
              </tr>
            ))}

            {/* Empty state */}
            {loans.length === 0 && (
              <tr>
                <td style={styles.td} colSpan={6}>
                  No loans yet. Click “Apply for Loan” to submit your first loan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Returns badge styling based on loan status.
 */
function badgeStyle(status: Loan["status"]): React.CSSProperties {
  const base: React.CSSProperties = {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    border: "1px solid #e5e7eb",
  };

  if (status === "APPROVED") return { ...base, background: "#ecfdf5" };
  if (status === "REJECTED") return { ...base, background: "#fef2f2" };
  return { ...base, background: "#eff6ff" }; // SUBMITTED
}

/**
 * Inline styling for layout and table presentation.
 */
const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    marginTop: 16,
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 16,
    background: "#fff",
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    textAlign: "left",
    fontSize: 12,
    color: "#6b7280",
    padding: "10px 8px",
    borderBottom: "1px solid #e5e7eb",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "10px 8px",
    borderBottom: "1px solid #f3f4f6",
    whiteSpace: "nowrap",
  },
};
