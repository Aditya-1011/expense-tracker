import express, { Express } from "express"; 
import mongoose from "mongoose";
import financialrecordrouter from "./Routes/financial-routes.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// ✅ FIX: match frontend endpoint
app.use("api/financial-records", financialrecordrouter);

const mongodb: string = process.env.MONGODB_URI as string;

// connect to MongoDB
mongoose
  .connect(mongodb)
  .then(() => {
    console.log("✅ MongoDB connected successfully"); 
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
