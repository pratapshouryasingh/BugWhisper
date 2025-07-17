const express = require("express");
const path = require("path");
const fs = require("fs/promises");
const os = require("os");
const multer = require("multer");
const AdmZip = require("adm-zip");

const {
  summarizeBug,
  analyzeCode,
  analyzeCodeStream,
} = require("../services/llm");
const { cloneRepo, deleteRepo } = require("../services/gitUtils");
const { getAllFiles, readFilesContent } = require("../services/fileReader");
const Search = require("../services/SearchModel");
const clerkAuth = require("../middleware/clerkAuth");

const router = express.Router();

/* ---------------------- Utils ---------------------- */
function normalizeRepoUrl(url) {
  return url?.replace(/.*?(https:\/\/github\.com\/)/, "https://github.com/");
}

function splitIntoChunks(files, chunkSize = 10_000) {
  const chunks = [];
  let current = "";

  for (const f of files) {
    const snippet = `// File: ${f.path}\n${f.content}\n\n`;
    if (current.length + snippet.length > chunkSize) {
      chunks.push(current);
      current = "";
    }
    current += snippet;
  }
  if (current) chunks.push(current);
  return chunks;
}

/* -------------------- Multer (zip uploads) -------------------- */
const upload = multer({
  dest: os.tmpdir(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) =>
    cb(null, file.originalname.endsWith(".zip")),
});

/* ----------------- Route 1 – Analyze plain bug text ----------------- */
router.post("/", clerkAuth, async (req, res) => {
  try {
    const { issueText = "" } = req.body;
    const { userId: clerkUserId } = req.auth();

    const summary = await summarizeBug(issueText);
    await Search.create({ clerkUserId, query: issueText, result: summary });

    res.json({ summary });
  } catch (err) {
    console.error("Bug summary error:", err);
    res.status(500).json({ error: "AI error while summarizing bug." });
  }
});

/* ----------------- Route 2 – Analyze GitHub repo ----------------- */
router.post("/repo", clerkAuth, async (req, res) => {
  const repoUrl = normalizeRepoUrl(req.body.repoUrl);
  if (!repoUrl) {
    return res.status(400).json({ error: "Repository URL is required." });
  }

  const { userId: clerkUserId } = req.auth();
  let localPath;

  try {
    ({ localPath } = await cloneRepo(repoUrl));

    const files = getAllFiles(localPath);
    const contents = readFilesContent(files);
    const chunks = splitIntoChunks(contents);

    const results = [];
    for (const chunk of chunks) {
      results.push(await analyzeCode(chunk));
      await new Promise((r) => setTimeout(r, 1_000));
    }

    const analysis = results.join("\n\n");
    await Search.create({ clerkUserId, query: repoUrl, result: analysis });

    res.json({ analysis });
  } catch (err) {
    console.error("GitHub repo error:", err);
    res.status(500).json({ error: "AI error while analyzing GitHub repo." });
  } finally {
    if (localPath) await deleteRepo(localPath);
  }
});


/* ----------------- Route 4 – Analyze local folder ----------------- */
router.post("/folder", clerkAuth, async (req, res) => {
  const { folderPath } = req.body;
  if (!folderPath) {
    return res.status(400).json({ error: "Folder path is required." });
  }

  const { userId: clerkUserId } = req.auth();

  try {
    const files = getAllFiles(folderPath);
    const contents = readFilesContent(files);
    const chunks = splitIntoChunks(contents);

    const results = [];
    for (const chunk of chunks) {
      results.push(await analyzeCode(chunk));
      await new Promise((r) => setTimeout(r, 1_000));
    }

    const analysis = results.join("\n\n");
    await Search.create({ clerkUserId, query: folderPath, result: analysis });

    res.json({ analysis });
  } catch (err) {
    console.error("Folder error:", err);
    res.status(500).json({ error: "AI error while analyzing folder." });
  }
});

/* ----------------- Route 5 – Upload zip & analyze ----------------- */
router.post("/upload", clerkAuth, upload.single("zip"), async (req, res) => {
  const zipFile = req.file;
  if (!zipFile) {
    return res
      .status(400)
      .json({ error: "Uploaded file must be a .zip archive." });
  }

  const { userId: clerkUserId } = req.auth();
  const zipPath = zipFile.path;
  const extractTo = path.join(os.tmpdir(), `unzipped-${Date.now()}`);

  try {
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(extractTo, true);

    const files = getAllFiles(extractTo);
    const contents = readFilesContent(files);
    const chunks = splitIntoChunks(contents);

    const results = [];
    for (const chunk of chunks) {
      results.push(await analyzeCode(chunk));
      await new Promise((r) => setTimeout(r, 1_000));
    }

    const analysis = results.join("\n\n");
    await Search.create({
      clerkUserId,
      query: zipFile.originalname,
      result: analysis,
    });

    res.json({ analysis });
  } catch (err) {
    console.error("Zip upload error:", err);
    res.status(500).json({ error: "Error analyzing uploaded zip." });
  } finally {
    await fs.rm(zipPath, { force: true });
    await fs.rm(extractTo, { recursive: true, force: true });
  }
});

module.exports = router;
