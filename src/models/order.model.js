const { prisma } = require("../config/db");

const create = (data) => prisma.order.create({ data });

const findByUser = (userId) =>
  prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });

const findOneByUser = (id, userId) => prisma.order.findFirst({
  where: {
    id, userId
  }
});

const findAll = () => prisma.order.findMany({
  orderBy: { createdAt: "desc" }
});

const markAsPaid = (id) => prisma.order.update({
  where: { id },
  data: {
    isPaid: true
  }
});

module.exports = { create, findByUser, findOneByUser, findAll, markAsPaid };
