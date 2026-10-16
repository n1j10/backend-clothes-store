const express = require("express");
const controller = require("../controllers/product.controller");
const validate = require("../middlewares/validate.middleware");
const { authenticate, requireAdmin } = require("../middlewares/auth.middleware");
const { uploadImage } = require("../middlewares/upload.middleware");
const {
  productSchema,
  updateProductSchema,
  listProductsSchema,
} = require("../validations/product.validation");

const router = express.Router();

// Public
router.get("/", validate(listProductsSchema, "query"), controller.getAll);
router.get("/featured", controller.getFeatured);

// Admin
router.get("/mine", authenticate, requireAdmin, controller.getMine);
router.post(
  "/",
  authenticate,
  requireAdmin,
  uploadImage,
  validate(productSchema),
  controller.create,
);
router.patch(
  "/:id",
  authenticate,
  requireAdmin,
  validate(updateProductSchema),
  controller.update,
);
router.patch("/:id/image", authenticate, requireAdmin, uploadImage, controller.updateImage);
router.delete("/:id", authenticate, requireAdmin, controller.remove);

// Kept last so it does not swallow "/featured" and "/mine".
router.get("/:id", controller.getOne);

module.exports = router;
