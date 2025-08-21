import mongoose, { Document } from "mongoose";
export interface IFinancialRecord extends Document {
    userId: string;
    date: Date;
    desc: string;
    amt: number;
    category: string;
    payment: string;
}
declare const FinancialRecordModel: mongoose.Model<IFinancialRecord, {}, {}, {}, mongoose.Document<unknown, {}, IFinancialRecord, {}, {}> & IFinancialRecord & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default FinancialRecordModel;
//# sourceMappingURL=financial-records.d.ts.map