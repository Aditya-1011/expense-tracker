// client/src/context/financial-record-context.tsx
import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
} from "react";
import { useUser } from "@clerk/clerk-react";

export interface IFinancialRecord {
  _id: string;
  userId: string;
  date: string; // yyyy-mm-dd
  desc: string;
  amt: number;
  category?: string;
  payment?: string;
}

type RecordsContextValue = {
  records: IFinancialRecord[];
  loading: boolean;
  addRecord: (r: Omit<IFinancialRecord, "_id" | "userId">) => Promise<void>;
  updateRecord: (id: string, payload: Partial<IFinancialRecord>) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
};

const RecordsContext = createContext<RecordsContextValue | undefined>(undefined);

const STORAGE_KEY = "expense-tracker-records-v1";

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

/**
 * Simple client-side context that tries to POST/PUT/DELETE to
 * server endpoints if available, but falls back to localStorage.
 *
 * (Adjust endpoint URLs if your server API paths differ).
 */
export const FinancialRecordProvider = ({ children }: { children: ReactNode }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [records, setRecords] = useState<IFinancialRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper: load from server or localStorage
  const loadRecords = async () => {
    setLoading(true);
    try {
      // if backend exists, try to fetch (adjust path if needed)
      const res = await fetch("/api/financial-records");
      if (res.ok) {
        const data = await res.json();
        setRecords(Array.isArray(data) ? data : []);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data || []));
        setLoading(false);
        return;
      }
    } catch (e) {
      // ignore and fall back to localStorage below
      // console.warn("fetch records failed, falling back to localStorage", e);
    }

    // fallback
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as IFinancialRecord[];
        setRecords(parsed);
      } catch {
        setRecords([]);
      }
    } else {
      setRecords([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Only load when Clerk tells us whether user is signed in (prevents extra calls)
    if (isLoaded) {
      loadRecords();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, user?.id]);

  // Add record (try server, fallback to local)
  const addRecord = async (payload: Omit<IFinancialRecord, "_id" | "userId">) => {
    const newRecord: IFinancialRecord = {
      _id: generateId(),
      userId: user?.id ?? "anon",
      ...payload,
    };
    // optimistic update
    setRecords((r) => {
      const next = [newRecord, ...r];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });

    try {
      const res = await fetch("/api/financial-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecord),
      });
      if (!res.ok) {
        // server didn't save — we keep local copy, but don't crash
        // console.warn("server add record failed", res.status);
      } else {
        const saved = await res.json();
        // if server returns authoritative id, reconcile it:
        setRecords((r) => {
          const next = r.map((x) => (x._id === newRecord._id ? saved : x));
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          return next;
        });
      }
    } catch {
      // offline — already stored in localStorage
    }
  };

  // Update record
  const updateRecord = async (id: string, payload: Partial<IFinancialRecord>) => {
    setRecords((r) => {
      const next = r.map((x) => (x._id === id ? { ...x, ...payload } : x));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });

    try {
      await fetch(`/api/financial-records/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      // ignore
    }
  };

  // Delete record
  const deleteRecord = async (id: string) => {
    setRecords((r) => {
      const next = r.filter((x) => x._id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });

    try {
      await fetch(`/api/financial-records/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    } catch {
      // ignore
    }
  };

  return (
    <RecordsContext.Provider value={{ records, loading, addRecord, updateRecord, deleteRecord }}>
      {children}
    </RecordsContext.Provider>
  );
};

export const useFinancialRecords = () => {
  const ctx = useContext(RecordsContext);
  if (!ctx) throw new Error("useFinancialRecords must be used inside FinancialRecordProvider");
  return ctx;
};
