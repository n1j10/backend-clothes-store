const productModel = require("../models/product.model");
const imageService = require("./image.service");
const ApiError = require("../utils/ApiError");

const getFeatured = () => productModel.findFeatured();

const getAll = ({ search, category, gender }) =>
  productModel.findMany({
    search,
    categoryTitle: category,
    gender,
  });

const getById = async (productId) => {
  const product = await productModel.findById(productId);
  if (!product) throw ApiError.notFound("Product not found");
  return product;
};

const getMine = (userId) => productModel.findByOwner(userId);

const create = async ({ data, image, userId }) => {
  if (!image) throw ApiError.badRequest("Product image is required");

  return productModel.create({
    ...data,
    image: imageService.toPublicUrl(image.filename),
    userId,
  });
};

const update = async (productId, data) => {
  await getById(productId);
  return productModel.update(productId, data);
};

const updateImage = async (productId, image) => {
  if (!image) throw ApiError.badRequest("Product image is required");

  const product = await getById(productId);
  const updated = await productModel.update(productId, {
    image: imageService.toPublicUrl(image.filename),
  });
  await imageService.deleteImage(product.image);
  return updated;
};

const remove = async (productId) => {
  const product = await getById(productId);
  await productModel.remove(productId);
  await imageService.deleteImage(product.image);
};

module.exports = { getFeatured, getAll, getById, getMine, create, update, updateImage, remove };
