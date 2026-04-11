import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { prisma } from '@/lib/prisma'
import StripeConnectButton from './stripe-connect-button'
import StripeDashboardButton from './stripe-dashboard-button'
import { cookies } from 'next/headers'
import * as jose from 'jose'

async function getUserServer() {
  const cookieStore = cookies()
  const token = cookieStore.get('accessToken')?.value
  if (!token) return null
  try {
    const defaultSecret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret')
    const { payload } = await jose.jwtVerify(token, defaultSecret)
    return payload as { sub: string, role: string }
  } catch (e) {
    return null
  }
}

export default async function FinanceiroPage() {
  const session = await getUserServer()
  if (!session || session.role !== 'TERAPEUTA') {
    return redirect('/login')
  }

  const therapist = await prisma.therapistProfile.findUnique({
    where: { userId: session.sub },
    include: { paymentDetails: true },
  })

  const stripeAccountId = therapist?.paymentDetails?.stripeAccountId

  // Calcular ganhos do mês (meramente ilustrativo para o painel)
  const today = new Date()
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  
  const [totalAppointments, thisMonthRevenueAggregation] = await Promise.all([
    prisma.appointment.count({
      where: { 
        therapistId: therapist?.id, 
        status: 'CONCLUIDO',
      }
    }),
    prisma.appointment.aggregate({
      _sum: {
        therapistNet: true,
      },
      where: {
        therapistId: therapist?.id,
        status: 'CONCLUIDO',
        date: { gte: firstDayOfMonth },
      }
    })
  ])

  const thisMonthEarnings = Number(thisMonthRevenueAggregation._sum.therapistNet || 0)

  return (
    <div className="max-w-5xl mx-auto p-6 sm:p-8 space-y-8 pb-24">
      <div className="flex-1 space-y-8 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-ealumininature/90">Carteira & Financeiro</h2>
        </div>

        {!stripeAccountId ? (
          <div className="bg-gradient-to-br from-indigo-50 to-white rounded-[2rem] p-8 shadow-sm border border-indigo-100/50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-4 max-w-xl">
              <h3 className="text-2xl font-semibold text-indigo-900">Configuração de Recebimentos Pendente</h3>
              <p className="text-ealumininature-foreground/70">
                Para começar a cobrar pacientes e receber pela plataforma via repasse automático (split de pagamento), você precisa conectar uma conta bancária de forma segura através da Stripe.
              </p>
              <div className="pt-2">
                <StripeConnectButton />
              </div>
            </div>
            <div className="hidden md:flex opacity-80 mix-blend-multiply">
              {/* Ilustração ou ícone */}
              <div className="w-48 h-48 bg-indigo-100 rounded-full flex items-center justify-center">
                 <span className="text-6xl">💳</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             <Card className="rounded-[2rem] border-none shadow-sm bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-ealumininature-foreground">
                  Receita Este Mês (Líquido)
                </CardTitle>
                <span className="text-teal-600 font-bold">$</span>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-light">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(thisMonthEarnings)}
                </div>
                <p className="text-xs text-ealumininature-foreground/50 mt-2">
                  Receita referente apenas às consultas já concluídas neste mês através da plataforma.
                </p>
              </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-2 rounded-[2rem] border-none shadow-sm bg-gradient-to-r from-teal-50 to-emerald-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-md font-semibold text-teal-900">
                  Sua Conta Conectada Stripe
                </CardTitle>
                <span className="bg-teal-100 text-teal-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-teal-200">
                  Ativa
                </span>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-teal-800/80">
                  Seus repasses estão configurados e automatizados. O valor cai direito na sua conta bancária após o evento compensar de acordo com a política de saque.
                </p>
                <StripeDashboardButton />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
