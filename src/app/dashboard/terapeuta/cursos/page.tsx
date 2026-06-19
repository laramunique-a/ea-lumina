import { GraduationCap } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cursos e Formações | EA Lumina',
  description: 'Área exclusiva de cursos, formações e conteúdos especiais para terapeutas',
}

export default function CursosPage() {
  return (
    <div className="p-6 md:p-8 w-full min-h-screen bg-[#FAFAF9] flex flex-col justify-center items-center">
      <div className="max-w-xl w-full bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-[0_10px_30px_-10px_rgba(0,144,255,0.08)] text-center relative overflow-hidden group">
        
        {/* Glow decoration */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl transition-transform duration-500 group-hover:scale-110" />

        {/* Icon container */}
        <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-8 relative z-10 transition-transform duration-300 group-hover:scale-105 shadow-[0_8px_20px_-4px_rgba(0,144,255,0.15)]">
          <GraduationCap className="h-10 w-10 text-[#0090FF]" />
        </div>

        {/* Content */}
        <div className="relative z-10 space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#0090FF] uppercase tracking-wider">
            🚀 Em breve!
          </span>
          
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-tight">
            Cursos e Formações
          </h1>

          <div className="space-y-4 text-slate-600 text-sm md:text-base leading-relaxed font-medium">
            <p>
              Estamos preparando uma área exclusiva de cursos, formações e conteúdos especiais para apoiar o seu desenvolvimento profissional.
            </p>
            <p>
              Nossa equipe está construindo uma experiência completa para que você possa expandir seus conhecimentos, aprimorar suas práticas e evoluir junto com a comunidade EA Lumina.
            </p>
          </div>

          <div className="pt-4">
            <div className="flex items-center justify-center gap-2 text-[#0090FF] text-xs font-bold uppercase tracking-widest">
              ✨ Grandes novidades estão a caminho
            </div>
            <p className="text-slate-400 text-xs mt-1 font-bold uppercase tracking-widest">
              Equipe EA Lumina
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
