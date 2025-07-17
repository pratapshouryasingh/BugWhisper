// backend/middleware/clerkAuth.js
const { requireAuth } = require("@clerk/express");
require("dotenv").config();

// ✅ Clerk Express Middleware — handles token verification & session parsing
module.exports = requireAuth({
  // Optional: log unauthorized attempts
  unauthorizedHandler: (req, res) => {
    console.warn("🚫 Unauthorized:", req.method, req.originalUrl);
    res.status(401).json({ error: "Unauthorized: Missing or invalid token" });
  },
});
