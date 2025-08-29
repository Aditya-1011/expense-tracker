// client/src/pages/dashboard/Summary.tsx
import React, { useMemo } from "react";
import { useFinancialRecords } from "../../context/financial-record-context";

/**
 * Summary card showing totals:
 * - This Month: sum of records whose date is in the current month
 * - Expenses Today: sum of records whose date equals today's date (yyyy-mm-dd)
 *
 * IMPORTANT: this assumes records have a `date` string in "YYYY-MM-DD" format
 * and an `amt` field that is a number (or numeric string).
 */
const Summary: React.FC = () => {
  const { records } = useFinancialRecords();

  // current date info
  const now = new Date();
  const todayYMD = now.toISOString().slice(0, 10); // "YYYY-MM-DD"
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const { monthTotal, todayTotal } = useMemo(() => {
    let monthTotal = 0;
    let todayTotal = 0;

    if (!Array.isArray(records)) {
      return { monthTotal: 0, todayTotal: 0 };
    }

    for (const rec of records) {
      const amt = Number(rec.amt ?? 0) || 0;
      const dateStr = rec.date ?? "";

      // quick YYYY-MM-DD check and parse
      if (typeof dateStr === "string" && dateStr.length >= 10) {
        // safe string compare for today
        if (dateStr.slice(0, 10) === todayYMD) {
          todayTotal += amt;
        }

        // check month/year by creating Date
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
          if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
            monthTotal += amt;
          }
        }
      } else {
        // fallback: try to parse whatever value is there
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
          if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
            monthTotal += amt;
          }
          const iso = d.toISOString().slice(0, 10);
          if (iso === todayYMD) todayTotal += amt;
        }
      }
    }

    return { monthTotal, todayTotal };
  }, [records, todayYMD, currentMonth, currentYear]);

  const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);

  return (
    <section className="summary-grid" aria-label="summary totals">
      <div className="summary-card month">
  <div className="summary-title">
    <span className="summary-emoji" role="img" aria-hidden>
      📅
    </span>
    <span>This Month</span>
  </div>
  <div className="summary-value">{formatINR(monthTotal)}</div>
</div>

{/* Expenses Today */}
<div className="summary-card today">
  <div className="summary-title">
    <span className="summary-emoji" role="img" aria-hidden>
      💸
    </span>
    <span>Expenses Today</span>
  </div>
  <div className="summary-value">{formatINR(todayTotal)}</div>
</div>
    </section>
  );
};

export default Summary;
