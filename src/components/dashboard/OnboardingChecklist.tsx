'use client'

import { CheckCircle2, Circle, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface OnboardingChecklistProps {
  checklist: {
    profileComplete: boolean
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
      description: 'Preencha sua biografia, nome profissional e terapias.',
      completed: checklist.profileComplete,
      href: '/dashboard/terapeuta/perfil',
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
      label: 'Configurar chave Pix ou dados bancários',
      description: 'Defina como você deseja receber pelos seus atendimentos.',
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
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 text-white rounded-[2rem] border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all duration-300">
      {/* Background soft glow */}
      <div className="absolute -right-24 -top-24 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-24 -bottom-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} className="text-amber-400 animate-pulse" />
              <span className="text-[10px] font-black tracking-widest uppercase text-amber-400">Primeiros Passos</span>
            </div>
            <h2 className="text-xl font-black tracking-tight">Ative seu perfil profissional</h2>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Complete as etapas pendentes para deixar sua conta 100% pronta para receber pacientes.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-slate-800/50 border border-slate-700/50 px-4 py-2.5 rounded-2xl shrink-0 self-start sm:self-auto">
            <span className="text-2xl font-black text-[#0090FF] leading-none">{progressPercent}%</span>
            <div className="text-left leading-none">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Concluído</p>
              <p className="text-xs font-bold text-slate-200 mt-1">{completedCount} de {items.length} etapas</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700/20">
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
                  ? "bg-slate-900/40 border-slate-800/80 opacity-70"
                  : "bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600/80 cursor-pointer"
              )}
            >
              <div className="shrink-0 mt-0.5">
                {item.completed ? (
                  <CheckCircle2 className="text-emerald-500 fill-emerald-500/10" size={20} />
                ) : (
                  <Circle className="text-slate-500 group-hover:text-slate-400 transition-colors" size={20} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-sm font-bold leading-tight transition-colors",
                  item.completed ? "text-slate-400 line-through" : "text-slate-200 group-hover:text-[#0090FF]"
                )}>
                  {item.label}
                </p>
                <p className="text-xs text-slate-400 font-medium mt-1 leading-snug">
                  {item.description}
                </p>
              </div>
              {!item.completed && (
                <div className="shrink-0 text-slate-500 group-hover:text-slate-300 transition-transform group-hover:translate-x-1 duration-300 self-center">
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
