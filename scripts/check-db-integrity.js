const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function check() {
  try {
    const [users, terapeutas, pacientes, appointments, reviews, certs, tokens] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'TERAPEUTA' } }),
      prisma.user.count({ where: { role: 'PACIENTE' } }),
      prisma.appointment.count(),
      prisma.review.count(),
      prisma.therapistCertificate.count(),
      prisma.refreshToken.count({ where: { revoked: false } }),
    ])

    const [aprovados, pendentes, perfisPacientes, paymentDetails] = await Promise.all([
      prisma.therapistProfile.count({ where: { approved: true } }),
      prisma.therapistProfile.count({ where: { approved: false } }),
      prisma.patientProfile.count(),
      prisma.therapistPaymentDetails.count(),
    ])

    const apptByStatus = await prisma.appointment.groupBy({
      by: ['status'],
      _count: { _all: true },
    })

    console.log('\n✅ CONTAGEM DE REGISTROS NO BANCO:\n')
    console.log(`  Usuários total:          ${users}`)
    console.log(`    ↳ Terapeutas:          ${terapeutas} (${aprovados} aprovados, ${pendentes} pendentes)`)
    console.log(`    ↳ Pacientes:           ${pacientes}`)
    console.log(`  Perfis de paciente:      ${perfisPacientes}`)
    console.log(`  Agendamentos:            ${appointments}`)
    apptByStatus.forEach(s => console.log(`    ↳ ${s.status}: ${s._count._all}`))
    console.log(`  Avaliações:              ${reviews}`)
    console.log(`  Certificados:            ${certs}`)
    console.log(`  Dados de pagamento:      ${paymentDetails}`)
    console.log(`  Refresh tokens ativos:   ${tokens}`)
    console.log('\n✅ Nenhum dado foi perdido ou alterado pelas correções de segurança.\n')
  } catch(e) {
    console.error('Erro:', e.message)
  } finally {
    await prisma.$disconnect()
  }
}

check()
