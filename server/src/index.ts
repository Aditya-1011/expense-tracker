// server/src/index.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";

// Load .env from server/.env (if present). In production you will set env vars in the host.
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// --- Environment configuration ---
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
const MONGODB_URI = process.env.MONGODB_URI || "";
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

// --- Basic validation/logging ---
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not defined. Please set MONGODB_URI in the environment.");
} else {
  console.log("📌 MONGODB_URI is provided (not printing value for security).");
}

console.log("📌 CLIENT_ORIGIN:", CLIENT_ORIGIN);

// --- Express app setup ---
const app = express();

// CORS: allow only configured origin (good practice). In development CLIENT_ORIGIN defaults to localhost:5173
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());

// --- Connect to MongoDB (mongoose) ---
async function connectDB() {
  if (!MONGODB_URI) return;
  try {
    await mongoose.connect(MONGODB_URI, {
      // options if you need; with latest mongoose these may be defaults
    } as mongoose.ConnectOptions);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}
connectDB().catch((e) => console.error(e));

// --- Define routes ---
// NOTE: If you have separate routers/models, import them here instead of this minimal example.

type SimpleRecord = {
  _id?: string;
  title: string;
  amount: number;
  date?: string;
};

let inMemoryRecords: SimpleRecord[] = [
  { _id: "1", title: "Sample", amount: 100, date: new Date().toISOString() },
];

// Health route
app.get("/health", (_req, res) => res.json({ status: "ok", time: new Date().toISOString() }));

// GET all financial records (replace with real DB query in your app)
app.get("/financial-records", async (_req, res) => {
  // If you have Mongoose models, replace this with: const records = await FinancialRecordModel.find();
  return res.json(inMemoryRecords);
});

// POST create a record
app.post("/financial-records", async (req, res) => {
  try {
    const { title, amount, date } = req.body;
    if (!title || typeof amount !== "number") {
      return res.status(400).json({ error: "title and numeric amount are required" });
    }
    const newRec: SimpleRecord = {
      _id: String(Date.now()),
      title,
      amount,
      date: date ?? new Date().toISOString(),
    };
    // Replace with DB insert if you have one
    inMemoryRecords = [newRec, ...inMemoryRecords];
    return res.status(201).json(newRec);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal" });
  }
});

// DELETE record (replace with actual DB delete)
app.delete("/financial-records/:id", async (req, res) => {
  const id = req.params.id;
  const before = inMemoryRecords.length;
  inMemoryRecords = inMemoryRecords.filter((r) => r._id !== id);
  if (inMemoryRecords.length === before) {
    return res.status(404).json({ error: "not found" });
  }
  return res.json({ deleted: id });
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT} (listening port ${PORT})`);
  console.log("♻️  Use CLIENT_ORIGIN env var to control CORS origin for production");
});
