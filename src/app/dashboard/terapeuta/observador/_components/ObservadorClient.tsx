'use client';

import { useState, useEffect } from 'react';
import { CosmicWeeklyCard } from './CosmicWeeklyCard';
import { CosmicContentGenerator } from './CosmicContentGenerator';
import { CosmicResultCard } from './CosmicResultCard';
import { Sparkles, History } from 'lucide-react';
import type { CosmicContext } from '@/lib/cosmic/provider';

interface ObservadorClientProps {
  initialContext: CosmicContext;
}

export function ObservadorClient({ initialContext }: ObservadorClientProps) {
  const [currentResult, setCurrentResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/cosmic-content/history');
      if (res.ok) {
        const json = await res.json();
        setHistory(json.data);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleGenerate = (newContent: any) => {
    setCurrentResult(newContent);
    setHistory((prev) => [newContent, ...prev]);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-purple-600" />
          Observador Cósmico
        </h1>
        <p className="text-slate-500 mt-2 text-lg">
          Gere conteúdos alinhados à energia coletiva da semana.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Coluna Esquerda: Gerador */}
        <div className="lg:col-span-5 space-y-8">
          <CosmicWeeklyCard context={initialContext} />
          <CosmicContentGenerator
            bestTopics={initialContext.bestTopics}
            onGenerate={handleGenerate}
          />
        </div>

        {/* Coluna Direita: Resultado e Histórico */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {currentResult ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CosmicResultCard content={currentResult} />
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl flex flex-col items-center justify-center p-12 text-center h-full min-h-[300px]">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-700 mb-2">Pronto para a magia</h3>
              <p className="text-slate-500 max-w-sm">
                Preencha o formulário ao lado e clique em gerar para criar seu primeiro conteúdo alinhado ao cosmos.
              </p>
            </div>
          )}

          {/* Histórico */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-6">
              <History className="h-5 w-5 text-slate-400" />
              Histórico Recente
            </h2>

            {isLoadingHistory ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-slate-100 rounded-xl w-full"></div>
                ))}
              </div>
            ) : history.length > 0 ? (
              <div className="space-y-4">
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setCurrentResult(item)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all hover:border-purple-300 hover:shadow-md ${
                      currentResult?.id === item.id
                        ? 'border-purple-500 bg-purple-50/50'
                        : 'border-slate-100 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-slate-700 capitalize">
                        {item.theme}
                      </span>
                      <span className="text-xs font-medium bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-500 uppercase">
                        {item.contentType}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-2">{item.copy}</p>
                    <p className="text-xs text-slate-400 mt-2">
                      {new Date(item.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-500 py-8">Nenhum conteúdo gerado ainda.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
