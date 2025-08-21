// src/Schema/financial-records.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IFinancialRecord extends Document {
  userId: string;
  date: Date;
  desc: string;
  amt: number;
  category: string;
  payment: string;
}

const financialRecordSchema = new Schema<IFinancialRecord>({
  userId: { type: String, required: true },
  date: { type: Date, required: true },
  desc: { type: String, required: true },
  amt: { type: Number, required: true },
  category: { type: String, required: true },
  payment: { type: String, required: true },
});

const FinancialRecordModel = mongoose.model<IFinancialRecord>("FinancialRecord", financialRecordSchema);

export default FinancialRecordModel;
