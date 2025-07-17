const fs = require("fs");
const path = require("path");

// Directories we never want to scan
const IGNORE_DIRS = new Set([
  "node_modules", ".git", ".github", ".next",
  "dist", "build", "out", "coverage", ".turbo"
]);

// Extensions we want to scan
const CODE_REGEX = /\.(c|cpp|go|java|js|jsx|ts|tsx|py|rb|rs|cs|php)$/i;

// Max file size: 1000MB (adjust as needed)
const MAX_SIZE_BYTES = 1000 * 1024 * 1024;

// Extra ignore patterns (filenames or extensions)
const IGNORE_FILES = [
  /\.log$/i,
  /\.lock$/i,
  /\.env/i,
  /\.min\./i,
  /\.exe$/i,
  /\.dll$/i,
  /\.zip$/i,
  /\.tar$/i,
  /\.gz$/i,
  /\.jpg$/i,
  /\.png$/i,
  /\.svg$/i,
];

/**
 * Check if the file should be ignored based on name or extension
 */
function isIgnoredFile(filename) {
  return IGNORE_FILES.some((pattern) => pattern.test(filename));
}

/**
 * Recursively gather all code files while skipping heavy/unwanted/ignored dirs.
 */
function getAllFiles(dirPath, out = []) {
  for (const file of fs.readdirSync(dirPath)) {
    const fullPath = path.join(dirPath, file);

    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!IGNORE_DIRS.has(file)) {
        getAllFiles(fullPath, out);
      }
    } else {
      // Skip files that don't match our criteria
      if (!CODE_REGEX.test(file)) continue;
      if (isIgnoredFile(file)) continue;
      if (stat.size > MAX_SIZE_BYTES) continue;

      out.push(fullPath);
    }
  }
  return out;
}

/**
 * Read each file and return { path, content } objects
 */
function readFilesContent(files) {
  return files.map((f) => ({
    path: f,
    content: fs.readFileSync(f, "utf-8"),
  }));
}

module.exports = { getAllFiles, readFilesContent };
