const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('--- Verificando Tipos de Terapia ---')
  const counts = await prisma.therapyType.count()
  console.log('Total de registros:', counts)
  
  if (counts > 0) {
    const items = await prisma.therapyType.findMany({
      select: { name: true, active: true }
    })
    console.log('Itens encontrados:', items)
  } else {
    console.log('AVISO: A tabela therapy_types está vazIA.')
  }
}

main()
  .catch(e => console.error('ERRO NO TESTE:', e))
  .finally(async () => await prisma.$disconnect())
