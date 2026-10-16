const test = require("node:test");
const assert = require("node:assert/strict");
const { productSchema } = require("../src/validations/product.validation");

const validDescription = Array.from({ length: 12 }, () => "word").join(" ");

test("accepts a valid product", () => {
  const result = productSchema.safeParse({
    name: "Oak chair",
    description: validDescription,
    price: "120",
    featured: "true",
  });

  assert.equal(result.success, true);
  assert.equal(result.data.price, 120);
  assert.equal(result.data.featured, true);
});

test("rejects a short name", () => {
  const result = productSchema.safeParse({
    name: "Oak",
    description: validDescription,
    price: 120,
  });

  assert.equal(result.success, false);
});

test("rejects a description with too few words", () => {
  const result = productSchema.safeParse({
    name: "Oak chair",
    description: "too short",
    price: 120,
  });

  assert.equal(result.success, false);
});
