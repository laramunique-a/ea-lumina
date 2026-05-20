'use client';

import { Sparkles, Calendar as CalendarIcon, ArrowRight, Target } from 'lucide-react';
import type { CosmicContext } from '@/lib/cosmic/provider';

interface Props {
  context: CosmicContext;
}

export function CosmicWeeklyCard({ context }: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-6 md:p-8 text-white shadow-xl w-full mb-8">
      {/* Elementos decorativos (Glassmorphism / Glow) */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl"></div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex-1 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md">
                <Sparkles className="h-5 w-5 text-purple-300" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-wide">
                Energia da Semana
              </h2>
            </div>
            <div className="hidden md:block h-6 w-[1px] bg-white/20"></div>
            <div className="flex items-center gap-2 text-sm font-medium text-purple-200 bg-white/5 px-3 py-1.5 rounded-full backdrop-blur-md w-fit border border-white/10">
              <CalendarIcon className="h-4 w-4" />
              <span>{context.weekStart}</span>
              <ArrowRight className="h-3 w-3 mx-1 opacity-70" />
              <span>{context.weekEnd}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <p className="text-xs text-purple-300/80 uppercase tracking-wider font-semibold mb-1">Tema</p>
                <p className="text-xl md:text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-indigo-200">
                  "{context.weekTheme}"
                </p>
              </div>
              
              <div>
                <p className="text-xs text-purple-300/80 uppercase tracking-wider font-semibold mb-1">Energia Coletiva</p>
                <p className="text-sm md:text-base leading-relaxed text-slate-200">
                  "{context.collectiveEnergy}"
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-purple-300/80 uppercase tracking-wider font-semibold mb-2">Temas Favorecidos</p>
                <div className="flex flex-wrap gap-2">
                  {context.bestTopics.map((topic, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md border border-white/5 hover:bg-white/20 transition-colors cursor-default"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-purple-300/80 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1.5">
                  <Target className="h-3 w-3" /> CTA Recomendado
                </p>
                <p className="text-sm font-medium text-amber-200/90 italic">
                  "{context.recommendedCta}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
