const { z } = require("zod");

// Ported from utils/schema.ts (reviewSchema). The author fields are gone:
// they now come from the logged-in user.
const reviewSchema = z.object({
  productId: z.string().uuid("Product id is not valid"),
  rating: z.coerce
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  comment: z
    .string()
    .min(10, "Comment must be at least 10 characters long")
    .max(100, "Comment must be at most 100 characters long"),
});

module.exports = { reviewSchema };
