// services/llm.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ──────────────────────────────────────────────────────────────
// Configuration
// ──────────────────────────────────────────────────────────────
const model       = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
const MAX_CHARS   = 15000;          // ~60 k tokens ≈ 4 chars per token
const CHUNK_DELAY = 1000;           // cooldown between chunked calls (ms)

// ──────────────────────────────────────────────────────────────
// Shared helpers
// ──────────────────────────────────────────────────────────────
function getRetryDelayMs(err) {
  try {
    const info = err.errorDetails?.find(d => d['@type'] === 'type.googleapis.com/google.rpc.RetryInfo');
    const s    = parseFloat(info?.retryDelay.replace('s', ''));
    return (isNaN(s) ? 2 : s) * 1000;
  } catch { return 2000; }
}

function templateForCode(code) {
  return `
You are an expert code reviewer. Analyse the following codebase for:
- Bugs
- Anti‑patterns
- Performance issues
- Security issues
- Maintainability improvements

✅ For every issue provide:
• Issue type • Root cause • Suggestion / fix  
• Code reference(s) • A corrected snippet if feasible

--- START OF CODEBASE ---
${code}
--- END OF CODEBASE ---
`.trim();
}

// ──────────────────────────────────────────────────────────────
// Core call (flexible prompt or raw‑code)
// ──────────────────────────────────────────────────────────────
async function analyzeCode(input, { retries = 3, isPrompt = false } = {}) {
  // Decide whether to wrap input in our template
  const prompt = isPrompt ? input : templateForCode(input.slice(0, MAX_CHARS));

  try {
    const res = await model.generateContent([prompt]);
    return res.response.text();
  } catch (err) {
    if (err.status === 429 && retries > 0) {
      const delay = getRetryDelayMs(err);
      console.warn(`Gemini 429 – retrying in ${delay / 1000}s… (${retries} left)`);
      await new Promise(r => setTimeout(r, delay));
      return analyzeCode(input, { retries: retries - 1, isPrompt });
    }
    console.error('Gemini API error:', err);
    throw err;
  }
}

// ──────────────────────────────────────────────────────────────
// Bug‑summary helper (unchanged)
// ──────────────────────────────────────────────────────────────
async function summarizeBug(issueText) {
  const prompt = `
You are a helpful AI assistant reviewing a bug report.

Respond in **this exact format**:

---
🔎 Issue: <short description>  
💥 Root Cause: <why it happens>  
💡 Suggestion: <how to fix / improve>  
📌 References: <file / fn names if known>  
🛠️ Improved Code: <snippet if possible>  
---

Here is the raw issue text:
"${issueText}"
`.trim();

  const result = await model.generateContent([prompt]);
  return result.response.text();
}

// ──────────────────────────────────────────────────────────────
module.exports = { analyzeCode, summarizeBug, CHUNK_DELAY };
