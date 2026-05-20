const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const users = await prisma.user.count();
  const therapists = await prisma.therapistProfile.count();
  console.log(`Users: ${users}, Therapists: ${therapists}`);
  const allProfiles = await prisma.therapistProfile.findMany({ include: { user: true } });
  console.log(JSON.stringify(allProfiles, null, 2));
  await prisma.$disconnect();
}
check();
