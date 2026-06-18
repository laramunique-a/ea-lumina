import { prisma } from '../src/lib/prisma.js'

async function main() {
  const therapists = await prisma.therapistProfile.findMany({
    where: {
      approved: true,
      user: { active: true },
    },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      services: {
        where: { active: true },
        include: {
          packages: { where: { active: true } },
        },
      },
    },
  })
  console.log(JSON.stringify(therapists, null, 2))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
