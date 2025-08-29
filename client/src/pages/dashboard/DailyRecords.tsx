// client/src/pages/dashboard/DailyRecords.tsx
import React, { useMemo, useState } from "react";
import type { IFinancialRecord } from "../../context/financial-record-context";
import { useFinancialRecords } from "../../context/financial-record-context";

const formatDateInput = (d: Date) => d.toISOString().slice(0, 10);

const isoToLocalYMD = (isoOrDate: string | Date) => {
  const dt = typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate;
  return dt.toISOString().slice(0, 10);
};

const DailyRecords: React.FC = () => {
  const { records } = useFinancialRecords();
  const [selectedDate, setSelectedDate] = useState<string>(formatDateInput(new Date()));
  const [filterPayment, setFilterPayment] = useState<string>("");

  const filtered = useMemo(() => {
    if (!records || records.length === 0) return [];
    return (records as IFinancialRecord[]).filter((r) => {
      const recDate = isoToLocalYMD(r.date);
      if (recDate !== selectedDate) return false;
      if (filterPayment && r.payment !== filterPayment) return false;
      return true;
    });
  }, [records, selectedDate, filterPayment]);

  const total = useMemo(() => filtered.reduce((s, r) => s + (Number(r.amt) || 0), 0), [filtered]);

  return (
    <div className="page-container centered-content">
      <div className="card wide-card">
        <div className="card-header">
          <h2>Daily Payments</h2>
          <div className="controls-inline">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              aria-label="Filter by payment"
            >
              <option value="">All Payment Methods</option>
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
              <option value="UPI">UPI</option>
            </select>
          </div>
        </div>

        <div className="summary-row">
          <div className="summary-item">
            <div className="summary-label">Selected day</div>
            <div className="summary-value">{selectedDate}</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">Total</div>
            <div className="summary-value">₹ {total.toLocaleString()}</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">Transactions</div>
            <div className="summary-value">{filtered.length}</div>
          </div>
        </div>

        <div className="table-container small">
          <table className="table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Payment</th>
                <th>Date & time</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "1rem" }}>
                    No records for this date.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r._id}>
                    <td>{r.desc}</td>
                    <td>₹ {Number(r.amt || 0).toLocaleString()}</td>
                    <td>{r.category}</td>
                    <td>{r.payment}</td>
                    <td>{new Date(r.date).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DailyRecords;
