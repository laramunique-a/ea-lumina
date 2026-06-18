'use client'

import { CheckCircle2, Circle, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface OnboardingChecklistProps {
  checklist: {
    profileComplete: boolean
    therapiesComplete: boolean
    documentComplete: boolean
    financialComplete: boolean
    agendaComplete: boolean
    allComplete: boolean
  }
}

export function OnboardingChecklist({ checklist }: OnboardingChecklistProps) {
  if (checklist.allComplete) return null

  const items = [
    {
      id: 'profile',
      label: 'Completar informações do perfil',
      description: 'Preencha seu nome profissional, país, estado, telefone, e-mail e biografia.',
      completed: checklist.profileComplete,
      href: '/dashboard/terapeuta/perfil',
    },
    {
      id: 'therapies',
      label: 'Cadastrar especialidades e terapias',
      description: 'Selecione as terapias e técnicas que você oferece.',
      completed: checklist.therapiesComplete,
      href: '/dashboard/terapeuta/terapias',
    },
    {
      id: 'document',
      label: 'Enviar comprovante de identidade',
      description: 'Suba um documento válido (RG, CNH ou Passaporte) para análise.',
      completed: checklist.documentComplete,
      href: '/dashboard/terapeuta/perfil',
    },
    {
      id: 'financial',
      label: 'Configurar dados bancários',
      description: 'Vincule sua conta bancária via Stripe para receber pelos seus atendimentos.',
      completed: checklist.financialComplete,
      href: '/dashboard/terapeuta/financeiro',
    },
    {
      id: 'agenda',
      label: 'Adicionar horários disponíveis na agenda',
      description: 'Configure seus horários de atendimento para receber reservas.',
      completed: checklist.agendaComplete,
      href: '/dashboard/terapeuta/agenda?tab=availability',
    },
  ]

  const completedCount = items.filter(item => item.completed).length
  const progressPercent = Math.round((completedCount / items.length) * 100)

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 p-6 sm:p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] relative overflow-hidden transition-all duration-300">
      {/* Background soft glow */}
      <div className="absolute -right-24 -top-24 w-60 h-60 bg-blue-50/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-24 -bottom-24 w-60 h-60 bg-amber-50/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} className="text-amber-500 animate-pulse" />
              <span className="text-[10px] font-black tracking-widest uppercase text-amber-600">Primeiros Passos</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Ative seu perfil profissional</h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Complete as etapas pendentes para deixar sua conta 100% pronta para receber pacientes.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-2xl shrink-0 self-start sm:self-auto">
            <span className="text-2xl font-black text-[#0090FF] leading-none">{progressPercent}%</span>
            <div className="text-left leading-none">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Concluído</p>
              <p className="text-xs font-bold text-slate-600 mt-1">{completedCount} de {items.length} etapas</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-[#0090FF] to-blue-400 h-full rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Checklist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {items.map(item => (
            <Link 
              key={item.id}
              href={item.href}
              className={cn(
                "group flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300",
                item.completed
                  ? "bg-slate-50/50 border-slate-100/80 opacity-70"
                  : "bg-white border-slate-100 hover:bg-blue-50/10 hover:border-blue-100 hover:shadow-sm cursor-pointer"
              )}
            >
              <div className="shrink-0 mt-0.5">
                {item.completed ? (
                  <CheckCircle2 className="text-emerald-500 fill-emerald-500/10" size={20} />
                ) : (
                  <Circle className="text-slate-300 group-hover:text-[#0090FF] transition-colors" size={20} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-sm font-bold leading-tight transition-colors",
                  item.completed ? "text-slate-400 line-through" : "text-slate-700 group-hover:text-[#0090FF]"
                )}>
                  {item.label}
                </p>
                <p className="text-xs text-slate-400 font-medium mt-1 leading-snug">
                  {item.description}
                </p>
              </div>
              {!item.completed && (
                <div className="shrink-0 text-slate-300 group-hover:text-[#0090FF] transition-transform group-hover:translate-x-1 duration-300 self-center">
                  <ArrowRight size={16} />
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
