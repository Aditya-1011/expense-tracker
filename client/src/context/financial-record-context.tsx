// client/src/context/financial-record-context.tsx
import React, { createContext, useContext, useState, type ReactNode } from "react";

interface FinancialRecord {
  userId: string;
  date: Date | string;
  desc: string;
  amt: number;
  category: string;
}

interface FinancialRecordContextType {
  records: FinancialRecord[];
  addRecord: (record: FinancialRecord) => Promise<void>;
}

const FinancialRecordContext = createContext<FinancialRecordContextType | undefined>(undefined);

export const FinancialRecordProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<FinancialRecord[]>([]);

  const addRecord = async (record: FinancialRecord) => {
    try {
      console.log("New Expense:", record);

      // URL matches the server route that's currently running in your build folder.
      const response = await fetch("http://localhost:3001/financial-record", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(record),
      });

      if (!response.ok) {
        throw new Error("Failed to add record");
      }

      const savedRecord = await response.json();
      setRecords((prev) => [...prev, savedRecord]);
    } catch (error) {
      console.error("Failed to add record:", error);
    }
  };

  return (
    <FinancialRecordContext.Provider value={{ records, addRecord }}>
      {children}
    </FinancialRecordContext.Provider>
  );
};

export const useFinancialRecords = (): FinancialRecordContextType => {
  const context = useContext(FinancialRecordContext);
  if (!context) {
    throw new Error("useFinancialRecords must be used within a FinancialRecordProvider");
  }
  return context;
};
