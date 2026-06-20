'use client';

import { useState, useEffect } from 'react';
import { CosmicWeeklyCard } from './CosmicWeeklyCard';
import { CosmicContentGenerator } from './CosmicContentGenerator';
import { CosmicResultCard } from './CosmicResultCard';
import { Sparkles, History, ChevronDown } from 'lucide-react';
import type { CosmicContext } from '@/lib/cosmic/provider';

interface ObservadorClientProps {
  initialContext: CosmicContext;
}

export function ObservadorClient({ initialContext }: ObservadorClientProps) {
  const [currentResult, setCurrentResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);

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
        <p className="text-slate-500 mt-2 text-lg mb-8">
          Gere conteúdos alinhados à energia coletiva da semana.
        </p>
      </div>

      {/* Bloco da Energia da Semana no TOPO */}
      <CosmicWeeklyCard context={initialContext} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Coluna Esquerda: Gerador */}
        <div className="lg:col-span-7 space-y-8">
          <CosmicContentGenerator
            bestTopics={initialContext.bestTopics}
            onGenerate={handleGenerate}
          />
        </div>

        {/* Coluna Direita: Histórico */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          {/* Histórico */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 transition-all h-full">
            <button 
              onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
              className="w-full flex items-center justify-between group outline-none"
            >
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <History className="h-5 w-5 text-slate-400 group-hover:text-purple-500 transition-colors" />
                Histórico Recente
              </h2>
              <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${isHistoryExpanded ? 'rotate-180' : ''}`} />
            </button>

            {isHistoryExpanded && (
              <div className="mt-6 animate-in slide-in-from-top-2 fade-in duration-300">
                {isLoadingHistory ? (
                  <div className="space-y-4 animate-pulse">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-20 bg-slate-100 rounded-2xl w-full"></div>
                    ))}
                  </div>
                ) : history.length > 0 ? (
                  <div className="space-y-4">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setCurrentResult(item)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all hover:border-purple-300 hover:shadow-md ${
                          currentResult?.id === item.id
                            ? 'border-purple-500 bg-purple-50/50'
                            : 'border-slate-100 bg-slate-50/50'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-slate-700 capitalize">
                            {item.theme}
                          </span>
                          <span className="text-[10px] font-bold bg-white border border-slate-200 px-2 py-1 rounded-md text-slate-500 uppercase tracking-wider">
                            {item.contentType}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 line-clamp-2">{item.copy}</p>
                        <p className="text-[11px] font-semibold text-slate-400 mt-3">
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
            )}
          </div>
        </div>
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
