import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const profile = await prisma.therapistProfile.findFirst({
    where: {
      approved: true,
      user: { active: true },
      certificates: { some: {} }
    },
    include: {
      user: true,
      certificates: true
    }
  })

  if (!profile) {
    console.log('No approved therapist with certificates found in DB.')
    // Let's print any therapist or certificates in DB
    const anyCert = await prisma.therapistCertificate.findFirst({
      include: { therapist: { include: { user: true } } }
    })
    console.log('Any cert in DB:', anyCert)
    return
  }

  console.log(`Found therapist: ${profile.user.name} (${profile.id})`)
  console.log('Original certificates from DB:')
  console.log(profile.certificates)

  // Fetch the public API endpoint
  const url = `http://localhost:3000/api/therapists/${profile.id}/public`
  console.log(`Fetching: ${url}`)
  try {
    const res = await fetch(url)
    const data = await res.json()
    console.log('API response certificates:')
    console.log(data?.data?.certificates)
  } catch (err) {
    console.error('Failed to fetch from local API:', err)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
