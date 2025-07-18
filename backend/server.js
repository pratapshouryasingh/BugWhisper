// backend/server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const analyzeRoute = require("./routes/analyze");
const searchRoute = require("./routes/search");

const app = express();

// ✅ Configure CORS
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "https://bug-whisper.vercel.app",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ Middleware: JSON & URL-encoded form parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Routes to keep server alive (UptimeRobot friendly)
app.get("/", (req, res) => {
  res.status(200).send("Server is alive!");
});

app.head("/", (req, res) => {
  res.status(200).end();
});

// ✅ Mount routes
app.use("/analyze", analyzeRoute);
app.use("/search", searchRoute);

// ✅ 404 Handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
