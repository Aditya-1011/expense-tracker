// client/src/context/financial-record-context.tsx
import React, { createContext, useContext, useEffect, useState } from "react";

/**
 * FinancialRecordContext
 * - Uses VITE_API_URL at build time (Vite)
 * - If VITE_API_URL is not provided, falls back to localhost for local dev only
 *
 * Make sure to set VITE_API_URL in Vercel environment variables (Production/Preview/Development).
 */

// --- Types (adjust to your project's real model) ---
export type FinancialRecord = {
  _id?: string;
  title: string;
  amount: number;
  category?: string;
  date?: string;
};

// --- Configure API base (Vite injects import.meta.env at build time) ---
const VITE_API_BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? "";

function apiUrlFor(path: string) {
  if (VITE_API_BASE) {
    const base = VITE_API_BASE.replace(/\/$/, "");
    return `${base}/${path.replace(/^\//, "")}`;
  }
  // local dev fallback (only used in development)
  return `http://localhost:3001/${path.replace(/^\//, "")}`;
}

const FINANCIAL_RECORDS_API = apiUrlFor("financial-records");

// --- Context value shape ---
type ContextValue = {
  records: FinancialRecord[];
  loading: boolean;
  error?: string | null;
  fetchRecords: () => Promise<void>;
  addRecord: (r: Omit<FinancialRecord, "_id">) => Promise<FinancialRecord | null>;
  deleteRecord: (id: string) => Promise<boolean>;
};

const FinancialRecordContext = createContext<ContextValue | undefined>(undefined);

// --- Provider implementation ---
export const FinancialRecordProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch records from API
  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(FINANCIAL_RECORDS_API, {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch records: ${res.status} ${text}`);
      }
      const data = await res.json();
      setRecords(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const addRecord = async (r: Omit<FinancialRecord, "_id">) => {
    try {
      setLoading(true);
      const res = await fetch(FINANCIAL_RECORDS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(r),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to add record: ${res.status} ${text}`);
      }
      const created = await res.json();
      setRecords((prev) => [created, ...prev]);
      return created;
    } catch (err: any) {
      setError(err?.message ?? "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      setLoading(true);
      const res = await fetch(`${FINANCIAL_RECORDS_API}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to delete: ${res.status} ${text}`);
      }
      setRecords((prev) => prev.filter((r) => r._id !== id));
      return true;
    } catch (err: any) {
      setError(err?.message ?? "Unknown error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // auto-load once on mount
    fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: ContextValue = {
    records,
    loading,
    error,
    fetchRecords,
    addRecord,
    deleteRecord,
  };

  return <FinancialRecordContext.Provider value={value}>{children}</FinancialRecordContext.Provider>;
};

// --- Hook for consumers ---
export const useFinancialRecords = () => {
  const ctx = useContext(FinancialRecordContext);
  if (!ctx) throw new Error("useFinancialRecords must be used inside FinancialRecordProvider");
  return ctx;
};
