const { prisma } = require("../config/db");

const author = { select: { id: true, name: true, imageUrl: true } };

const create = (data) => prisma.review.create({
  data,
  include: {
    user: author
  }
});

const findByProduct = (productId) =>
  prisma.review.findMany({
    where: { productId },
    include: { user: author },
    orderBy: { createdAt: "desc" },
  });

const findByUser = (userId) =>
  prisma.review.findMany({
    where: { userId },
    include: {
      product: {
        select: {
          id: true, name: true
        }
      }
    },
    orderBy: { createdAt: "desc" },
  });

const findById = (id) => prisma.review.findUnique({
  where: { id }
});

const findOne = (userId, productId) => prisma.review.findFirst({
  where: { userId, productId }
});

const findAll = () =>
  prisma.review.findMany({
    include: {
      product: {
        select: {
          id: true, name: true
        }
      }, user: author
    },
    orderBy: { createdAt: "desc" },
  });

const remove = (id) => prisma.review.delete({ where: { id } });

module.exports = { create, findById, findByProduct, findByUser, findOne, findAll, remove };
