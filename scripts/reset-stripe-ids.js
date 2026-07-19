const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('--- INICIANDO LIMPEZA DE IDS STRIPE ANTIGOS ---')

  // 1. Limpar contas conectadas dos terapeutas
  const therapistDetailsCount = await prisma.therapistPaymentDetails.updateMany({
    data: {
      stripeAccountId: null,
    },
  })
  console.log(`- Contas Stripe de Terapeutas (stripeAccountId) limpas: ${therapistDetailsCount.count}`)

  // 2. Limpar IDs de clientes Stripe de pacientes
  const patientProfilesCount = await prisma.patientProfile.updateMany({
    data: {
      stripeCustomerId: null,
    },
  })
  console.log(`- IDs de Clientes Stripe (stripeCustomerId) limpos: ${patientProfilesCount.count}`)

  // 3. Limpar IDs de transações Stripe de agendamentos pendentes ou antigos
  const appointmentsCount = await prisma.appointment.updateMany({
    data: {
      stripePaymentIntentId: null,
    },
  })
  console.log(`- Transações de Agendamentos (stripePaymentIntentId) limpas: ${appointmentsCount.count}`)

  console.log('--- LIMPEZA CONCLUÍDA COM SUCESSO ---')
}

main()
  .catch((e) => {
    console.error('Erro ao limpar banco de dados:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
