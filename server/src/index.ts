import express, { Express } from "express"; 
import mongoose from "mongoose";
import financialrecordrouter from "./Routes/financial-routes.js";
import cors from "cors";

const app: Express = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

// ✅ FIX: match frontend endpoint
app.use("/api/financial-records", financialrecordrouter);

const mongodb: string =
  "mongodb+srv://aditya:aditya@expense-tracker.6smzqvm.mongodb.net/?retryWrites=true&w=majority&appName=expense-tracker";

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
