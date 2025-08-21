// src/Schema/financial-records.ts
import mongoose, { Schema } from "mongoose";
const financialRecordSchema = new Schema({
    userId: { type: String, required: true },
    date: { type: Date, required: true },
    desc: { type: String, required: true },
    amt: { type: Number, required: true },
    category: { type: String, required: true },
    payment: { type: String, required: true },
});
const FinancialRecordModel = mongoose.model("FinancialRecord", financialRecordSchema);
export default FinancialRecordModel;
//# sourceMappingURL=financial-records.js.map