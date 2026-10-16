const express = require("express");
const controller = require("../controllers/favorite.controller");
const { authenticate, optionalAuth } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/status/:productId", optionalAuth, controller.getStatus);
router.get("/", authenticate, controller.getMine);
router.post("/toggle/:productId", authenticate, controller.toggle);

module.exports = router;
