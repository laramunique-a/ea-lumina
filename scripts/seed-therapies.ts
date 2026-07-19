import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const SEED_THERAPY_TYPE_NAMES = [
  'ThetaHealing',
  'Terapias energéticas',
  'Reiki',
  'Registros Akáshicos',
  'Cura quântica',
  'Terapia emocional',
  'Terapia espiritual',
  'Constelações familiares',
  'Coaching',
  'Hipnose',
  'Biomagnetismo',
]

function slugify(raw: string): string {
  return (
    raw
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'terapia'
  )
}

async function main() {
  for (let i = 0; i < SEED_THERAPY_TYPE_NAMES.length; i++) {
    const name = SEED_THERAPY_TYPE_NAMES[i]
    const base = slugify(name)
    let slug = base
    let n = 0

    await prisma.therapyType.create({
      data: { name, slug, sortOrder: i, active: true },
    })
    console.log('Criado:', name)
  }

  console.log('Terapias oficiais restauradas com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
