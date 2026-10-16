const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
const tokenService = require("./token.service");
const ApiError = require("../utils/ApiError");

const SALT_ROUNDS = 10;

const register = async ({ email, password, name }) => {
  const existing = await userModel.findByEmailWithPassword(email);
  if (existing) throw ApiError.conflict("Email is already registered");

  const user = await userModel.create({
    email,
    name,
    password: await bcrypt.hash(password, SALT_ROUNDS),
  });

  return { user, token: tokenService.sign(user) };
};

const login = async ({ email, password }) => {
  const account = await userModel.findByEmailWithPassword(email);
  if (!account) throw ApiError.unauthorized("Email or password is incorrect");

  const passwordMatches = await bcrypt.compare(password, account.password);
  if (!passwordMatches) throw ApiError.unauthorized("Email or password is incorrect");

  const { password: _password, updatedAt: _updatedAt, ...user } = account;
  return { user, token: tokenService.sign(user) };
};

const getProfile = async (userId) => {
  const user = await userModel.findById(userId);
  if (!user) throw ApiError.notFound("User not found");
  return user;
};

module.exports = { register, login, getProfile };
