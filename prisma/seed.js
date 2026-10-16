require("dotenv").config();
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const img = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200`;

const ADULT = ["S", "M", "L", "XL"];
const KIDS = ["2-3Y", "4-5Y", "6-7Y", "8-9Y"];
const SHOES = ["40", "41", "42", "43", "44"];

const products = [
  { name: "Classic Denim Jacket", price: 79, featured: true, gender: "MEN", sizes: ADULT, colors: ["Blue", "Black"], image: img(1124468), categories: ["jackets", "denim"], description: "A timeless denim jacket with a relaxed fit, button front and chest pockets for everyday layering." },
  { name: "Slim Fit Oxford Shirt", price: 45, featured: false, gender: "MEN", sizes: ADULT, colors: ["White", "Light Blue"], image: img(297933), categories: ["shirts"], description: "A crisp cotton oxford shirt with a slim cut that works for the office and weekends alike." },
  { name: "Leather Sneakers", price: 95, featured: true, gender: "MEN", sizes: SHOES, colors: ["White", "Black"], image: img(2529148), categories: ["shoes"], description: "Minimal leather sneakers with a cushioned sole, made to go with jeans, chinos or shorts." },
  { name: "Wool Overcoat", price: 189, featured: false, gender: "MEN", sizes: ADULT, colors: ["Camel", "Charcoal"], image: img(1043474), categories: ["coats"], description: "A warm wool blend overcoat with a tailored silhouette that keeps you sharp through winter." },
  { name: "Floral Summer Dress", price: 65, featured: true, gender: "WOMEN", sizes: ["XS", ...ADULT], colors: ["Pink", "Yellow"], image: img(985635), categories: ["dresses"], description: "A light flowing dress with a floral print and a flattering waist, perfect for warm days." },
  { name: "High Waist Jeans", price: 59, featured: false, gender: "WOMEN", sizes: ["XS", ...ADULT], colors: ["Blue", "Black"], image: img(1082529), categories: ["jeans", "denim"], description: "Stretch denim jeans with a high waist and straight leg that stay comfortable all day long." },
  { name: "Knit Sweater", price: 55, featured: true, gender: "WOMEN", sizes: ["XS", ...ADULT], colors: ["Cream", "Grey", "Beige"], image: img(1021693), categories: ["knitwear"], description: "A soft chunky knit sweater with a relaxed fit that pairs easily with jeans or skirts." },
  { name: "Leather Handbag", price: 120, featured: false, gender: "WOMEN", sizes: [], colors: ["Brown", "Black"], image: img(1152077), categories: ["bags", "accessories"], description: "A structured leather handbag with an inner zip pocket and a detachable shoulder strap." },
  { name: "Kids Hoodie", price: 29, featured: false, gender: "KIDS", sizes: KIDS, colors: ["Red", "Navy"], image: img(1619697), categories: ["hoodies"], description: "A cozy fleece lined hoodie with a front pocket that keeps little ones warm during play." },
  { name: "Kids Denim Overalls", price: 35, featured: false, gender: "KIDS", sizes: KIDS, colors: ["Blue"], image: img(1648377), categories: ["denim"], description: "Durable denim overalls with adjustable straps and roomy pockets for active kids." },
  { name: "Kids Running Shoes", price: 39, featured: true, gender: "KIDS", sizes: ["28", "30", "32", "34"], colors: ["Blue", "Pink"], image: img(1598505), categories: ["shoes"], description: "Lightweight running shoes with easy straps and a grippy sole made for the playground." },
  { name: "Kids Printed T-Shirt", price: 15, featured: false, gender: "KIDS", sizes: KIDS, colors: ["White", "Yellow", "Green"], image: img(1620760), categories: ["t-shirts"], description: "A soft cotton t-shirt with a playful print that holds up well wash after wash." },
];

const comments = [
  "Great quality, exactly as pictured.",
  "Fits true to size and feels very comfortable.",
  "The color is beautiful in person!",
  "Good value for the price.",
  "Delivery was fast and the fabric is soft.",
];

async function main() {
  console.log("Clearing existing data...");
  await prisma.$transaction([
    prisma.cartItem.deleteMany(),
    prisma.cart.deleteMany(),
    prisma.order.deleteMany(),
    prisma.review.deleteMany(),
    prisma.favorite.deleteMany(),
    prisma.category.deleteMany(),
    prisma.product.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  const password = await bcrypt.hash("password123", 10);
  const admin = await prisma.user.create({
    data: { email: "admin@store.com", password, name: "Admin", role: "ADMIN" },
  });
  const users = await Promise.all(
    ["john", "sara", "omar"].map((n) =>
      prisma.user.create({
        data: { email: `${n}@store.com`, password, name: n[0].toUpperCase() + n.slice(1) },
      })
    )
  );

  console.log("Creating products...");
  const created = [];
  for (const p of products) {
    created.push(
      await prisma.product.create({
        data: {
          name: p.name,
          description: p.description,
          price: p.price,
          featured: p.featured,
          gender: p.gender,
          sizes: p.sizes,
          colors: p.colors,
          image: p.image,
          userId: admin.id,
          categories: { create: p.categories.map((title) => ({ title })) },
        },
      })
    );
  }

  console.log("Creating reviews, favorites, orders...");
  for (const [i, user] of users.entries()) {
    for (let j = 0; j < 4; j++) {
      const product = created[(i * 4 + j) % created.length];
      await prisma.review.create({
        data: {
          userId: user.id,
          productId: product.id,
          rating: 3 + ((i + j) % 3),
          comment: comments[(i + j) % comments.length],
        },
      });
      if (j < 2) {
        await prisma.favorite.create({ data: { userId: user.id, productId: product.id } });
      }
    }

    const items = created.slice(i, i + 2);
    const cartTotal = items.reduce((s, p) => s + p.price, 0);
    const tax = Math.round(cartTotal * 0.1);
    await prisma.order.create({
      data: {
        userId: user.id,
        email: user.email,
        products: items.length,
        orderTotal: cartTotal + tax + 5,
        tax,
        shipping: 5,
        isPaid: true,
      },
    });
  }

  console.log(`Seeded ${users.length + 1} users and ${created.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
