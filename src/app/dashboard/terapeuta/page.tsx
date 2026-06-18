export const dynamic = 'force-dynamic'

import { StatCard } from '@/components/dashboard/StatCard'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDateTime, appointmentStatusConfig } from '@/lib/utils'
import { Calendar, DollarSign, Star, Users } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { OnboardingChecklist } from '@/components/dashboard/OnboardingChecklist'

async function getTherapistData(userId: string) {
  const therapist = await prisma.therapistProfile.findUnique({
    where: { userId },
    include: {
      user: { select: { avatarUrl: true } },
      paymentDetails: true,
      appointments: {
        orderBy: { date: 'desc' },
        take: 5,
        include: {
          patient: { include: { user: { select: { name: true, avatarUrl: true } } } },
        },
      },
    },
  })

  if (!therapist) return null

  const [confirmedCount, pendingCount, revenue, availabilityCount] = await Promise.all([
    prisma.appointment.count({ where: { therapistId: therapist.id, status: 'CONFIRMADO' } }),
    prisma.appointment.count({ where: { therapistId: therapist.id, status: 'PENDENTE' } }),
    prisma.appointment.aggregate({
      _sum: { therapistNet: true },
      where: { therapistId: therapist.id, status: { in: ['CONFIRMADO', 'CONCLUIDO'] } },
    }),
    prisma.availability.count({ where: { therapistId: therapist.id, active: true } }),
  ])

  // Verificações de Completude
  const hasBio = !!therapist.bio && therapist.bio.length > 10
  const hasProfessionalName = !!therapist.professionalName
  const hasCountry = !!therapist.country
  const hasState = !!therapist.state
  const hasWhatsapp = !!therapist.whatsapp
  const hasProfessionalEmail = !!therapist.professionalEmail
  const hasModality = !!therapist.modality
  
  const profileComplete = hasBio && hasProfessionalName && hasCountry && hasState && hasWhatsapp && hasProfessionalEmail && hasModality

  const therapiesComplete = therapist.therapies.length > 0

  const documentComplete = !!therapist.documentUrl

  const financialComplete = !!therapist.paymentDetails?.stripeAccountId

  const agendaComplete = availabilityCount > 0

  const allComplete = profileComplete && therapiesComplete && documentComplete && financialComplete && agendaComplete

  // Se tudo foi concluído, envia notificação de boas-vindas caso ainda não tenha sido enviada
  if (allComplete) {
    const existingNotification = await prisma.notification.findFirst({
      where: {
        userId,
        title: 'Perfil Pronto!'
      }
    })

    if (!existingNotification) {
      await prisma.notification.create({
        data: {
          userId,
          title: 'Perfil Pronto!',
          message: 'Seu perfil foi configurado com sucesso e está pronto para receber agendamentos.',
          type: 'SUCCESS'
        }
      })
    }
  }

  return {
    therapist,
    confirmedCount,
    pendingCount,
    totalRevenue: Number(revenue._sum.therapistNet) || 0,
    checklist: {
      profileComplete,
      therapiesComplete,
      documentComplete,
      financialComplete,
      agendaComplete,
      allComplete
    }
  }
}



export default async function TerapeutaDashboardPage() {
  const headersList = headers()
  const userId = headersList.get('x-user-id')!

  const data = await getTherapistData(userId)

  if (!data?.therapist) {
    return (
      <div className="max-w-4xl mx-auto p-6 sm:p-8 space-y-8 pb-24">
        <div className="bg-white border border-slate-100 rounded-[2rem] shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] p-12 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#0090FF]">
            <Calendar size={24} />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2 tracking-tight">Complete seu perfil</h3>
          <p className="text-slate-500 font-medium mb-8">
            Complete seu perfil de terapeuta para começar a receber agendamentos.
          </p>
          <Link href="/dashboard/terapeuta/perfil">
            <Button className="rounded-xl px-8 h-12 text-sm font-bold shadow-lg shadow-blue-500/20">
              Completar perfil
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const { therapist, confirmedCount, pendingCount, totalRevenue, checklist } = data

  return (
    <div className="max-w-5xl mx-auto p-6 sm:p-8 space-y-8 pb-24">
      <OnboardingChecklist checklist={checklist} />

      {therapist.approved === false && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-sm font-medium">
          ⏳ Seu perfil está em análise. Você receberá uma notificação quando for aprovado.
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Link href="/dashboard/terapeuta/agenda?status=CONFIRMADO" className="block transition-transform hover:scale-[1.02] active:scale-[0.98]">
          <StatCard
            title="Agendamentos"
            value={confirmedCount}
            icon={<Calendar size={20} />}
            color="blue"
            description="Confirmados"
          />
        </Link>
        <Link href="/dashboard/terapeuta/agenda?status=PENDENTE" className="block transition-transform hover:scale-[1.02] active:scale-[0.98]">
          <StatCard
            title="Pendentes"
            value={pendingCount}
            icon={<Users size={20} />}
            color="purple"
            description="Aguardando confirmação"
          />
        </Link>
        <StatCard
          title="Receita Líquida"
          value={formatCurrency(totalRevenue)}
          icon={<DollarSign size={20} />}
          color="gold"
          description="Após comissão"
        />
        <Link href="/dashboard/terapeuta/avaliacoes" className="block transition-transform hover:scale-[1.02] active:scale-[0.98]">
          <StatCard
            title="Avaliação"
            value={therapist.rating.toFixed(1)}
            icon={<Star size={20} />}
            color="gold"
            description={`${therapist.reviewCount} avaliações`}
          />
        </Link>
      </div>

      {/* Próximos agendamentos */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] overflow-hidden">
        <div className="flex items-center justify-between p-6 sm:p-8 border-b border-slate-100/60">
          <h2 className="font-black text-slate-900 text-lg tracking-tight">Últimos agendamentos</h2>
          <Link href="/dashboard/terapeuta/agenda">
            <Button variant="outline" size="sm" className="rounded-xl font-bold bg-slate-50 border-slate-200/60 text-slate-600 hover:text-slate-900">Ver completos →</Button>
          </Link>
        </div>
        <div className="divide-y divide-slate-100/60">
          {therapist.appointments.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-400 font-medium">
              <Calendar size={32} className="mx-auto text-slate-200 mb-3" />
              Nenhum agendamento ainda. Mantenha seu perfil atrativo.
            </div>
          ) : (
            therapist.appointments.map((apt) => {
              const statusConfig = appointmentStatusConfig[apt.status]
              return (
                <div key={apt.id} className="p-6 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <Link href={`/dashboard/terapeuta/paciente/${apt.patient.id}`} className="block relative flex-shrink-0 group/avatar">
                      <div className="w-12 h-12 rounded-2xl bg-[#0090FF] flex items-center justify-center text-white font-bold border border-white shadow-sm ring-2 ring-blue-50 text-lg transition-transform hover:scale-110 active:scale-95">
                        {apt.patient.user.name.charAt(0)}
                      </div>
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/avatar:opacity-100 rounded-2xl transition-opacity" />
                    </Link>
                    <div>
                      <Link href={`/dashboard/terapeuta/paciente/${apt.patient.id}`} className="text-base font-bold text-slate-900 tracking-tight hover:text-[#0090FF] transition-colors block leading-tight">
                        {apt.patient.socialName || apt.patient.user.name}
                      </Link>
                      <p className="text-xs font-medium text-slate-400 mt-1">{formatDateTime(apt.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-base font-black text-slate-900 tracking-tight">{formatCurrency(Number(apt.price))}</span>
                    <span className={`text-[10px] px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
