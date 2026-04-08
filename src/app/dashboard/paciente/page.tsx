export const dynamic = 'force-dynamic'

import { StatCard } from '@/components/dashboard/StatCard'
import { ReviewSection } from '@/components/dashboard/ReviewSection'
import { prisma } from '@/lib/prisma'
import { Star, Shield, Search, Calendar, MessageSquare, Menu, User, LogOut, Briefcase, Clock, Check } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { headers } from 'next/headers'
import Image from 'next/image'
import { getAvatarUrl, cn } from '@/lib/utils'

async function getDashboardData(userId: string) {
  const [patient, stats] = await Promise.all([
    prisma.patientProfile.findUnique({
      where: { userId },
      include: {
        user: { select: { name: true, avatarUrl: true } },
        packages: {
          where: { remainingSessions: { gt: 0 } },
          include: { 
            package: { 
              include: { 
                service: {
                  include: {
                    therapist: {
                      include: {
                        user: { select: { name: true, avatarUrl: true } }
                      }
                    }
                  }
                }
              } 
            } 
          },
        },
      },
    }),
    prisma.appointment.aggregate({
      _count: { id: true },
      where: { patient: { userId } },
    }),
  ])

  const nextAppointment = await prisma.appointment.findFirst({
    where: {
      patient: { userId },
      date: { gte: new Date() },
      status: 'CONFIRMADO',
    },
    orderBy: { date: 'asc' },
    include: {
      therapist: { include: { user: true } },
      service: true
    }
  })

  // Novo contador que soma sessões já dadas (concluídas) e as confirmadas (futuras/agendadas)
  const totalCompletedAndScheduled = await prisma.appointment.count({
    where: {
      patient: { userId },
      status: { in: ['CONCLUIDO', 'CONFIRMADO'] },
    },
  })

  // Corrigido: Review usa authorId para o usuário que deu a avaliação
  const reviewsCount = await prisma.review.count({
    where: { authorId: userId },
  })

  // Buscar todas as avaliações que o paciente já deu
  const existingReviews = await prisma.review.findMany({
    where: { authorId: userId },
    include: { 
      appointment: { 
        select: { therapistId: true, serviceId: true } 
      } 
    }
  })

  // Conjunto de chaves (terapeuta_servico) já avaliados
  const reviewedKeys = new Set(
    existingReviews.map(r => `${r.appointment.therapistId}_${r.appointment.serviceId || 'individual'}`)
  )

  const allCompletedNoReview = await prisma.appointment.findMany({
    where: {
      patient: { userId },
      status: 'CONCLUIDO',
      review: null
    },
    include: {
      therapist: { include: { user: { select: { name: true, avatarUrl: true } } } },
      service: true
    },
    orderBy: { date: 'desc' }
  })

  // Filtrar: apenas agendamentos cujo par (terapeuta, servico) ainda não foi avaliado
  const pendingReviews = allCompletedNoReview.filter(apt => {
    const key = `${apt.therapistId}_${apt.serviceId || 'individual'}`
    // Se ainda não avaliou esse terapeuta para este serviço, mantemos
    if (!reviewedKeys.has(key)) {
      reviewedKeys.add(key) // Evita mostrar duplicados na própria lista pendente
      return true
    }
    return false
  })

  return {
    patient,
    totalCompletedAndScheduled,
    nextAppointment,
    reviewsCount,
    pendingReviews,
  }
}

function formataDataBR(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}

function formataHoraBR(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

export default async function PacienteDashboardPage() {
  const headersList = headers()
  const userId = headersList.get('x-user-id')!
  
  const data = await getDashboardData(userId)

  return (
    <div className="p-6 space-y-6">
      {/* Grid de Estatísticas Refinado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Próxima sessão"
          value={
            data.nextAppointment ? (
              <div className="flex flex-col gap-0.5 mt-0.5">
                <span className="text-base font-bold text-slate-800 tracking-tight">
                  {formataDataBR(data.nextAppointment.date)} às {formataHoraBR(data.nextAppointment.date)}
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate">
                  {data.nextAppointment.service?.name} • {data.nextAppointment.therapist?.user?.name}
                </span>
              </div>
            ) : (
              <span className="text-[13px] font-semibold text-slate-400 tracking-wide mt-1">Nenhuma sessão agendada</span>
            )
          }
          icon={<Calendar size={20} />}
          color="blue"
        />
        <StatCard
          title="Todas as sessões"
          value={data.totalCompletedAndScheduled}
          description="Sessões realizadas e agendadas"
          icon={<Briefcase size={20} />}
          color="purple"
          href="/dashboard/paciente/agendamentos"
        />
        <StatCard
          title="Avaliações"
          value={data.reviewsCount}
          icon={<Star size={20} />}
          color="gold"
          href="/dashboard/paciente/avaliacoes"
        />
      </div>

      {/* Avaliações Pendentes */}
      <ReviewSection reviews={data.pendingReviews} />

      {/* Meus Pacotes Ativos */}
      {data?.patient?.packages && data.patient.packages.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-base font-semibold text-slate-900">Meus Pacotes Ativos</h2>
            <Link href="/dashboard/paciente/agendamentos">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-[#0090FF] -mr-2">Ver tudo →</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.patient.packages.map((p) => {
              const therapistName = p.package.service?.therapist?.user?.name || 'Terapeuta'
              const therapistAvatar = getAvatarUrl(therapistName, p.package.service?.therapist?.user?.avatarUrl)
              const usedSessions = p.totalSessions - p.remainingSessions

              return (
                <div 
                  key={p.id} 
                  className="bg-white rounded-2xl p-5 border border-slate-100 relative overflow-hidden transition-all group shadow-sm hover:translate-y-[-2px] hover:shadow-md h-[180px] flex flex-col"
                >
                  <div 
                    className="absolute bottom-0 left-0 h-1 bg-[#0090FF] transition-all duration-1000" 
                    style={{ width: `${(usedSessions / p.totalSessions) * 100}%` }}
                  />
                  
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10">
                        <Image
                          src={therapistAvatar}
                          alt={therapistName}
                          fill
                          className="rounded-full object-cover border-2 border-white shadow-sm"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                          <Briefcase size={8} className="text-white" />
                        </div>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm leading-tight">{therapistName}</p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest leading-none mt-1">{p.package.name}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="bg-blue-600 text-white px-3 py-1 rounded-full font-bold text-[10px] shadow-lg shadow-blue-100 uppercase tracking-tighter">
                        {usedSessions} / {p.totalSessions} SESSÕES
                      </div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Utilizadas</span>
                    </div>
                  </div>

                  <div className="mt-2 flex-1">
                    <p className="text-[10px] text-slate-500 font-medium">
                      Pacote válido para: <span className="text-brand-600 font-bold uppercase">{p.package.service?.name || 'Multi-terapia'}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-4">
                    <div className="flex gap-1.5 flex-1 mr-4">
                      {Array.from({ length: p.totalSessions }).map((_, i) => (
                        <div 
                          key={i} 
                          className={cn(
                            "h-5 flex-1 rounded-full border transition-all flex items-center justify-center overflow-hidden",
                            i < usedSessions 
                              ? "bg-blue-600 border-blue-600 shadow-sm" 
                              : "bg-slate-50 border-slate-200"
                          )} 
                        >
                          {i < usedSessions && <Check size={10} className="text-white" strokeWidth={4} />}
                        </div>
                      ))}
                    </div>
                    <Link href={
                        p.package.service?.therapistId
                          ? `/dashboard/paciente/terapeuta/${p.package.service.therapistId}?usePackage=${p.id}&serviceId=${p.package.serviceId}&multiTherapy=${p.package.isMultiTherapy}`
                          : '/dashboard/paciente/buscar'
                      }>
                      <Button size="sm" className="h-8 rounded-xl text-[10px] font-bold uppercase tracking-wider px-3 bg-[#0090FF] hover:bg-blue-600">
                        Agendar agora
                      </Button>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
