const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const user = await prisma.user.findUnique({
    where: { id: "cmpdd1n8u0000enr8g1fidlxf" },
    include: { therapistProfile: true }
  });
  console.log(JSON.stringify(user, null, 2));
}

check().catch(console.error).finally(() => prisma.$disconnect());
