import { useState, type FormEvent } from "react";
import { useUser } from "@clerk/clerk-react";
// Update the import path if the context file is located elsewhere, for example:
import { useFinancialRecords } from "../../context/financial-record-context";
// Or correct the path as per your project structure.

export const FinancialForm = () => {
  const { user } = useUser();
  const { addRecord } = useFinancialRecords();

  const [desc, setDesc] = useState("");
  const [amt, setAmt] = useState("");
  const [category, setCategory] = useState("");
  const [payment, setPayment] = useState("");

  const handleEvent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newRecord = {
      userId: user?.id || "guest",
      date: new Date(),
      desc,
      amt: parseFloat(amt),
      category,
      payment,
    };

    console.log("New Expense:", newRecord);

    await addRecord(newRecord); // ✅ call context + backend

    // reset fields
    setDesc("");
    setAmt("");
    setCategory("");
    setPayment("");
  };

  return (
    <div className="form-container">
      <form onSubmit={handleEvent}>
        <div>
          <label>Description:</label>
          <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} />
        </div>

        <div>
          <label>Amount:</label>
          <input type="number" value={amt} onChange={(e) => setAmt(e.target.value)} />
        </div>

        <div>
          <label>Category:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select Category</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Personal">Personal</option>
            <option value="Family">Family</option>
            <option value="Food">Food</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label>Payment Method:</label>
          <select value={payment} onChange={(e) => setPayment(e.target.value)}>
            <option value="">Select Payment Method</option>
            <option value="Cash">Cash</option>
            <option value="Credit Card">Credit Card</option>
            <option value="UPI">UPI</option>
          </select>
        </div>

        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
};