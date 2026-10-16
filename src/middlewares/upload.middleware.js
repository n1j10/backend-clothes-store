const path = require("node:path");
const crypto = require("node:crypto");
const multer = require("multer");
const config = require("../config");
const ApiError = require("../utils/ApiError");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, config.uploads.dir),
  filename: (req, file, cb) => {
    const unique = crypto.randomUUID();
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

// Same rules as the Next.js imageSchema: images only, max 1 MB.
const uploadImage = multer({
  storage,
  limits: { fileSize: config.uploads.maxFileSize },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(ApiError.badRequest("File must be an image"));
    }
    cb(null, true);
  },
}).single("image");

module.exports = { uploadImage };
