const { z } = require("zod");

const registerSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(30, "Name must be at most 30 characters long"),
  email: z.string().email("Email is not valid"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const loginSchema = z.object({
  email: z.string().email("Email is not valid"),
  password: z.string().min(1, "Password is required"),
});

module.exports = { registerSchema, loginSchema };
