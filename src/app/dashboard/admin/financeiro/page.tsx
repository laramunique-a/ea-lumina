import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import * as jose from 'jose'

async function getAdminSession() {
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

export default async function AdminFinanceiroPage() {
  const session = await getAdminSession()
  if (!session || session.role !== 'ADMIN') {
    return redirect('/login')
  }

  // Agregações de receita de todos os tempos
  const allTimeStats = await prisma.appointment.aggregate({
    _sum: {
      platformRevenue: true,
      therapistNet: true,
      price: true,
      refundAmount: true,
    },
    where: {
      status: { in: ['CONFIRMADO', 'CONCLUIDO'] }
    }
  })

  // Agregações do mês atual
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  const thisMonthStats = await prisma.appointment.aggregate({
    _sum: {
      platformRevenue: true,
      therapistNet: true,
      price: true,
    },
    where: {
      status: { in: ['CONFIRMADO', 'CONCLUIDO'] },
      date: { gte: firstDayOfMonth }
    }
  })

  const formatBRL = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  return (
    <div className="max-w-6xl mx-auto p-6 sm:p-8 space-y-8 pb-24">
      <div className="flex-1 space-y-8 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Visão Financeira da Plataforma</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-[2rem] border-none shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                Receita Total Transacionada (Gross)
              </CardTitle>
              <span className="text-blue-500 font-bold">$</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">
                {formatBRL(Number(allTimeStats._sum.price || 0))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-none shadow-sm bg-indigo-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-indigo-700">
                Líquido EA Lumina (All-time)
              </CardTitle>
              <span className="text-indigo-600 font-bold">💰</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-900">
                {formatBRL(Number(allTimeStats._sum.platformRevenue || 0))}
              </div>
              <p className="text-xs text-indigo-600 mt-1">Este valor é usado para pagar a Stripe</p>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-none shadow-sm bg-teal-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-teal-700">
                Repassado aos Terapeutas
              </CardTitle>
              <span className="text-teal-600 font-bold">💳</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-900">
                {formatBRL(Number(allTimeStats._sum.therapistNet || 0))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-none shadow-sm bg-amber-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-700">
                Total em Estornos
              </CardTitle>
              <span className="text-amber-600 font-bold">↩️</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-900">
                {formatBRL(Number(allTimeStats._sum.refundAmount || 0))}
              </div>
            </CardContent>
          </Card>
        </div>

        <h3 className="text-xl font-bold tracking-tight text-slate-900 mt-6">Este Mês</h3>
        <div className="grid gap-6 md:grid-cols-2">
           <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium uppercase tracking-widest">Volume (Mês Atual)</p>
                <p className="text-3xl font-black text-slate-800 mt-1">{formatBRL(Number(thisMonthStats._sum.price || 0))}</p>
              </div>
           </div>
           <div className="bg-indigo-500 p-6 rounded-[2rem] shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm text-indigo-100 font-medium uppercase tracking-widest">Lucro EA Lumina (Mês Atual)</p>
                <p className="text-3xl font-black text-white mt-1">{formatBRL(Number(thisMonthStats._sum.platformRevenue || 0))}</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
