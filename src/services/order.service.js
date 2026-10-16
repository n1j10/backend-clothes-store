const orderModel = require("../models/order.model");
const cartService = require("./cart.service");
const ApiError = require("../utils/ApiError");

// Port of createOrderAction(). The ZainCash redirect is replaced by a plain
// order record; paying it is a separate endpoint.
const createFromCart = async (user) => {

  const cart = await cartService.getOrCreateCart(user.id, { errorOnFailure: true });

  const currentCart = await cartService.recalculateTotals(cart);

  if (currentCart.cartItems.length === 0) throw ApiError.badRequest("Cart is empty");

  const order = await orderModel.create({
    userId: user.id,
    email: user.email,
    products: currentCart.numItemsInCart,
    orderTotal: currentCart.orderTotal,
    tax: currentCart.tax,
    shipping: currentCart.shipping,
  });

  await cartService.clear(currentCart.id);
  await cartService.recalculateTotals(currentCart);

  return order;
};

const pay = async (userId, orderId) => {
  const order = await orderModel.findOneByUser(orderId, userId);
  if (!order) throw ApiError.notFound("Order not found");
  if (order.isPaid) throw ApiError.badRequest("Order is already paid");

  return orderModel.markAsPaid(order.id);
};

const getMine = (userId) => orderModel.findByUser(userId);

const getAll = () => orderModel.findAll();

module.exports = { createFromCart, pay, getMine, getAll };
