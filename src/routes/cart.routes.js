const express = require("express");
const controller = require("../controllers/cart.controller");
const validate = require("../middlewares/validate.middleware");
const { authenticate, optionalAuth } = require("../middlewares/auth.middleware");
const { addItemSchema, updateItemSchema } = require("../validations/cart.validation");

const router = express.Router();

router.get("/count", optionalAuth, controller.countItems);

router.use(authenticate);
router.get("/", controller.getCart);
router.post("/items", validate(addItemSchema), controller.addItem);
router.patch("/items/:itemId", validate(updateItemSchema), controller.updateItem);
router.delete("/items/:itemId", controller.removeItem);

module.exports = router;
