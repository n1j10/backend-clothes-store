const { z } = require("zod");

const addItemSchema = z.object({
  productId: z.string().uuid("Product id is not valid"),
  amount: z.coerce.number().int().min(1, "Amount must be at least 1"),
  size: z.string().trim().min(1).optional(),
  color: z.string().trim().min(1).optional(),
});

const updateItemSchema = z.object({
  amount: z.coerce.number().int().min(1, "Amount must be at least 1"),
});

module.exports = { addItemSchema, updateItemSchema };
