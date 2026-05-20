'use client';

import { Sparkles } from 'lucide-react';
import type { CosmicContext } from '@/lib/cosmic/provider';

interface Props {
  context: CosmicContext;
}

export function CosmicWeeklyCard({ context }: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-6 text-white shadow-xl">
      {/* Elementos decorativos (Glassmorphism / Glow) */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl"></div>

      <div className="relative z-10 flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md">
          <Sparkles className="h-5 w-5 text-purple-300" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-purple-200">Energia da Semana</h3>
          <p className="text-lg font-bold">{context.weekTheme}</p>
        </div>
      </div>

      <div className="relative z-10 space-y-4">
        <div>
          <p className="text-sm text-purple-200/80 mb-1">Clima Emocional Coletivo</p>
          <p className="text-sm leading-relaxed text-slate-100">
            {context.collectiveEnergy}
          </p>
        </div>

        <div>
          <p className="text-sm text-purple-200/80 mb-2">Tópicos em Alta</p>
          <div className="flex flex-wrap gap-2">
            {context.bestTopics.map((topic, i) => (
              <span
                key={i}
                className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md border border-white/5"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
