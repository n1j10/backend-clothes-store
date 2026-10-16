const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const reviewService = require("../services/review.service");

const create = asyncHandler(async (req, res) => {
  const review = await reviewService.create(req.user, req.body);
  sendSuccess(res, 201, review, "Review submitted");
});

const getByProduct = asyncHandler(async (req, res) => {
  const reviews = await reviewService.getByProduct(req.params.productId);
  sendSuccess(res, 200, reviews);
});

const getMine = asyncHandler(async (req, res) => {
  const reviews = await reviewService.getMine(req.user.id);
  sendSuccess(res, 200, reviews);
});

const getAll = asyncHandler(async (req, res) => {
  const reviews = await reviewService.getAll();
  sendSuccess(res, 200, reviews);
});

const remove = asyncHandler(async (req, res) => {
  await reviewService.remove(req.user.id, req.params.id);
  sendSuccess(res, 200, null, "Review removed");
});

module.exports = { create, getByProduct, getMine, getAll, remove };
