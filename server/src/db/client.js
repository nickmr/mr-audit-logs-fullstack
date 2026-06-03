const { PrismaClient } = require('@prisma/client');

let prismaClient = null;

function getPrismaClient() {
  if (prismaClient === null) {
    prismaClient = new PrismaClient();
  }
  return prismaClient;
}

module.exports = { getPrismaClient };
