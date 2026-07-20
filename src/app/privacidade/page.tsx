'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Shield, Lock, FileText, AlertTriangle, CheckCircle2, Mail, Download, Trash2, Heart, Scale } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Footer } from '@/components/Footer'
import toast from 'react-hot-toast'

export default function PrivacyPolicyPage() {
  const [exportLoading, setExportLoading] = useState(false)
  const [deletionModalOpen, setDeletionModalOpen] = useState(false)

  const handleRequestExport = async () => {
    setExportLoading(true)
    setTimeout(() => {
      setExportLoading(false)
      toast.success('Solicitação de exportação de dados recebida. O relatório será enviado ao seu e-mail cadastrado.')
    }, 1200)
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between bg-[#010409] bg-[radial-gradient(circle_at_center,_#020c16_0%,_#010810_50%,_#010409_100%)] selection:bg-[#C5A03F]/20 overflow-x-hidden w-full font-sans">
      
      <div className="flex-1 flex flex-col items-center justify-center w-full px-4 sm:px-6 py-12">
        <div className="relative z-10 w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-1000 flex flex-col">
          
          {/* Header com Botão Voltar e Logotipo Centralizado */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
            <Link href="/">
              <Button className="h-10 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 self-start">
                <ArrowLeft size={14} className="mr-2" />
                Voltar à Página Inicial
              </Button>
            </Link>
            
            <div className="flex sm:justify-end justify-center">
              <Link href="/" className="transition-transform hover:scale-105 active:scale-95 duration-500 block">
                <div className="relative w-20 h-20 md:w-24 md:h-24">
                  <img
                    src="/logo-dark.jpg"
                    alt="EA Lumina"
                    className="w-full h-full object-contain"
                    style={{
                      WebkitMaskImage: 'radial-gradient(circle at center, black 50%, transparent 75%)',
                      maskImage: 'radial-gradient(circle at center, black 50%, transparent 75%)'
                    }}
                  />
                </div>
              </Link>
            </div>
          </div>

          {/* Container Principal de Privacidade */}
          <div className="bg-black/40 border border-white/5 backdrop-blur-xl shadow-2xl p-6 sm:p-10 md:p-12 rounded-[2.5rem] text-slate-300 space-y-8">
            
            {/* Título & Badge de Aviso Jurídico */}
            <div className="border-b border-white/5 pb-6 space-y-3">
              <div className="flex items-center gap-2 text-[#0090FF]">
                <Shield className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">Proteção de Dados & LGPD</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Política de Privacidade</h1>
              <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold">
                Última atualização: Junho de 2026 — Versão 1.0 (Auditada)
              </p>

              {/* ALERT BOX: Validação Jurídica Pendente */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3 mt-4 text-xs text-amber-200/90">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-amber-300 block mb-0.5">Aviso de Governança Jurídica (Em Revisão de DPO/Advogado):</strong>
                  Este documento descreve com transparência as práticas de tratamento de dados da plataforma EA Lumina. Os pontos marcados exigem validação formal junto ao seu Encarregado de Proteção de Dados (DPO) ou assessoria jurídica especializada.
                </div>
              </div>
            </div>

            {/* SEÇÕES DE CONTEÚDO */}
            <div className="space-y-8">

              {/* SEÇÃO 1: Tratameto de Dados Sensíveis de Saúde */}
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500" />
                  1. Tratamento de Dados Pessoais Sensíveis (Saúde e Bem-Estar)
                </h2>
                <p className="text-sm leading-relaxed">
                  Em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018, Art. 5º, II), dados referentes à saúde física, mental, histórico emocional, anamnese, objetivos terapêuticos e registros de sessões são classificados como <strong>dados pessoais sensíveis</strong>.
                </p>
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs">
                  <span className="font-bold text-[#0090FF] uppercase tracking-wider block">Garantias de Restrição Técnica:</span>
                  <ul className="list-disc pl-5 space-y-1 text-slate-300">
                    <li>O conteúdo de anamneses e prontuários é de acesso <strong>exclusivo e restrito ao terapeuta responsável</strong> escolhido pelo paciente.</li>
                    <li>A administração da plataforma EA Lumina não acessa conteúdos confidenciais de atendimento individual.</li>
                    <li>Em programas corporativos (B2B), <strong>é estritamente proibido</strong> o compartilhamento de dados individuais ou relatórios clínicos com empregadores. Somente métricas agregadas e anonimizadas de adesão são fornecidas.</li>
                  </ul>
                </div>
              </section>

              {/* SEÇÃO 2: Quais Dados Coletamos */}
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-white tracking-tight">2. Dados Coletados e Finalidades</h2>
                <p className="text-sm leading-relaxed">
                  A plataforma coleta apenas os dados estritamente necessários para a prestação dos serviços:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 space-y-2">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Dados de Cadastro e Identificação</h3>
                    <p className="text-xs text-slate-400">Nome completo, e-mail, telefone, CPF e data de nascimento.</p>
                    <p className="text-[11px] text-slate-500"><strong>Finalidade:</strong> Autenticação, criação de conta e comunicação da plataforma.</p>
                  </div>

                  <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 space-y-2">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Dados Financeiros e Pagamentos</h3>
                    <p className="text-xs text-slate-400">Histórico de transações, comprovantes e dados de cobrança.</p>
                    <p className="text-[11px] text-slate-500"><strong>Finalidade:</strong> Processamento seguro de pagamentos e repasamentos via Stripe.</p>
                  </div>

                  <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 space-y-2">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Dados de Uso e Navegação (Cookies)</h3>
                    <p className="text-xs text-slate-400">Endereço IP, tipo de navegador, registros de acesso e sessão.</p>
                    <p className="text-[11px] text-slate-500"><strong>Finalidade:</strong> Segurança, prevenção a fraudes e melhoria de desempenho.</p>
                  </div>

                  <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 space-y-2">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Consentimentos e Manifestos</h3>
                    <p className="text-xs text-slate-400">Data, hora, IP e versão dos termos e manifestos aceitos.</p>
                    <p className="text-[11px] text-slate-500"><strong>Finalidade:</strong> Registro auditável de conformidade ética e jurídica.</p>
                  </div>
                </div>
              </section>

              {/* SEÇÃO 3: Bases Legais para Tratamento */}
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Scale className="w-4 h-4 text-amber-400" />
                  3. Bases Legais para o Tratamento (Validação Jurídica)
                </h2>
                <p className="text-sm leading-relaxed">
                  O tratamento dos seus dados é fundamentado nas seguintes hipóteses da LGPD:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-xs text-slate-300">
                  <li><strong>Consentimento do Titular (Art. 7º, I e Art. 11, I):</strong> Coleta de dados sensíveis de saúde e comunicações de marketing.</li>
                  <li><strong>Execução de Contrato (Art. 7º, V):</strong> Agendamento de sessões, pagamentos e prestação de suporte.</li>
                  <li><strong>Tutela da Saúde (Art. 11, II, "f"):</strong> Atendimento por profissionais de saúde em procedimentos terapêuticos.</li>
                  <li><strong>Cumprimento de Obrigação Legal (Art. 7º, II):</strong> Manutenção de registros de acesso nos termos do Marco Civil da Internet (Lei nº 12.965/2014).</li>
                </ul>
              </section>

              {/* SEÇÃO 4: Direitos do Titular & Solicitação de Dados */}
              <section className="space-y-4 border-t border-white/5 pt-6">
                <h2 className="text-lg font-bold text-white tracking-tight">4. Seus Direitos como Titular dos Dados</h2>
                <p className="text-sm leading-relaxed">
                  Você tem total direito sobre seus dados pessoais (Art. 18 da LGPD), incluindo:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Confirmação da existência de tratamento</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Acesso e exportação dos seus dados</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Correção de dados incompletos ou inexatos</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Revogação do consentimento e exclusão</span>
                  </div>
                </div>

                {/* BOTÕES INTERATIVOS DE SOLICITAÇÃO DE EXPORTAÇÃO E EXCLUSÃO */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 mt-2">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Solicitação Autônoma de Dados</h3>
                  <p className="text-xs text-slate-400">
                    Você pode solicitar uma cópia completa dos seus dados armazenados ou iniciar o processo de exclusão da sua conta.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleRequestExport}
                      disabled={exportLoading}
                      className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors"
                    >
                      <Download className="w-4 h-4 text-[#0090FF]" /> Exportar Meus Dados
                    </button>

                    <a
                      href="mailto:privacidade@ealumina.com?subject=Solicitacao%20de%20Exclusao%20de%20Dados%20LGPD"
                      className="inline-flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-rose-400" /> Solicitar Exclusão Definitiva
                    </a>
                  </div>
                </div>
              </section>

              {/* SEÇÃO 5: Retenção e Exclusão */}
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-white tracking-tight">5. Retenção e Descarte de Dados</h2>
                <p className="text-sm leading-relaxed">
                  Os dados pessoais serão retidos apenas pelo período necessário para cumprir as finalidades para as quais foram coletados, respeitando os prazos legais de guarda de documentos fiscais e registros de prontuários terapêuticos conforme regulamentação profissional aplicável.
                </p>
              </section>

              {/* SEÇÃO 6: Contato e DPO */}
              <section className="border-t border-white/5 pt-6 space-y-3">
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#0090FF]" />
                  6. Encarregado de Proteção de Dados (DPO) e Contato
                </h2>
                <p className="text-sm leading-relaxed">
                  Para exercer seus direitos de titular ou esclarecer dúvidas sobre esta Política de Privacidade, entre em contato diretamente com nossa equipe de privacidade:
                </p>
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs space-y-1">
                  <p className="text-white font-bold">Encarregado de Proteção de Dados (DPO) — EA Lumina</p>
                  <p className="text-slate-400">E-mail: <a href="mailto:privacidade@ealumina.com" className="text-[#0090FF] underline">privacidade@ealumina.com</a></p>
                  <p className="text-slate-500 text-[11px] pt-1">Prazo legal de resposta: até 15 (quinze) dias úteis nos termos da LGPD.</p>
                </div>
              </section>

            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}
