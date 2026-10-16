const fs = require("node:fs/promises");
const path = require("node:path");
const config = require("../config");

// Replaces utils/supabase.ts: files are stored on disk under UPLOAD_DIR.
const toPublicUrl = (filename) => `${config.uploads.publicUrl}/${config.uploads.dir}/${filename}`;

const deleteImage = async (imageUrl) => {
  if (!imageUrl) return;

  const filename = path.basename(imageUrl);
  try {
    await fs.unlink(path.join(config.uploads.dir, filename));
  } catch (error) {
    // A missing file should not fail the request that owns it.
    if (error.code !== "ENOENT") throw error;
  }
};

module.exports = { toPublicUrl, deleteImage };
