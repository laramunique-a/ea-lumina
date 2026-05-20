const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const users = await prisma.user.findMany({
    where: { role: 'TERAPEUTA' },
    include: { therapistProfile: true }
  });
  console.log(JSON.stringify(users, null, 2));

  const allProfiles = await prisma.therapistProfile.findMany();
  console.log('All profiles:', JSON.stringify(allProfiles, null, 2));
}

check().catch(console.error).finally(() => prisma.$disconnect());
