'use client';

import { Copy, Image as ImageIcon, Sparkles, Download, ExternalLink, RefreshCw, Bot, Target, CheckCircle2, ChevronRight, LayoutList, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';

interface CopyBlock {
  title?: string;
  copy: string;
  hashtags: string[];
  cta: string;
}

interface Props {
  content: {
    id: string;
    contentType: string;
    theme: string;
    title?: string | null;
    copy: string;
    hashtags: string[];
    cta: string;
    imagePrompt: string;
    cosmicContext?: string | null;
    createdAt: string;
    geminiCopy?: CopyBlock | null;
    gptCopy?: CopyBlock | null;
    copyTitle?: string;
    copyCaption?: string;
    caption?: string;
    contextUsed?: {
      contentType: string;
      theme: string;
      notes: string;
      cosmicContext: string;
      therapeuticIntention?: string;
    };
  };
}

export function CosmicResultCard({ content }: Props) {
  const [activeAsset, setActiveAsset] = useState('copy');

  const gptVersion: CopyBlock = content.gptCopy || {
    title: `Post sobre ${content.theme}`,
    copy: content.copy,
    hashtags: content.hashtags,
    cta: content.cta
  };

  const geminiVersion: CopyBlock = content.geminiCopy || gptVersion;

  const displayTitle = content.copyTitle || content.title || 'Título da Publicação';
  const displayCaption = content.copyCaption || content.caption || content.copy || 'Nenhuma legenda gerada.';

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado!`);
  };

  const formatCopyBlock = (block: CopyBlock) => {
    const formattedHashtags = block.hashtags.join(' ');
    return `${block.title ? block.title + '\n\n' : ''}${block.copy}\n\n${block.cta}\n\n${formattedHashtags}`;
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* TOPO: CONTEXTO CRIADO */}
      {content.contextUsed && (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-500" /> Contexto Base da Geração
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Formato</p>
              <p className="text-sm font-semibold text-slate-700">{content.contextUsed.contentType}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tema Central</p>
              <p className="text-sm font-semibold text-slate-700">{content.contextUsed.theme}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Energia da Semana</p>
              <p className="text-sm font-semibold text-slate-700">{content.contextUsed.cosmicContext}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Observações</p>
              <p className="text-sm font-semibold text-slate-700">{content.contextUsed.notes || 'Nenhuma observação'}</p>
            </div>
          </div>
        </div>
      )}

      {/* HEADER PRINCIPAL + 4 BOTÕES (TABS) */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* HEADER */}
        <div className="border-b border-slate-100 bg-slate-50/50 p-6 md:p-8 text-center sm:text-left">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center justify-center sm:justify-start gap-2">
            <LayoutList className="w-4 h-4" /> Kit de Campanha Pronta
          </h2>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
            Você tem ativos prontos para publicação
          </h1>
          <p className="text-slate-500 text-[15px] md:text-base">
            Selecione uma opção abaixo para ver os detalhes e utilizar o material gerado.
          </p>
        </div>

        {/* 3 BOTÕES */}
        <div className="p-6 md:p-8 bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            
            {/* Botão Copy */}
            <button
              onClick={() => setActiveAsset('copy')}
              className={`flex flex-col items-center p-6 rounded-3xl border-2 transition-all ${
                activeAsset === 'copy' 
                  ? 'border-indigo-500 bg-indigo-50 shadow-md transform scale-[1.02]' 
                  : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'
              }`}
            >
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 text-indigo-600">
                  <Copy className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2 text-center">Sugestão de Copy</h3>
                <p className="text-sm text-slate-500 text-center max-w-[220px]">Texto completo e persuasivo pronto para colar junto à imagem.</p>
            </button>

            {/* Botão Gemini */}
            <button
              onClick={() => setActiveAsset('gemini')}
              className={`flex flex-col items-center p-6 rounded-3xl border-2 transition-all ${
                activeAsset === 'gemini' 
                  ? 'border-purple-500 bg-purple-50 shadow-md transform scale-[1.02]' 
                  : 'border-slate-200 bg-white hover:border-purple-300 hover:bg-slate-50'
              }`}
            >
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 text-purple-600">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-2 text-center">Prompt para Imagem Gemini</h3>
              <p className="text-sm text-slate-500 text-center max-w-[220px]">Utilize este prompt diretamente no Gemini para gerar uma imagem alinhada ao contexto criado.</p>
            </button>

            {/* Botão GPT */}
            <button
              onClick={() => setActiveAsset('gpt')}
              className={`flex flex-col items-center p-6 rounded-3xl border-2 transition-all ${
                activeAsset === 'gpt' 
                  ? 'border-emerald-500 bg-emerald-50 shadow-md transform scale-[1.02]' 
                  : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50'
              }`}
            >
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 text-emerald-600">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-2 text-center">Prompt para Imagem GPT</h3>
              <p className="text-sm text-slate-500 text-center max-w-[220px]">Utilize este prompt diretamente no ChatGPT para gerar uma imagem alinhada ao contexto criado.</p>
            </button>

          </div>
        </div>
      </div>

      {/* ÁREA DE DETALHE (FULL WIDTH) */}
      <div className="min-h-[400px]">
        
        {/* DETALHE COPY */}
        {activeAsset === 'copy' && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300 grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
            <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 flex flex-col h-full">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Copy className="w-5 h-5 text-indigo-500" /> Sugestão de Copy
              </h3>
              <p className="text-sm text-slate-500 mb-6">Utilize este conteúdo junto da imagem gerada.</p>
              
              <hr className="border-slate-100 mb-6" />

              <div className="mb-8">
                <h5 className="font-bold text-slate-400 text-xs tracking-wider uppercase mb-3">TÍTULO</h5>
                <div className="bg-slate-50 rounded-2xl p-4 md:p-5 border border-slate-100 mb-4">
                  <p className="text-lg font-bold text-slate-800">{displayTitle}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(displayTitle, 'Título')}
                  className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-3 px-6 rounded-xl border border-indigo-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Copy className="w-5 h-5" /> Copiar Título
                </button>
              </div>

              <hr className="border-slate-100 mb-6" />

              <div className="flex-1 flex flex-col">
                <h5 className="font-bold text-slate-400 text-xs tracking-wider uppercase mb-3">LEGENDA</h5>
                <div className="bg-slate-50 rounded-2xl p-4 md:p-5 border border-slate-100 flex-1 overflow-y-auto mb-4">
                  <p className="text-[15px] text-slate-600 whitespace-pre-wrap leading-relaxed mb-6">{displayCaption}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(displayCaption, 'Legenda')}
                  className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-3 px-6 rounded-xl border border-indigo-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Copy className="w-5 h-5" /> Copiar Legenda
                </button>
              </div>
            </div>
            <div className="lg:col-span-2 bg-indigo-50/50 border border-indigo-100 rounded-3xl p-6 md:p-8 flex flex-col h-full">
               <h3 className="text-xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
                <LayoutList className="w-5 h-5 text-indigo-500" /> Como Utilizar
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Este é um copy persuasivo estruturado para o seu público. Copie o texto, faça os ajustes necessários conforme sua voz de marca e publique junto com a imagem gerada.
              </p>
            </div>
          </div>
        )}

        {/* DETALHE GEMINI */}
        {activeAsset === 'gemini' && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300 grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
            
            {/* O Ativo */}
            <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 flex flex-col h-full">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" /> O que foi gerado
              </h3>
              
              <div className="bg-slate-50 rounded-2xl p-5 md:p-6 border border-slate-100 flex-1 overflow-y-auto mb-6">
                {geminiVersion.title && <h5 className="font-bold text-slate-800 text-lg mb-4">{geminiVersion.title}</h5>}
                <p className="text-[15px] text-slate-600 whitespace-pre-wrap leading-relaxed mb-6">{geminiVersion.copy}</p>
                {geminiVersion.cta && <p className="text-[15px] font-semibold text-slate-800 mb-6">{geminiVersion.cta}</p>}
                {geminiVersion.hashtags && geminiVersion.hashtags.length > 0 && <p className="text-[15px] text-purple-600 font-medium break-words">{geminiVersion.hashtags.join(' ')}</p>}
              </div>

              <button
                onClick={() => copyToClipboard(formatCopyBlock(geminiVersion), 'Prompt Gemini')}
                className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold py-4 px-6 rounded-xl border border-purple-200 transition-colors flex items-center justify-center gap-2"
              >
                <Copy className="w-5 h-5" /> Copiar Prompt Completo
              </button>
            </div>

            {/* Como Usar */}
            <div className="lg:col-span-2 bg-purple-50/50 border border-purple-100 rounded-3xl p-6 md:p-8 flex flex-col h-full">
              <h3 className="text-xl font-bold text-purple-900 mb-6 flex items-center gap-2">
                <LayoutList className="w-5 h-5 text-purple-500" /> Como Utilizar
              </h3>
              
              <ol className="flex flex-col gap-4 mb-8">
                <li className="bg-white p-4 rounded-xl shadow-sm border border-purple-50 flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center shrink-0">1</span>
                  <span className="text-sm md:text-base font-medium text-slate-700">Abra o Google Gemini.</span>
                </li>
                <li className="bg-white p-4 rounded-xl shadow-sm border border-purple-50 flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center shrink-0">2</span>
                  <span className="text-sm md:text-base font-medium text-slate-700">Crie um novo chat.</span>
                </li>
                <li className="bg-white p-4 rounded-xl shadow-sm border border-purple-50 flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center shrink-0">3</span>
                  <span className="text-sm md:text-base font-medium text-slate-700">Cole o prompt copiado ao lado.</span>
                </li>
                <li className="bg-white p-4 rounded-xl shadow-sm border border-purple-50 flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center shrink-0">4</span>
                  <span className="text-sm md:text-base font-medium text-slate-700">Revise e utilize o resultado.</span>
                </li>
              </ol>

              <div className="mt-auto">
                <button
                  onClick={() => window.open('https://gemini.google.com', '_blank')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md shadow-purple-600/20 flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-5 h-5" /> Abrir Google Gemini
                </button>
              </div>
            </div>

          </div>
        )}

        {/* DETALHE GPT */}
        {activeAsset === 'gpt' && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300 grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
            
            {/* O Ativo */}
            <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 flex flex-col h-full">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Bot className="w-5 h-5 text-emerald-500" /> O que foi gerado
              </h3>
              
              <div className="bg-slate-50 rounded-2xl p-5 md:p-6 border border-slate-100 flex-1 overflow-y-auto mb-6">
                {gptVersion.title && <h5 className="font-bold text-slate-800 text-lg mb-4">{gptVersion.title}</h5>}
                <p className="text-[15px] text-slate-600 whitespace-pre-wrap leading-relaxed mb-6">{gptVersion.copy}</p>
                {gptVersion.cta && <p className="text-[15px] font-semibold text-slate-800 mb-6">{gptVersion.cta}</p>}
                {gptVersion.hashtags && gptVersion.hashtags.length > 0 && <p className="text-[15px] text-emerald-600 font-medium break-words">{gptVersion.hashtags.join(' ')}</p>}
              </div>

              <button
                onClick={() => copyToClipboard(formatCopyBlock(gptVersion), 'Prompt GPT')}
                className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold py-4 px-6 rounded-xl border border-emerald-200 transition-colors flex items-center justify-center gap-2"
              >
                <Copy className="w-5 h-5" /> Copiar Prompt Completo
              </button>
            </div>

            {/* Como Usar */}
            <div className="lg:col-span-2 bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6 md:p-8 flex flex-col h-full">
              <h3 className="text-xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
                <LayoutList className="w-5 h-5 text-emerald-500" /> Como Utilizar
              </h3>
              
              <ol className="flex flex-col gap-4 mb-8">
                <li className="bg-white p-4 rounded-xl shadow-sm border border-emerald-50 flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0">1</span>
                  <span className="text-sm md:text-base font-medium text-slate-700">Abra o ChatGPT.</span>
                </li>
                <li className="bg-white p-4 rounded-xl shadow-sm border border-emerald-50 flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0">2</span>
                  <span className="text-sm md:text-base font-medium text-slate-700">Inicie uma nova conversa.</span>
                </li>
                <li className="bg-white p-4 rounded-xl shadow-sm border border-emerald-50 flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0">3</span>
                  <span className="text-sm md:text-base font-medium text-slate-700">Cole o prompt copiado ao lado.</span>
                </li>
                <li className="bg-white p-4 rounded-xl shadow-sm border border-emerald-50 flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0">4</span>
                  <span className="text-sm md:text-base font-medium text-slate-700">Revise e utilize o resultado.</span>
                </li>
              </ol>

              <div className="mt-auto">
                <button
                  onClick={() => window.open('https://chatgpt.com', '_blank')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-5 h-5" /> Abrir ChatGPT
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* DICA RÁPIDA DE PUBLICAÇÃO */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 mt-4">
        <div className="p-4 bg-white rounded-2xl shadow-sm border border-indigo-50 shrink-0">
          <Sparkles className="w-7 h-7 text-indigo-500" />
        </div>
        <div>
          <h4 className="font-bold text-indigo-900 text-lg mb-2">Dica Rápida de Uso</h4>
          <p className="text-indigo-800/80 text-[15px] leading-relaxed">
            Use primeiro o <strong>Gemini</strong> para explorar ideias e testar narrativas. 
            Depois, utilize o <strong>ChatGPT</strong> para estruturar e refinar.
          </p>
        </div>
      </div>

    </div>
  );
}
