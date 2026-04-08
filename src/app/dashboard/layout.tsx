export const dynamic = 'force-dynamic'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Header } from '@/components/dashboard/Header'
import { getServerSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * Sessão no dashboard: primeiro tenta headers do middleware (match mais rápido).
 * Na Vercel, em alguns fluxos os headers customizados do middleware não chegam ao
 * Server Component; aí usamos o cookie httpOnly + JWT (mesma lógica das API routes).
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const headersList = headers()
  let userId = headersList.get('x-user-id')
  let userRole = headersList.get('x-user-role')
  let userEmail = headersList.get('x-user-email')
  let userName = headersList.get('x-user-name')

  if (!userId || !userRole) {
    const session = await getServerSession()
    if (session) {
      userId = session.sub
      userRole = session.role
      userEmail = session.email
      userName = session.name
    }
  }

  if (!userId || !userRole) {
    redirect('/login')
  }

  // Busca o avatarUrl do banco de dados (Prisma)
  let avatarUrl = null
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatarUrl: true }
    })
    avatarUrl = user?.avatarUrl
  }

  return (
    /*
     * Mobile-first layout:
     * - md-: Sidebar renderiza a barra inferior fixa; main recebe pb-16 para não
     *        ficar tapado pela barra. Largura total em coluna única.
     * - md+: Sidebar volta para coluna lateral; main ocupa o resto horizontal.
     */
    <div className="flex h-screen overflow-hidden bg-[#FAFAF9]">
      <Sidebar
        userName={userName || 'Usuário'}
        userRole={userRole || 'PACIENTE'}
        userEmail={userEmail || ''}
        avatarUrl={avatarUrl}
      />
      {/* pb-16 = espaço para a barra de navegação inferior no mobile */}
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0 flex flex-col">
        <Header 
          userName={userName || 'Usuário'}
          userRole={userRole || 'PACIENTE'}
          avatarUrl={avatarUrl}
        />
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  )
}
