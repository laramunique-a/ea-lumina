'use client';

import { useState } from 'react';
import { CosmicWeeklyCard } from './CosmicWeeklyCard';
import { CosmicContentGenerator } from './CosmicContentGenerator';
import { CosmicResultCard } from './CosmicResultCard';
import { Sparkles } from 'lucide-react';
import type { CosmicContext } from '@/lib/cosmic/provider';

interface ObservadorClientProps {
  initialContext: CosmicContext;
}

export function ObservadorClient({ initialContext }: ObservadorClientProps) {
  const [currentResult, setCurrentResult] = useState<any>(null);

  const handleGenerate = (newContent: any) => {
    setCurrentResult(newContent);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-purple-600" />
          Observador Cósmico
        </h1>
        <p className="text-slate-500 mt-2 text-lg mb-8">
          Gere conteúdos alinhados à energia coletiva da semana.
        </p>
      </div>

      {/* Bloco da Energia da Semana no TOPO */}
      <CosmicWeeklyCard context={initialContext} />

      {/* Gerador de Conteúdo em Largura Total */}
      <div className="w-full mb-12">
        <CosmicContentGenerator
          bestTopics={initialContext.bestTopics}
          onGenerate={handleGenerate}
        />
      </div>

      {/* ÁREA DE RESULTADO FULL WIDTH NO FINAL */}
      <div className="w-full">
        {currentResult ? (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 border-t border-slate-200 pt-12 mt-4">
            <CosmicResultCard content={currentResult} />
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 border-dashed rounded-3xl flex flex-col items-center justify-center p-16 text-center mt-12 min-h-[350px]">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <Sparkles className="h-10 w-10 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-3">Pronto para a magia</h3>
            <p className="text-slate-500 max-w-md text-base leading-relaxed">
              Preencha o formulário acima e clique em gerar para criar seu primeiro conteúdo alinhado ao cosmos. O resultado aparecerá aqui em tela cheia.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
