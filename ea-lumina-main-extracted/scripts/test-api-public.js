const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const params = { id: 'cmqmqp8xj0001x8xubrrhmrzx' } // Lara Munique Profile ID

  const profile = await prisma.therapistProfile.findUnique({
    where: {
      id: params.id,
      approved: true,
      user: { active: true },
    },
    include: {
      user: {
        select: { id: true, name: true, avatarUrl: true, phone: true },
      },
      availability: {
        select: { dayOfWeek: true, startTime: true, endTime: true, slotDuration: true, date: true, active: true },
      },
      services: {
        where: { active: true },
        select: {
          id: true,
          name: true,
          description: true,
          problemsHelped: true,
          durationMinutes: true,
          price: true,
          promoPrice: true,
          currency: true,
          modality: true,
          packages: {
            where: { active: true },
            select: {
              id: true,
              name: true,
              sessionCount: true,
              price: true,
              expirationDays: true,
              isMultiTherapy: true,
              allowedServices: true,
            },
          },
        },
      },
    }
  })

  if (!profile) {
    console.log('Profile not found or not approved!')
    return
  }

  console.log('API output availability:')
  console.log(JSON.stringify(profile.availability, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
