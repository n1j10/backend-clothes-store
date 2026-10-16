const reviewModel = require("../models/review.model");
const productService = require("./product.service");
const ApiError = require("../utils/ApiError");

const create = async (user, { productId, rating, comment }) => {
  await productService.getById(productId);

  const existing = await reviewModel.findOne(user.id, productId);
  if (existing) throw ApiError.conflict("You already reviewed this product");

  return reviewModel.create({ productId, rating, comment, userId: user.id });
};



const getByProduct = async (productId) => {
  await productService.getById(productId);
  return reviewModel.findByProduct(productId);
};

const getMine = (userId) => reviewModel.findByUser(userId);

const getAll = () => reviewModel.findAll();

const remove = async (userId, reviewId) => {
  const review = await reviewModel.findById(reviewId);
  if (!review) throw ApiError.notFound("Review not found");
  if (review.userId !== userId) 
    throw ApiError.forbidden("You can only delete your own review");

  await reviewModel.remove(reviewId);
};

module.exports = { create, getByProduct, getMine, getAll, remove };
