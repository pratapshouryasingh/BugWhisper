const simpleGit = require('simple-git');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs-extra');
const path = require('path');

const TMP_DIR = path.join(__dirname, '../../tmp');

/**
 * Clone a GitHub repo into a unique tmp folder (shallow, depth=1).
 * Large histories & sub‑modules are skipped to speed things up.
 */
async function cloneRepo(repoUrl) {
  const id = uuidv4();
  const localPath = path.join(TMP_DIR, id);

  await simpleGit().clone(repoUrl, localPath, [
    '--depth', '1',         // shallow clone
    '--no-tags',            // skip tags
    '--recurse-submodules=no'
  ]);

  return { id, localPath };
}

/** Recursively delete the cloned repo folder */
async function deleteRepo(localPath) {
  await fs.remove(localPath);
}

module.exports = { cloneRepo, deleteRepo };
