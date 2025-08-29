// client/src/pages/dashboard/MonthlySummary.tsx
import React, { useMemo, useState } from "react";
import type { IFinancialRecord } from "../../context/financial-record-context";
import { useFinancialRecords } from "../../context/financial-record-context";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

/**
 * MonthlySummary:
 * - choose month-year using <input type="month">
 * - compute category-wise totals for that month
 * - show bar chart and summary totals
 */

const formatMonthInput = (d = new Date()) => {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  return `${y}-${m}`; // "YYYY-MM"
};

const MonthlySummary: React.FC = () => {
  const { records } = useFinancialRecords();
  const [month, setMonth] = useState<string>(formatMonthInput(new Date()));

  // filter records that belong to selected month
  const monthRecords = useMemo(() => {
    if (!records) return [];
    const [y, m] = month.split("-").map(Number);
    return (records as IFinancialRecord[]).filter((r) => {
      const d = new Date(r.date);
      return d.getFullYear() === y && d.getMonth() + 1 === m;
    });
  }, [records, month]);

  // category aggregation
  const categoryTotals = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of monthRecords) {
      const cat = r.category || "Uncategorized";
      const current = map.get(cat) ?? 0;
      map.set(cat, current + (Number(r.amt) || 0));
    }
    // turn into array sorted descending
    const arr = Array.from(map.entries()).map(([category, amount]) => ({ category, amount }));
    arr.sort((a, b) => b.amount - a.amount);
    return arr;
  }, [monthRecords]);

  const totalAmount = useMemo(() => categoryTotals.reduce((s, c) => s + c.amount, 0), [categoryTotals]);

  // chart data: rename fields for recharts
  const chartData = categoryTotals.map((c) => ({ name: c.category, amount: c.amount }));

  return (
    <div className="page-container centered-content">
      <div className="card wide-card">
        <div className="card-header">
          <h2>Monthly Summary</h2>
          <div className="controls-inline">
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
          </div>
        </div>

        <div className="summary-row">
          <div className="summary-item">
            <div className="summary-label">Month</div>
            <div className="summary-value">{month}</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">Total spent</div>
            <div className="summary-value">₹ {totalAmount.toLocaleString()}</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">Transactions</div>
            <div className="summary-value">{monthRecords.length}</div>
          </div>
        </div>

        <div style={{ height: 340 }}>
          {chartData.length === 0 ? (
            <div style={{ padding: 28, textAlign: "center" }}>No data for this month.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-20} textAnchor="end" interval={0} height={70} />
                <YAxis />
                <Tooltip formatter={(value: any) => `₹ ${Number(value).toLocaleString()}`} />
                <Legend />
                <Bar dataKey="amount" name="Amount (₹)" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div style={{ marginTop: 18 }}>
          <h3 style={{ margin: "0 0 8px 0" }}>Category totals</h3>
          <div className="table-container small">
            <table className="table">
              <thead>
                <tr><th>Category</th><th>Total</th></tr>
              </thead>
              <tbody>
                {categoryTotals.length === 0 ? (
                  <tr><td colSpan={2} style={{ textAlign: "center", padding: 12 }}>No categories</td></tr>
                ) : (
                  categoryTotals.map((c) => (
                    <tr key={c.category}>
                      <td>{c.category}</td>
                      <td>₹ {c.amount.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MonthlySummary;
