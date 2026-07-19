const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const therapists = await prisma.therapistProfile.findMany({
    include: {
      availability: true,
      user: true
    }
  })

  console.log(`Encontrados ${therapists.length} terapeutas:`)
  for (const t of therapists) {
    console.log(`- ID: ${t.id}, Nome: ${t.professionalName || t.user.name}, Email: ${t.user.email}`)
    console.log(`  Horários cadastrados (${t.availability.length}):`)
    t.availability.forEach(a => {
      console.log(`    * ID: ${a.id}, Dia: ${a.dayOfWeek}, Data: ${a.date}, Início: ${a.startTime}, Fim: ${a.endTime}, Ativo: ${a.active}`)
    })
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
