import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const subjectsToKeep = [
    'Teste de Envio EA',
    'Teste Template',
    'dasdsa'
  ]

  console.log('Finding campaigns to delete...')
  
  const campaignsToDelete = await prisma.emailCampaign.findMany({
    where: {
      subject: {
        notIn: subjectsToKeep
      }
    }
  })

  console.log(`Found ${campaignsToDelete.length} campaigns to delete.`)

  const deleted = await prisma.emailCampaign.deleteMany({
    where: {
      subject: {
        notIn: subjectsToKeep
      }
    }
  })

  console.log(`Deleted ${deleted.count} campaigns.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
