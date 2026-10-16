const cartModel = require("../models/cart.model");
const productService = require("./product.service");
const ApiError = require("../utils/ApiError");

const countItems = async (userId) => {
  const cart = await cartModel.countItems(userId);
  return cart?.numItemsInCart || 0;
};

// Port of fetchOrCreateCart().
const getOrCreateCart = async (userId, { errorOnFailure = false } = {}) => {
  const cart = await cartModel.findByUser(userId);
  if (cart) return cart;
  if (errorOnFailure) throw ApiError.notFound("Cart not found");
  return cartModel.create(userId);
};

// Port of updateCart(): recalculates the stored totals from the cart items.
const recalculateTotals = async (cart) => {
  const cartItems = await cartModel.findItems(cart.id);

  let numItemsInCart = 0;
  let cartTotal = 0;
  for (const item of cartItems) {
    numItemsInCart += item.amount;
    cartTotal += item.amount * item.product.price;
  }

  const tax = Math.round(cartTotal * cart.taxRate);
  const shipping = cartTotal === 0 ? 0 : cart.shipping;
  const orderTotal = cartTotal + tax + shipping;

  return cartModel.updateTotals(cart.id, { numItemsInCart, cartTotal, tax, orderTotal });
};

const getCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  return recalculateTotals(cart);
};

const addItem = async (userId, { productId, amount, size, color }) => {

  const product = await productService.getById(productId);

  if (product.sizes.length && !product.sizes.includes(size)) {
    throw ApiError.badRequest("Please choose a valid size");
  }
  if (product.colors.length && !product.colors.includes(color)) {
    throw ApiError.badRequest("Please choose a valid color");
  }

  const cart = await getOrCreateCart(userId);

  // The same product in a different size/color is a separate cart line.
  const existingItem = await cartModel.findItem(cart.id, productId, size ?? null, color ?? null);

  if (existingItem) {
    await cartModel.updateItem(existingItem.id, cart.id, {
      amount: existingItem.amount + amount,
    });
  } else {
    await cartModel.createItem({ cartId: cart.id, productId, amount, size, color });
  }

  return recalculateTotals(cart);
};






const updateItemAmount = async (userId, { cartItemId, amount }) => {
  const cart = await getOrCreateCart(userId, { errorOnFailure: true });

  await cartModel.updateItem(cartItemId, cart.id, { amount });

  return recalculateTotals(cart);
};

const removeItem = async (userId, cartItemId) => {
  const cart = await getOrCreateCart(userId, { errorOnFailure: true });

  await cartModel.removeItem(cartItemId, cart.id);
  
  return recalculateTotals(cart);
};

const clear = async (cartId) => cartModel.clearItems(cartId);

module.exports = {
  countItems,
  getOrCreateCart,
  recalculateTotals,
  getCart,
  addItem,
  updateItemAmount,
  removeItem,
  clear,
};
