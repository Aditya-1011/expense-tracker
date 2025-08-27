"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Financial_record_1 = __importDefault(require("../Schema/Financial-record"));
const router = express_1.default.Router();
// GET all records by userId
router.get("/getAllbyUserId/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const records = await Financial_record_1.default.find({ userId });
        if (records.length === 0) {
            return res.status(404).send({ message: "No records found for this user." });
        }
        res.status(200).send(records);
    }
    catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});
// POST new record
router.post("/", async (req, res) => {
    try {
        const newRecordbody = req.body;
        const newrecord = new Financial_record_1.default(newRecordbody);
        const savedRecord = await newrecord.save();
        res.status(200).send(savedRecord);
    }
    catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});
// UPDATE record
router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const newRecordbody = req.body;
        const record = await Financial_record_1.default.findByIdAndUpdate(id, newRecordbody, { new: true });
        if (!record) {
            return res.status(404).send({ message: "Record not found." });
        }
        res.status(200).send(record);
    }
    catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});
// DELETE record
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const record = await Financial_record_1.default.findByIdAndDelete(id);
        if (!record) {
            return res.status(404).send({ message: "Record not found." });
        }
        res.status(200).send({ message: "Record deleted successfully." });
    }
    catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});
exports.default = router;
