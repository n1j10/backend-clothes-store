const multer = require("multer");
const config = require("../config");
const ApiError = require("../utils/ApiError");

// Files are kept in memory and persisted by image.service (disk locally, Blob on Vercel).
const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.uploads.maxFileSize },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(ApiError.badRequest("File must be an image"));
    }
    cb(null, true);
  },
}).single("image");

module.exports = { uploadImage };
