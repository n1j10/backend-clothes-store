const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");
const config = require("../config");

// Serverless hosts (Vercel) have a read-only, ephemeral filesystem, so images go to
// Vercel Blob when BLOB_READ_WRITE_TOKEN is set; otherwise they are stored on disk.
const useBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

const toPublicUrl = (filename) => `${config.uploads.publicUrl}/${config.uploads.dir}/${filename}`;

const saveImage = async (file) => {
  const filename = `${crypto.randomUUID()}${path.extname(file.originalname)}`;

  if (useBlob()) {
    const { put } = require("@vercel/blob");
    const blob = await put(`products/${filename}`, file.buffer, {
      access: "public",
      contentType: file.mimetype,
    });
    return blob.url;
  }

  await fs.mkdir(config.uploads.dir, { recursive: true });
  await fs.writeFile(path.join(config.uploads.dir, filename), file.buffer);
  return toPublicUrl(filename);
};

const deleteImage = async (imageUrl) => {
  if (!imageUrl) return;

  if (/^https:\/\/[^/]+\.blob\.vercel-storage\.com\//.test(imageUrl)) {
    if (!useBlob()) return;
    const { del } = require("@vercel/blob");
    await del(imageUrl).catch(() => {});
    return;
  }

  const filename = path.basename(imageUrl);
  try {
    await fs.unlink(path.join(config.uploads.dir, filename));
  } catch (error) {
    // A missing file (or read-only fs) should not fail the request that owns it.
    if (!["ENOENT", "EROFS", "EACCES"].includes(error.code)) throw error;
  }
};

module.exports = { saveImage, deleteImage };
