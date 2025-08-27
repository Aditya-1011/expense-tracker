// server/src/index.ts
import dotenv from "dotenv";
import path from "path";
import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";

// Load .env (force path to project root server/.env)
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import financialRecordRouter from "./Routes/financial-routes";

const app: Express = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173", // change if your client runs on another origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json()); // parse application/json

// Health-check
app.get("/", (_req: Request, res: Response) => {
  res.send("🚀 Expense Tracker API is running!");
});

// Mount routes
app.use("/financial-records", financialRecordRouter);

// Connect to MongoDB
const mongodb = process.env.MONGODB_URI;
console.log("📌 MONGODB_URI:", Boolean(mongodb)); // debug: prints true/false
if (!mongodb) {
  console.error("❌ MONGODB_URI not defined. Put MONGODB_URI in server/.env");
  process.exit(1);
}

mongoose
  .connect(mongodb)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
