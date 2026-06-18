const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clean() {
  const deletedAppointments = await prisma.appointment.deleteMany({
    where: {
      patientPackage: {
        package: {
          name: {
            contains: 'E2E Test Package'
          }
        }
      }
    }
  });
  console.log('Deleted appointments using packages:', deletedAppointments);

  const patientPackages = await prisma.patientPackage.deleteMany({
    where: {
      package: {
        name: {
          contains: 'E2E Test Package'
        }
      }
    }
  });
  console.log('Deleted patient packages:', patientPackages);

  const therapyPackages = await prisma.therapyPackage.deleteMany({
    where: {
      name: {
        contains: 'E2E Test Package'
      }
    }
  });
  console.log('Deleted therapy packages:', therapyPackages);
}

clean().catch(console.error).finally(() => prisma.$disconnect());
