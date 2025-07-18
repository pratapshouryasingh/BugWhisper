// backend/routes/search.js
const express = require("express");
const router = express.Router();
const Search = require("../services/SearchModel");
const clerkAuth = require("../middleware/clerkAuth"); // 🛡️ Clerk Middleware

// POST /search — Save search result
router.post("/", clerkAuth, async (req, res) => {
  const { query, result } = req.body;
  const clerkUserId = req.auth?.userId;

  if (!query || !result) {
    console.log("❌ Missing query or result:", req.body);
    return res.status(400).json({ error: "Query and result are required." });
  }

  try {
    const saved = await Search.create({ clerkUserId, query, result });
    console.log("✅ Search saved for user:", clerkUserId);
    res.status(201).json({ success: true, id: saved._id });
  } catch (err) {
    console.error("❌ Save search error:", err);
    res.status(500).json({ error: "Failed to save search" });
  }
});

// GET /search — Fetch search history for user
router.get("/", clerkAuth, async (req, res) => {
  const clerkUserId = req.auth?.userId;
  const page = parseInt(req.query.page || "1", 10);
  const limit = parseInt(req.query.limit || "10", 10);

  try {
    const data = await Search.find({ clerkUserId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Search.countDocuments({ clerkUserId });

    console.log(`📦 Fetched ${data.length} history items for user: ${clerkUserId}`);
    res.json({ total, page, limit, data });
  } catch (err) {
    console.error("❌ Fetch history error:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

module.exports = router;
