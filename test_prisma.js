const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function test() {
  try {
    const fakeUser = await prisma.user.create({
      data: {
        name: 'Test',
        email: 'test_' + Date.now() + '@test.com',
        password: '123'
      }
    });

    await prisma.therapistProfile.create({
      data: {
        userId: fakeUser.id,
        price: 0
      }
    });
    console.log('Success!');
  } catch (e) {
    console.error(e.message);
  } finally {
    await prisma.$disconnect();
  }
}
test();
