const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function check() {
  try {
    console.log('Querying cosmicWeek...');
    const latestWeek = await prisma.cosmicWeek.findFirst({
      orderBy: { createdAt: 'desc' },
    });
    console.log('cosmicWeek result:', latestWeek);
  } catch (err) {
    console.log('[ERROR cosmicWeek]', err.message);
  } finally {
    await prisma.$disconnect();
  }
}
check();
