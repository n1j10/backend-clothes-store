const path = require("node:path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("./config");
const routes = require("./routes");
const { notFound, errorHandler } = require("./middlewares/error.middleware");

const rateLimit = require("./middlewares/rateLimit.middleware");

const app = express();

// Behind Vercel's proxy: use X-Forwarded-For for req.ip (rate limiting).
app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(helmet());
// Restrict CORS to known frontends when CORS_ORIGIN is set (comma-separated).
// The API uses Bearer tokens (no cookies), so the open default is not a CSRF vector.
const allowedOrigins = process.env.CORS_ORIGIN?.split(",").map((origin) => origin.trim()).filter(Boolean);
app.use(cors(allowedOrigins?.length ? { origin: allowedOrigins } : undefined));
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
if (config.env === "development") app.use(morgan("dev"));

// Uploaded product images.
if (!process.env.VERCEL) app.use(`/${config.uploads.dir}`, express.static(path.resolve(config.uploads.dir)));

// Global safety net against abuse: 300 requests / minute per IP.
app.use("/api", rateLimit({ windowMs: 60 * 1000, max: 300 }), routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
