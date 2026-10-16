const { z } = require("zod");

const listField = z
  .union([z.string(), z.array(z.string())])
  .transform((value) =>
    (Array.isArray(value) ? value : value.split(","))
      .map((item) => item.trim())
      .filter(Boolean),
  )
  .default([]);

// Ported from utils/schema.ts (productSchema).
const productSchema = z.object({
  name: z
    .string()
    .min(4, "Name must be at least 4 characters long")
    .max(30, "Name must be at most 30 characters long"),

  description: z.string().refine((description) => {
    const wordCount = description.trim().split(/\s+/).length;
    return wordCount >= 10 && wordCount <= 500;
  }, "Description must be between 10 and 500 words"),

  price: z.coerce.number().int().min(0, "Price must be a positive number"),

  featured: z.coerce.boolean().default(false),

  gender: z.enum(["MEN", "WOMEN", "KIDS"]).default("MEN"),

  // multipart forms send "S, M, L" — JSON bodies may send an array.
  sizes: listField,
  colors: listField,
});

const updateProductSchema = productSchema.partial();

const listProductsSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  gender: z.enum(["MEN", "WOMEN", "KIDS"]).optional(),
});

module.exports = { productSchema, updateProductSchema, listProductsSchema };
