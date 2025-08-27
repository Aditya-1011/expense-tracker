// server/src/Schema/Financial-record.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IFinancialRecord extends Document {
  userId: string;
  date: Date;
  desc: string;
  amt: number;
  category: string;
  payment: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const FinancialRecordSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    date: { type: Date, required: true },
    desc: { type: String, required: true },
    amt: { type: Number, required: true },
    category: { type: String, required: true },
    payment: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IFinancialRecord>(
  "FinancialRecord",
  FinancialRecordSchema
);
