// client/src/pages/dashboard/Financial-record-form.tsx
import { useState, type FormEvent } from "react";
import { useFinancialRecords } from "../../context/financial-record-context";

export const FinancialForm = () => {
  const { addRecord } = useFinancialRecords();

  const [desc, setDesc] = useState("");
  const [amt, setAmt] = useState("");
  const [category, setCategory] = useState("");
  const [payment, setPayment] = useState("");
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10)); // yyyy-mm-dd
  const [submitting, setSubmitting] = useState(false);

  const handleEvent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!desc.trim() || !amt) return;

    setSubmitting(true);
    try {
      await addRecord({
        desc: desc.trim(),
        amt: Number(amt),
        category,
        payment,
        date,
      });
      // reset
      setDesc("");
      setAmt("");
      setCategory("");
      setPayment("");
      setDate(new Date().toISOString().slice(0, 10));
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fin-form-root">
      <form onSubmit={handleEvent} className="financial-form">
        <div className="compact">
          <label htmlFor="desc">Description</label>
          <input id="desc" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Bought groceries" />
        </div>

        <div className="compact">
          <label htmlFor="amt">Amount</label>
          <input id="amt" value={amt} onChange={(e) => setAmt(e.target.value)} inputMode="decimal" placeholder="0.00" />
        </div>

        <div className="compact">
          <label htmlFor="category">Category</label>
          <input id="category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Food / Transport" />
        </div>

        <div className="compact">
          <label htmlFor="payment">Payment</label>
          <input id="payment" value={payment} onChange={(e) => setPayment(e.target.value)} placeholder="Cash / Card" />
        </div>

        <div className="compact">
          <label htmlFor="date">Date</label>
          <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div>
          <button type="submit" disabled={submitting}>
            {submitting ? "Adding..." : "Add Expense"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FinancialForm;
