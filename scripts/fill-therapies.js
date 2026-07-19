const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Lista padrão de terapias baseada no sistema
const therapies = [
  'Acupuntura', 'Reiki', 'Yoga', 'Meditação', 'ThetaHealing', 
  'Constelação Familiar', 'Hipnoterapia', 'Florais de Bach', 
  'Ayurveda', 'Psicoterapia Holística', 'Cromoterapia', 
  'Cristaloterapia', 'Barras de Access', 'Terapia Corporal'
]

async function main() {
  console.log('--- Populando Catálogo de Terapias ---')
  
  for (const name of therapies) {
    const slug = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-')
    
    await prisma.therapyType.upsert({
      where: { name },
      update: {},
      create: {
        name,
        slug,
        active: true,
        sortOrder: 0
      }
    })
    console.log(`+ ${name} adicionado/verificado`)
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
