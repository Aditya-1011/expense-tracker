// client/src/context/financial-record-context.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface IFinancialRecord {
  _id?: string;
  userId: string;
  date: string | Date;
  desc: string;
  amt: number;
  category: string;
  payment: string;
  createdAt?: string;
  updatedAt?: string;
}

interface FinancialRecordContextType {
  records: IFinancialRecord[];
  addRecord: (record: IFinancialRecord) => Promise<IFinancialRecord | null>;
  refreshRecords: () => Promise<void>;
}

const FinancialRecordContext = createContext<FinancialRecordContextType | undefined>(undefined);

export const FinancialRecordProvider = ({ children }: { children: ReactNode }) => {
  const [records, setRecords] = useState<IFinancialRecord[]>([]);

  const addRecord = async (record: IFinancialRecord) => {
    try {
      const res = await fetch("http://localhost:3001/financial-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("❌ Server responded with non-ok status:", res.status, text);
        return null;
      }

      const newRecord = await res.json();
      setRecords((prev) => [newRecord, ...prev]);
      return newRecord;
    } catch (error) {
      console.error("❌ Failed to add record:", error);
      return null;
    }
  };

  const refreshRecords = async () => {
    try {
      const res = await fetch("http://localhost:3001/financial-records");
      if (!res.ok) {
        console.error("❌ Failed to fetch records:", res.status);
        return;
      }
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      console.error("❌ Fetch records error:", err);
    }
  };

  return (
    <FinancialRecordContext.Provider value={{ records, addRecord, refreshRecords }}>
      {children}
    </FinancialRecordContext.Provider>
  );
};

export const useFinancialRecords = () => {
  const ctx = useContext(FinancialRecordContext);
  if (!ctx) throw new Error("useFinancialRecords must be used inside FinancialRecordProvider");
  return ctx;
};
