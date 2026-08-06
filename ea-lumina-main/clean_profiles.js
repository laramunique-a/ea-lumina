const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanUp() {
  const result = await prisma.therapistProfile.deleteMany({
    where: {
      user: {
        role: {
          not: 'TERAPEUTA'
        }
      }
    }
  });
  console.log('Cleaned up profiles:', result.count);
}

cleanUp().catch(console.error).finally(() => prisma.$disconnect());
