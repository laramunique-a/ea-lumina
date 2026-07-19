const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function check() {
  try {
    console.log('Querying TherapistProfile...');
    const prof = await prisma.therapistProfile.findFirst();
    console.log('prof result:', prof ? prof.id : 'none');

    console.log('Querying CosmicContentGeneration...');
    const gen = await prisma.cosmicContentGeneration.findFirst();
    console.log('gen result:', gen ? 'found' : 'none');

  } catch (err) {
    console.log('[ERROR]', err.message);
  } finally {
    await prisma.$disconnect();
  }
}
check();
