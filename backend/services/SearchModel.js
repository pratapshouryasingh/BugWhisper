// backend/services/SearchModel.js
const mongoose = require("mongoose");

const searchSchema = new mongoose.Schema({
  clerkUserId: { type: String, required: true },
  query: String,
  result: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Search", searchSchema);
