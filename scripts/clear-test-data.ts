import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function clearDatabase() {
  console.log('Iniciando limpeza do banco de dados...')

  try {
    // Apagar todos os agendamentos
    await prisma.appointment.deleteMany()
    console.log('- Agendamentos deletados.')

    // Apagar avaliações e reviews
    await prisma.review.deleteMany()
    console.log('- Avaliações deletadas.')

    // Apagar pacotes
    await prisma.patientPackage.deleteMany()
    await prisma.therapyPackage.deleteMany()
    console.log('- Pacotes de terapia deletados.')

    // Apagar disponibilidade e configurações
    await prisma.availability.deleteMany()
    await prisma.therapistService.deleteMany()
    await prisma.therapistConsent.deleteMany()
    await prisma.therapistAdminData.deleteMany()
    await prisma.therapistAIConfig.deleteMany()
    await prisma.therapistTargetAudience.deleteMany()
    await prisma.therapistMarketingMaterial.deleteMany()
    await prisma.therapistPaymentMethod.deleteMany()
    await prisma.therapistPaymentDetails.deleteMany()
    await prisma.therapistCertificate.deleteMany()
    console.log('- Configurações de terapeutas deletadas.')

    // Apagar perfis e notificações
    await prisma.therapistProfile.deleteMany()
    await prisma.patientProfile.deleteMany()
    await prisma.notification.deleteMany()
    await prisma.refreshToken.deleteMany()
    console.log('- Perfis e tokens deletados.')

    // Apagar tipos de terapia (serão recriados os oficiais depois)
    await prisma.therapyType.deleteMany()
    console.log('- Tipos de terapias deletados.')

    // Apagar todos os usuários que não são ADMIN
    const result = await prisma.user.deleteMany({
      where: {
        role: {
          not: 'ADMIN'
        }
      }
    })
    console.log(`- Usuários de teste deletados: ${result.count} contas removidas.`)

    console.log('✅ Banco de dados zerado com sucesso! (Admin preservado)')

  } catch (error) {
    console.error('Erro durante a limpeza:', error)
  } finally {
    await prisma.$disconnect()
  }
}

clearDatabase()
