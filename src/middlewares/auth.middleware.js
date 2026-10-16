const jwt = require("jsonwebtoken");
const config = require("../config");
const ApiError = require("../utils/ApiError");
const userModel = require("../models/user.model");

// Replaces Clerk's getAuthUser(): reads "Authorization: Bearer <token>".
const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) {
      throw ApiError.unauthorized("Login required");
    }

    const payload = jwt.verify(header.slice(7), config.jwt.secret);
    const user = await userModel.findById(payload.sub);
    if (!user) throw ApiError.unauthorized("Login required");

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      return next(ApiError.unauthorized("Invalid or expired token"));
    }
    next(error);
  }
};

// Replaces getAdminUser().
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return next(ApiError.forbidden("Admins only"));
  }
  next();
};

// For endpoints that work with or without a user (e.g. cart count, favorite id).
const optionalAuth = async (req, res, next) => {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) return next();

  try {
    const payload = jwt.verify(header.slice(7), config.jwt.secret);
    req.user = await userModel.findById(payload.sub);
  } catch {
    req.user = undefined;
  }
  next();
};

module.exports = { authenticate, requireAdmin, optionalAuth };
