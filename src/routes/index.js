const express = require("express");

const router = express.Router();

router.get("/health", (req, res) => res.json({ status: "ok" }));

router.use("/users", require("./user.routes"));
router.use("/products", require("./product.routes"));
router.use("/cart", require("./cart.routes"));
router.use("/orders", require("./order.routes"));
router.use("/reviews", require("./review.routes"));
router.use("/favorites", require("./favorite.routes"));

module.exports = router;
