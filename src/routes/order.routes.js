const express = require("express");
const controller = require("../controllers/order.controller");
const { authenticate, requireAdmin } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authenticate);
router.post("/", controller.create);
router.get("/", controller.getMine);
router.post("/:id/pay", controller.pay);
router.get("/all", requireAdmin, controller.getAll);

module.exports = router;
