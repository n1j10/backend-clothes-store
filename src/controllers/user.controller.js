const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const userService = require("../services/user.service");

const register = asyncHandler(async (req, res) => {
  const result = await userService.register(req.body);
  sendSuccess(res, 201, result, "Account created");
});

const login = asyncHandler(async (req, res) => {
  const result = await userService.login(req.body);
  sendSuccess(res, 200, result, "Logged in");
});

const getMe = asyncHandler(async (req, res) => {
  const user = await userService.getProfile(req.user.id);
  sendSuccess(res, 200, user);
});

module.exports = { register, login, getMe };
