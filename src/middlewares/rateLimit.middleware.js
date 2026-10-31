const ApiError = require("../utils/ApiError");

/**
 * Small fixed-window rate limiter (no external dependency).
 * In-memory per instance: on serverless it is a best-effort brake against
 * brute force and abuse, not a global quota.
 */
const rateLimit = ({ windowMs, max, message = "Too many requests, please try again later" }) => {
  const hits = new Map();

  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip || "unknown";
    const entry = hits.get(key);

    if (!entry || entry.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
    } else {
      entry.count += 1;
      if (entry.count > max) {
        res.set("Retry-After", String(Math.ceil((entry.resetAt - now) / 1000)));
        return next(new ApiError(429, message));
      }
    }

    // Keep memory bounded.
    if (hits.size > 10000) {
      for (const [ip, value] of hits) if (value.resetAt <= now) hits.delete(ip);
    }
    next();
  };
};

module.exports = rateLimit;
