const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const allUsers = await prisma.user.findMany();
  console.log(JSON.stringify(allUsers, null, 2));
  await prisma.$disconnect();
}
check();
