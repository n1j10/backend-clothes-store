const express = require("express");
const controller = require("../controllers/user.controller");
const validate = require("../middlewares/validate.middleware");
const { authenticate } = require("../middlewares/auth.middleware");
const { registerSchema, loginSchema } = require("../validations/user.validation");

const rateLimit = require("../middlewares/rateLimit.middleware");

const router = express.Router();

// Brute-force protection for credential endpoints: 10 attempts / 15 min per IP.
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });

router.post("/register", authLimiter, validate(registerSchema), controller.register);
router.post("/login", authLimiter, validate(loginSchema), controller.login);
router.get("/me", authenticate, controller.getMe);

module.exports = router;
