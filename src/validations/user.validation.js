const { z } = require("zod");

const registerSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(30, "Name must be at most 30 characters long"),
  email: z.string().email("Email is not valid"),
  // bcrypt ignores bytes after 72, so cap the length explicitly.
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(72, "Password must be at most 72 characters long"),
});

const loginSchema = z.object({
  email: z.string().email("Email is not valid"),
  password: z.string().min(1, "Password is required").max(72, "Password is too long"),
});

module.exports = { registerSchema, loginSchema };
