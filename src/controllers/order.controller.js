const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const orderService = require("../services/order.service");

const create = asyncHandler(async (req, res) => {
  const order = await orderService.createFromCart(req.user);
  sendSuccess(res, 201, order, "Order created");
});

const pay = asyncHandler(async (req, res) => {
  const order = await orderService.pay(req.user.id, req.params.id);
  sendSuccess(res, 200, order, "Order paid");
});

const getMine = asyncHandler(async (req, res) => {
  const orders = await orderService.getMine(req.user.id);
  sendSuccess(res, 200, orders);
});

const getAll = asyncHandler(async (req, res) => {
  const orders = await orderService.getAll();
  sendSuccess(res, 200, orders);
});

module.exports = { create, pay, getMine, getAll };
