const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const favoriteService = require("../services/favorite.service");

const getMine = asyncHandler(async (req, res) => {
  const favorites = await favoriteService.getMine(req.user.id);
  sendSuccess(res, 200, favorites);
});

const getStatus = asyncHandler(async (req, res) => {
  const favoriteId = await favoriteService.getFavoriteId(req.user?.id, req.params.productId);
  sendSuccess(res, 200, { favoriteId, favorited: Boolean(favoriteId) });
});

const toggle = asyncHandler(async (req, res) => {
  const result = await favoriteService.toggle(req.user.id, req.params.productId);
  sendSuccess(res, 200, { favorited: result.favorited }, result.message);
});

module.exports = { getMine, getStatus, toggle };
