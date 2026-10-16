const { prisma } = require("../config/db");

const findFeatured = () => prisma.product.findMany({
  where: { featured: true }
});

const findMany = ({ search = "", categoryTitle, gender } = {}) =>
  prisma.product.findMany({
    where: {
      ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
      ...(gender ? { gender } : {}),
      ...(categoryTitle ? { categories: { some: { title: categoryTitle } } } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

const findById = (id) =>
  prisma.product.findUnique({
    where: { id },
    include: { categories: true },
  });

const findByOwner = (userId) =>
  prisma.product.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });

const create = (data) => prisma.product.create({ data });

const update = (id, data) => prisma.product.update({
  where: { id },
  data
});

const remove = (id) => prisma.product.delete({ where: { id } });

module.exports = { findFeatured, findMany, findById, findByOwner, create, update, remove };
