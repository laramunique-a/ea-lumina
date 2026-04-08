import { PrismaClient, Role, Modality, AppointmentStatus, Gender } from '@prisma/client'
import bcrypt from 'bcryptjs'
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

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando seed do banco de dados EALumini...')

  // Limpar dados existentes (ordem importa por causa das FK)
  await prisma.notification.deleteMany()
  await prisma.review.deleteMany()
  await prisma.appointment.deleteMany()
  await prisma.patientPackage.deleteMany()
  await prisma.therapyPackage.deleteMany()
  await prisma.therapistCertificate.deleteMany()
  await prisma.therapistPaymentMethod.deleteMany()
  await prisma.therapistPaymentDetails.deleteMany()
  await prisma.therapistMarketingMaterial.deleteMany()
  await prisma.therapistTargetAudience.deleteMany()
  await prisma.therapistAIConfig.deleteMany()
  await prisma.therapistAdminData.deleteMany()
  await prisma.therapistConsent.deleteMany()
  await prisma.therapistService.deleteMany()
  await prisma.availability.deleteMany()
  await prisma.therapistProfile.deleteMany()
  await prisma.patientProfile.deleteMany()
  await prisma.refreshToken.deleteMany()
  await prisma.user.deleteMany()
  await prisma.therapyType.deleteMany()
  await prisma.platformConfig.deleteMany()

  // ==========================================
  // CONFIGURAÇÃO DA PLATAFORMA
  // ==========================================
  const config = await prisma.platformConfig.create({
    data: {
      commissionRate: 10.00,
      maintenanceMode: false,
      allowNewSignups: true,
    },
  })
  console.log('Platform config criada:', config.id)

  // ==========================================
  // TIPOS DE TERAPIA (catálogo global) — lista em src/constants/therapies.ts
  // ==========================================
  const slugify = (raw: string) =>
    raw
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'terapia'

  let sortOrder = 0
  for (const name of SEED_THERAPY_TYPE_NAMES) {
    const base = slugify(name)
    let slug = base
    let n = 0
    while (await prisma.therapyType.findUnique({ where: { slug } })) {
      n += 1
      slug = `${base}-${n}`
    }
    await prisma.therapyType.create({
      data: { name, slug, sortOrder: sortOrder++, active: true },
    })
  }
  console.log('Tipos de terapia (seed):', SEED_THERAPY_TYPE_NAMES.length)

  // ==========================================
  // USUÁRIO ADMIN
  // ==========================================
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin EALumini',
      email: 'admin@ealumini.com',
      password: await bcrypt.hash('Admin@123', 12),
      role: Role.ADMIN,
      active: true,
    },
  })
  console.log('Admin criado:', adminUser.email)

  // ==========================================
  // SEED CONCLUÍDO
  // ==========================================
  console.log('\nSistema inicializado com sucesso!')
  console.log('\nCredenciais do Administrador:')
  console.log('   Admin: admin@ealumini.com | Admin@123')
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
