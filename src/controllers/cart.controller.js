const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const cartService = require("../services/cart.service");

const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user.id);
  sendSuccess(res, 200, cart);
});

// Public: guests simply get 0, like fetchCartItems() did.
const countItems = asyncHandler(async (req, res) => {
  const count = req.user ? await cartService.countItems(req.user.id) : 0;
  sendSuccess(res, 200, { numItemsInCart: count });
});

const addItem = asyncHandler(async (req, res) => {
  const cart = await cartService.addItem(req.user.id, req.body);
  sendSuccess(res, 201, cart, "Item added to cart");
});

const updateItem = asyncHandler(async (req, res) => {
  const cart = await cartService.updateItemAmount(req.user.id, {
    cartItemId: req.params.itemId,
    amount: req.body.amount,
  });
  sendSuccess(res, 200, cart, "Cart updated");
});

const removeItem = asyncHandler(async (req, res) => {
  const cart = await cartService.removeItem(req.user.id, req.params.itemId);
  sendSuccess(res, 200, cart, "Item removed from cart");
});

module.exports = { getCart, countItems, addItem, updateItem, removeItem };
