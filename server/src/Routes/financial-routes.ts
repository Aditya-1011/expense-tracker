// server/src/Routes/financial-routes.ts
import express, { Request, Response } from "express";
import FinancialRecordModel from "../Schema/Financial-record";

const router = express.Router();

// GET all records by userId
router.get("/getAllbyUserId/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const records = await FinancialRecordModel.find({ userId });
    if (!records || records.length === 0) return res.status(404).send({ message: "No records found" });
    return res.status(200).send(records);
  } catch (error) {
    console.error("GET error:", error);
    return res.status(500).send({ message: "Server error", error });
  }
});

// POST create
router.post("/create", async (req: Request, res: Response) => {
  try {
    const { userId, date, desc, amt, category, payment } = req.body;
    if (!userId || !date || !desc || amt === undefined || !category || !payment) {
      return res.status(400).send({ message: "Missing required fields." });
    }
    const newRecord = new FinancialRecordModel({
      userId,
      date: new Date(date),
      desc,
      amt: Number(amt),
      category,
      payment,
    });
    const saved = await newRecord.save();
    return res.status(201).send(saved);
  } catch (error) {
    console.error("POST /create error:", error);
    return res.status(500).send({ message: "Server error", error });
  }
});

// PUT update/:id
router.put("/update/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const updatePayload = req.body;
    if (updatePayload.date) updatePayload.date = new Date(updatePayload.date);
    if (updatePayload.amt !== undefined) updatePayload.amt = Number(updatePayload.amt);
    const updated = await FinancialRecordModel.findByIdAndUpdate(id, updatePayload, { new: true });
    if (!updated) return res.status(404).send({ message: "Record not found." });
    return res.status(200).send(updated);
  } catch (error) {
    console.error("PUT /update/:id error:", error);
    return res.status(500).send({ message: "Server error", error });
  }
});

// DELETE delete/:id    <-- this is the important bit for you
router.delete("/delete/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).send({ message: "Missing id param." });

    const deleted = await FinancialRecordModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).send({ message: "Record not found." });

    return res.status(200).send({ message: "Record deleted successfully.", id });
  } catch (error) {
    console.error("DELETE /delete/:id error:", error);
    return res.status(500).send({ message: "Server error", error });
  }
});

export default router;
