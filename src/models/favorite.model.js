const { prisma } = require("../config/db");

const findOne = (userId, productId) =>
  prisma.favorite.findFirst({
    where: {
      userId, 
      productId
    },
    select: { id: true }
  });

const findByUser = (userId) =>
  prisma.favorite.findMany({
    where: { userId },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });


  
const create = (userId, productId) => prisma.favorite.create({
  data: {
    userId,
    productId
  }
});

const remove = (id) => prisma.favorite.delete({
  where: { id }
});

module.exports = { findOne, findByUser, create, remove };
