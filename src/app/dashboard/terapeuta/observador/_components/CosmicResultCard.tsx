'use client';

import { Copy, Image as ImageIcon, MessageSquare, Hash, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  content: {
    id: string;
    contentType: string;
    theme: string;
    copy: string;
    hashtags: string[];
    cta: string;
    imagePrompt: string;
    cosmicContext?: string | null;
    createdAt: string;
  };
}

export function CosmicResultCard({ content }: Props) {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado!`);
  };

  const formattedHashtags = content.hashtags.join(' ');
  const fullText = `${content.copy}\n\n${content.cta}\n\n${formattedHashtags}`;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-800">Resultado</h2>
        <span className="text-xs font-medium bg-purple-50 text-purple-700 px-3 py-1 rounded-full uppercase tracking-wider">
          {content.contentType} • {content.theme}
        </span>
      </div>

      <div className="space-y-6 flex-1">
        {/* COPY */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-purple-500" />
              Legenda (Copy)
            </h3>
            <button
              onClick={() => copyToClipboard(fullText, 'Texto')}
              className="text-xs font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-2 py-1 rounded transition-colors"
            >
              Copiar Tudo
            </button>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600 whitespace-pre-wrap border border-slate-100">
            {content.copy}
            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="font-medium text-slate-800">{content.cta}</p>
            </div>
            <div className="mt-4 text-purple-600 font-medium break-words">
              {formattedHashtags}
            </div>
          </div>
        </div>

        {/* IMAGE PROMPT */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-indigo-500" />
              Prompt Visual (Para IA)
            </h3>
            <button
              onClick={() => copyToClipboard(content.imagePrompt, 'Prompt')}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-2 py-1 rounded transition-colors flex items-center gap-1"
            >
              <Copy className="h-3 w-3" /> Copiar
            </button>
          </div>
          <div className="bg-indigo-50/50 rounded-xl p-4 text-sm text-indigo-900 border border-indigo-100 italic">
            "{content.imagePrompt}"
          </div>
        </div>

        {/* CONTEXTO */}
        {content.cosmicContext && (
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Alinhamento Cósmico
            </h3>
            <p className="text-sm text-slate-500">
              {content.cosmicContext}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
