import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Encontrar um terapeuta não aprovado
  const unapproved = await prisma.therapistProfile.findFirst({
    where: { approved: false, user: { active: true } },
    include: { user: true }
  })

  if (!unapproved) {
    console.log('Nenhum terapeuta não aprovado no banco. Criando um temporariamente para teste...')
    return
  }

  console.log(`Testando com terapeuta não aprovado: ${unapproved.user.name} (ID: ${unapproved.id})`)

  // Fazer requisição simulando visitante (sem cabeçalho de autenticação)
  const visitorRes = await fetch(`http://localhost:3000/api/therapists/${unapproved.id}/public`)
  const visitorData = await visitorRes.json()
  console.log('Como Visitante/Paciente (deve ser success: false ou 404):', visitorData)

  // Agora vamos rodar o servidor e verificar usando a API interna
  // Como o fetch comum em Node não tem a sessão do admin a menos que a gente passe um Cookie do Admin.
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
