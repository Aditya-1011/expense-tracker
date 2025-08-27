import express, { Request, Response } from "express";
import FinancialRecordModel from "../Schema/Financial-record";


const router = express.Router();

// GET all records by userId
router.get("/getAllbyUserId/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const records = await FinancialRecordModel.find({ userId });

    if (records.length === 0) {
      return res.status(404).send({ message: "No records found for this user." });
    }

    res.status(200).send(records);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// POST new record
router.post("/", async (req: Request, res: Response) => {
  try {
    const newRecordbody = req.body;
    const newrecord = new FinancialRecordModel(newRecordbody);
    const savedRecord = await newrecord.save();

    res.status(200).send(savedRecord);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// UPDATE record
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const newRecordbody = req.body;

    const record = await FinancialRecordModel.findByIdAndUpdate(id, newRecordbody, { new: true });

    if (!record) {
      return res.status(404).send({ message: "Record not found." });
    }

    res.status(200).send(record);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// DELETE record
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const record = await FinancialRecordModel.findByIdAndDelete(id);

    if (!record) {
      return res.status(404).send({ message: "Record not found." });
    }

    res.status(200).send({ message: "Record deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

export default router;