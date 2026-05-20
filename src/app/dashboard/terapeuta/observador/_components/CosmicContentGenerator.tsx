'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sparkles, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const generateSchema = z.object({
  contentType: z.string().min(1, 'Selecione o tipo de conteúdo'),
  theme: z.string().min(1, 'Selecione um tema principal'),
  additionalNotes: z.string().optional(),
});

type GenerateData = z.infer<typeof generateSchema>;

interface Props {
  onGenerate: (data: any) => void;
  bestTopics: string[];
}

export function CosmicContentGenerator({ onGenerate, bestTopics }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GenerateData>({
    resolver: zodResolver(generateSchema),
  });

  const onSubmit = async (data: GenerateData) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/cosmic-content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Falha ao gerar conteúdo');

      const json = await res.json();
      toast.success('Conteúdo gerado com sucesso!');
      onGenerate(json.data);
    } catch (error) {
      toast.error('Erro ao gerar conteúdo. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <h2 className="text-xl font-semibold text-slate-800 mb-6">Criar Novo Post</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Formato
          </label>
          <select
            {...register('contentType')}
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          >
            <option value="">Selecione o formato...</option>
            <option value="post">Post (Feed)</option>
            <option value="carrossel">Carrossel</option>
            <option value="reels">Reels / TikTok (Roteiro)</option>
            <option value="story">Story (Sequência)</option>
          </select>
          {errors.contentType && (
            <p className="mt-1 text-xs text-red-500">{errors.contentType.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Tema Central
          </label>
          <select
            {...register('theme')}
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          >
            <option value="">Selecione um tema...</option>
            <optgroup label="Em Alta (Energia da Semana)">
              {bestTopics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic.charAt(0).toUpperCase() + topic.slice(1)}
                </option>
              ))}
            </optgroup>
            <optgroup label="Tópicos Comuns">
              <option value="ansiedade">Ansiedade</option>
              <option value="relacionamentos">Relacionamentos</option>
              <option value="autoestima">Autoestima</option>
              <option value="propósito">Propósito de Vida</option>
            </optgroup>
          </select>
          {errors.theme && (
            <p className="mt-1 text-xs text-red-500">{errors.theme.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Observações (Opcional)
          </label>
          <textarea
            {...register('additionalNotes')}
            rows={3}
            placeholder="Ex: Focar em dicas práticas para rotina matinal..."
            className="w-full rounded-lg border border-slate-200 px-4 py-2.5 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-medium shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Sparkles className="h-5 w-5" />
          )}
          {isLoading ? 'Conectando com o cosmos...' : 'Gerar Conteúdo'}
        </button>
      </form>
    </div>
  );
}
