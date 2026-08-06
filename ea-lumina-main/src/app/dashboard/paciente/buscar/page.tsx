import { SearchContainer } from '@/components/therapist/SearchContainer'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getInitialData() {
  const therapyTypes = await prisma.therapyType.findMany({
    where: { active: true },
    orderBy: { name: 'asc' },
    select: { name: true },
  })

  return {
    therapyOptions: therapyTypes.map((t) => t.name),
  }
}

export default async function BuscarTerapeutasPage() {
  const { therapyOptions } = await getInitialData()

  return (
    <div className="min-h-full">
      <SearchContainer initialTherapyOptions={therapyOptions} />
    </div>
  )
}
