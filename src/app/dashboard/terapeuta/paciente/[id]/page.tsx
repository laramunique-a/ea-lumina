export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { getAvatarUrl, formatDateShort } from '@/lib/utils'
import { Calendar, User as UserIcon, Mail, Phone, Briefcase, MapPin, Heart, ArrowLeft, History } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { headers } from 'next/headers'
import { GeneratePatientPdfButton } from '@/components/dashboard/GeneratePatientPdfButton'

async function getPatientData(patientId: string, therapistUserId: string) {
  // Garantir que o solicitante é um terapeuta
  const therapist = await prisma.therapistProfile.findUnique({
    where: { userId: therapistUserId },
    select: { id: true }
  })

  if (!therapist) return null

  // Buscar perfil do paciente
  const patient = await prisma.patientProfile.findUnique({
    where: { id: patientId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          avatarUrl: true,
        }
      },
      // Verificar se há histórico com este terapeuta específico
      appointments: {
        where: { therapistId: therapist.id },
        orderBy: { date: 'desc' },
        include: { service: true }
      }
    }
  })

  // Se não existe ou nunca teve contato (segurança básica)
  if (!patient || patient.appointments.length === 0) {
    console.log('[PATIENT_PROFILE] Paciente não encontrado ou sem contato:', { patientId, therapistUserId })
    return null
  }

  return patient
}

export default async function TherapistPatientProfilePage({
  params
}: {
  params: { id: string }
}) {
  const headersList = headers()
  const userId = headersList.get('x-user-id')
  
  if (!userId) {
    console.error('[PATIENT_PROFILE] x-user-id header missing')
    redirect('/login')
  }

  const patient = await getPatientData(params.id, userId)

  if (!patient) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center py-20">
        <div className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm">
          <h2 className="text-2xl font-black text-slate-800 mb-4">Paciente não encontrado</h2>
          <p className="text-slate-500 mb-8 font-medium">Você não tem permissão para ver este perfil ou o paciente não existe.</p>
          <Link href="/dashboard/terapeuta/agenda">
            <Button className="rounded-xl px-10 h-12 shadow-lg shadow-blue-500/20">Voltar para Agenda</Button>
          </Link>
        </div>
      </div>
    )
  }

  const birthDate = patient.birthDate ? formatDateShort(patient.birthDate) : 'Não informado'
  const age = patient.birthDate ? new Date().getFullYear() - new Date(patient.birthDate).getFullYear() : null

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 space-y-8 pb-24">
      <Link href="/dashboard/terapeuta/agenda" className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-[#0090FF] transition-colors group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Voltar para Agenda
      </Link>

      {/* Header Perfil */}
      <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 border border-slate-100 shadow-[0_4px_20px_-4px_rgba(6,81,237,0.08)] flex flex-col sm:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#0090FF]/5 rounded-bl-full opacity-50" />
        
        <div className="relative">
          <div className="w-32 h-32 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl ring-4 ring-blue-50/50">
            <img 
              src={getAvatarUrl(patient.socialName || patient.user.name, patient.user.avatarUrl)} 
              alt={patient.socialName || patient.user.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-3 z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
                {patient.socialName || patient.user.name}
              </h1>
              {patient.socialName && (
                <span className="bg-slate-50 text-slate-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-slate-100/50">
                  Nome Civil: {patient.user.name}
                </span>
              )}
            </div>
            <GeneratePatientPdfButton patient={patient} />
          </div>
          <div className="flex flex-wrap justify-center sm:justify-start gap-3 items-center pt-1">
            <span className="flex items-center gap-1.5 text-slate-500 font-bold text-sm bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
              <Mail size={14} className="text-[#0090FF]" />
              {patient.user.email}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Info Básica */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
            <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2 tracking-tight">
              <UserIcon size={18} className="text-[#0090FF]" />
              Dados Pessoais
            </h3>
            <div className="space-y-4">
              <InfoRow label="Nascimento" value={birthDate} />
              {age && <InfoRow label="Idade" value={`${age} anos`} />}
              <InfoRow label="Gênero" value={patient.gender || '-'} />
              <InfoRow label="Estado Civil" value={patient.maritalStatus || '-'} />
              <InfoRow label="Profissão" value={patient.profession || '-'} />
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
            <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2 tracking-tight">
              <MapPin size={18} className="text-[#0090FF]" />
              Localização
            </h3>
            <div className="space-y-4">
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                {patient.city ? `${patient.city}, ${patient.state || ''}` : 'Não informado'}
              </p>
            </div>
          </div>
        </div>

        {/* Anamnese e Histórico */}
        <div className="md:col-span-2 space-y-8">
          {/* Anamnese (Se houver) */}
          {patient.anamnese && (
            <div className="bg-teal-50/30 rounded-[2.5rem] p-8 border border-brand-100 shadow-sm">
              <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2 tracking-tight text-xl">
                <Heart size={22} className="text-brand-500" />
                Informações Clínicas
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {Object.entries(patient.anamnese as Record<string, any>).map(([key, val]) => {
                  // Formatar a chave para ser mais amigável (camelCase -> Human Readable)
                  const formattedKey = key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, str => str.toUpperCase())
                    .trim()

                  return (
                    <div key={key} className="bg-white p-5 rounded-2xl border border-brand-100 shadow-sm shadow-brand-50/50">
                      <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1.5">{formattedKey}</p>
                      <p className="text-slate-900 text-sm font-medium leading-relaxed break-words">{val?.toString() || '-'}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Histórico com o profissional */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-4 right-4 text-[#0090FF]/10">
              <Calendar size={80} strokeWidth={1} />
            </div>
            <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2 tracking-tight text-xl">
              <History size={22} className="text-[#0090FF]" />
              Histórico com você
            </h3>
            <div className="space-y-4 relative z-10">
              {patient.appointments.map(apt => (
                <div key={apt.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                  <div>
                    <p className="font-bold text-slate-900 text-sm">
                      {new Date(apt.date).toLocaleDateString('pt-BR')} às {new Date(apt.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">{apt.service?.name || 'Sessão Individual'}</p>
                  </div>
                  <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-tighter shadow-sm
                    ${apt.status === 'CONCLUIDO' ? 'bg-amber-100 text-amber-700' : 
                      apt.status === 'CONFIRMADO' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'}
                  `}>
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{label}</span>
      <span className="text-sm font-bold text-slate-800 tracking-tight">{value}</span>
    </div>
  )
}
