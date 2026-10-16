const { prisma } = require("../config/db");

const publicFields = {
  id: true,
  email: true,
  name: true,
  imageUrl: true,
  role: true,
  createdAt: true,
};

const create = (data) => prisma.user.create({ data, select: publicFields });

const findById = (id) => prisma.user.findUnique({ where: { id }, select: publicFields });

// Includes the password hash, so it is only used when logging in.
const findByEmailWithPassword = (email) => prisma.user.findUnique({ where: { email } });

module.exports = { create, findById, findByEmailWithPassword, publicFields };
