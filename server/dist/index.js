"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/src/index.ts
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
// Load .env (force path to project root server/.env)
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../.env") });
const financial_routes_1 = __importDefault(require("./Routes/financial-routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
// Middlewares
app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // change if your client runs on another origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
}));
app.use(express_1.default.json()); // parse application/json
// Health-check
app.get("/", (_req, res) => {
    res.send("🚀 Expense Tracker API is running!");
});
// Mount routes
app.use("/financial-records", financial_routes_1.default);
// Connect to MongoDB
const mongodb = process.env.MONGODB_URI;
console.log("📌 MONGODB_URI:", Boolean(mongodb)); // debug: prints true/false
if (!mongodb) {
    console.error("❌ MONGODB_URI not defined. Put MONGODB_URI in server/.env");
    process.exit(1);
}
mongoose_1.default
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
