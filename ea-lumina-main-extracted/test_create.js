const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function check() {
  try {
    const prof = await prisma.therapistProfile.findFirst();
    if (!prof) {
      console.log('No prof');
      return;
    }

    const savedGeneration = await prisma.cosmicContentGeneration.create({
      data: {
        therapistId: prof.id,
        contentType: 'Story (Sequência)',
        theme: 'Prosperidade',
        title: `Post sobre Prosperidade`,
        copy: 'copy',
        hashtags: ['#teste'],
        cta: 'cta',
        imagePrompt: 'prompt',
        imageUrl: 'url',
        cosmicContext: 'context',
      },
    });
    console.log('Success:', savedGeneration.id);

  } catch (err) {
    console.log('[ERROR]', err.message);
  } finally {
    await prisma.$disconnect();
  }
}
check();
