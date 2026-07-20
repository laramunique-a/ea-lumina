'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Building2, Users, ShieldCheck, BarChart3, Lock, CheckCircle2,
  ArrowRight, Sparkles, HeartHandshake, AlertCircle, FileText, Send
} from 'lucide-react'
import toast from 'react-hot-toast'
import { Footer } from '@/components/Footer'

export default function CorporatePage() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    employeeCount: '10-50',
    industry: '',
    mainChallenges: '',
    desiredProgram: 'Integrativo Geral',
    honeypot: '',
  })

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch('/api/corporate-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (data.success) {
        toast.success(data.message)
        setSubmitted(true)
      } else {
        toast.error(data.error || 'Erro ao enviar o formulário.')
      }
    } catch (error) {
      toast.error('Erro de conexão ao enviar solicitação.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#010409] text-slate-100 font-sans">
      
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#010409]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/logo-dark.jpg"
              alt="EA Lumina"
              className="w-8 h-8 object-contain"
              style={{ WebkitMaskImage: 'radial-gradient(circle at center, black 50%, transparent 80%)', maskImage: 'radial-gradient(circle at center, black 50%, transparent 80%)' }}
            />
            <span className="font-black text-sm uppercase tracking-[0.2em] text-white">EA Lumina</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-xs font-semibold text-slate-400 hover:text-white transition-colors uppercase tracking-wider">
              Início
            </Link>
            <Link href="/terapeutas" className="text-xs font-semibold text-slate-400 hover:text-white transition-colors uppercase tracking-wider">
              Rede Lumina
            </Link>
            <Link href="/empresas" className="text-xs font-semibold text-white uppercase tracking-wider">
              Empresas
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <a href="#contato" className="text-xs font-black uppercase tracking-wider bg-[#0090FF] hover:bg-[#007adb] text-white px-4 py-2 rounded-xl transition-colors">
              Falar com Consultor
            </a>
          </div>
        </div>
      </header>

      <main className="space-y-24 py-12">

        {/* 1. HERO CORPORATIVO */}
        <section className="max-w-6xl mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#0090FF]/10 border border-[#0090FF]/20 px-4 py-1.5 rounded-full text-xs font-bold text-[#0090FF] uppercase tracking-widest">
            <Building2 className="w-4 h-4" /> Soluções para Saúde Mental e Bem-Estar Organizacional
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Ecossistema de Cuidado Integrativo para sua Empresa
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Desenvolvemos programas corporativos sob medida para apoiar a saúde emocional e mental da sua equipe através da Rede Lumina de terapeutas credenciados.
          </p>

          <div className="flex justify-center pt-4">
            <a
              href="#contato"
              className="inline-flex items-center gap-2 bg-[#0090FF] hover:bg-[#007adb] text-white font-black text-sm uppercase tracking-wider px-8 py-4 rounded-2xl transition-all"
            >
              Agendar Diagnóstico Institucional <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* MARCO LEGAL LEI 14.831/2024 */}
        <section className="max-w-5xl mx-auto px-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start gap-5">
            <FileText className="w-8 h-8 text-[#C5A03F] shrink-0 mt-1" />
            <div className="space-y-2">
              <h3 className="text-base font-bold text-white uppercase tracking-wider">Marco Legal e Diretrizes Nacionais</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                “A Lei nº 14.831/2024 instituiu o Certificado Empresa Promotora da Saúde Mental e estabeleceu diretrizes relacionadas à promoção da saúde mental e do bem-estar no trabalho.”
              </p>
              <p className="text-[11px] text-slate-500 italic">
                * Nossos programas são desenhados para apoiar a construção de ambientes saudáveis alinhados a estas diretrizes.
              </p>
            </div>
          </div>
        </section>

        {/* 2. PROBLEMAS ORGANIZACIONAIS */}
        <section className="max-w-6xl mx-auto px-4 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-white">Desafios Reais no Ambiente de Trabalho</h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              A exaustão mental e o estresse corporativo impactam diretamente a retenção de talentos e a produtividade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-3">
              <span className="text-xs font-black text-rose-400 uppercase tracking-wider">Burnout e Exaustão</span>
              <h3 className="text-base font-bold text-white">Sobrecarga Emocional</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Aumento das taxas de afastamento e diminuição do engajamento gerados por estresse crônico não acolhido.</p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-3">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider">Absenteísmo</span>
              <h3 className="text-base font-bold text-white">Falta de Suporte Preventivo</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Colaboradores sem acesso a espaços seguros de escuta buscam auxílio tardiamente, agravando o quadro.</p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 space-y-3">
              <span className="text-xs font-black text-blue-400 uppercase tracking-wider">Clima Organizacional</span>
              <h3 className="text-base font-bold text-white">Necessidade de Cuidado Humano</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Empresas que priorizam a saúde mental criam ambientes de maior segurança psicológica e retenção.</p>
            </div>
          </div>
        </section>

        {/* 3. O DIAGNÓSTICO & 4. ECOSSISTEMA */}
        <section className="max-w-6xl mx-auto px-4 bg-slate-900/50 border border-white/5 rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-black uppercase tracking-widest text-[#0090FF]">Como Atuamos</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">Do Diagnóstico à Prática Integrativa</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Não oferecemos pacotes genéricos. Começamos com uma escuta ativa dos principais desafios da empresa para desenhar um programa corporativo verdadeiramente efetivo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#0090FF]/10 text-[#0090FF] font-black flex items-center justify-center text-sm">1</div>
              <h3 className="text-sm font-bold text-white">Diagnóstico Inicial</h3>
              <p className="text-xs text-slate-400">Mapeamento dos principais desafios e objetivos organizacionais.</p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#C5A03F]/10 text-[#C5A03F] font-black flex items-center justify-center text-sm">2</div>
              <h3 className="text-sm font-bold text-white">Curadoria da Rede</h3>
              <p className="text-xs text-slate-400">Seleção de terapeutas credenciados com especialização adequada.</p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#0090FF]/10 text-[#0090FF] font-black flex items-center justify-center text-sm">3</div>
              <h3 className="text-sm font-bold text-white">Sessões e Práticas</h3>
              <p className="text-xs text-slate-400">Atendimentos individuais ou em grupo presenciais/online.</p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#C5A03F]/10 text-[#C5A03F] font-black flex items-center justify-center text-sm">4</div>
              <h3 className="text-sm font-bold text-white">Relatórios Agregados</h3>
              <p className="text-xs text-slate-400">Indicadores consolidados de engajamento sem violação de privacidade.</p>
            </div>
          </div>
        </section>

        {/* 7. CONFIDENCIALIDADE ABSOLUTA */}
        <section className="max-w-5xl mx-auto px-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6">
            <Lock className="w-12 h-12 text-[#C5A03F] shrink-0" />
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-lg font-bold text-white">Garantia de Confidencialidade e LGPD</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Os futuros relatórios empresariais utilizam exclusivamente dados agregados e anônimos. A contratante nunca terá acesso a prontuários, conteúdos de sessões ou histórico individual de colaboradores. O sigilo terapêutico é absoluto.
              </p>
            </div>
          </div>
        </section>

        {/* 9. FORMULÁRIO DE CONTATO / CTA REUNIÃO */}
        <section id="contato" className="max-w-4xl mx-auto px-4">
          <div className="bg-slate-900 border border-[#0090FF]/30 rounded-3xl p-8 sm:p-10 space-y-8">
            <div className="text-center space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-[#0090FF]">Fale com um Consultor</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Solicite uma Proposta Personalizada</h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
                Preencha os dados abaixo e nossa equipe entrará em contato para agendar uma reunião de diagnóstico.
              </p>
            </div>

            {submitted ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl p-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">Solicitação Recebida!</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Agradecemos o contato. Um dos nossos consultores de saúde integrativa entrará em contato com sua empresa em até 24 horas úteis.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="honeypot" value={formData.honeypot} onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })} className="hidden" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Nome da Empresa *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Lumina Tech"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#0090FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Nome do Responsável *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Maria Silva (RH)"
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#0090FF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">E-mail Corporativo *</label>
                    <input
                      type="email"
                      required
                      placeholder="rh@suaempresa.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#0090FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Telefone / WhatsApp</label>
                    <input
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#0090FF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Número de Colaboradores</label>
                    <select
                      value={formData.employeeCount}
                      onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-300 focus:outline-none focus:border-[#0090FF]"
                    >
                      <option value="1-10">1 a 10 colaboradores</option>
                      <option value="11-50">11 a 50 colaboradores</option>
                      <option value="51-200">51 a 200 colaboradores</option>
                      <option value="201-1000">201 a 1.000 colaboradores</option>
                      <option value="1000+">Mais de 1.000 colaboradores</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Setor da Empresa</label>
                    <input
                      type="text"
                      placeholder="Ex: Tecnologia, Saúde, Educação"
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#0090FF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Principais Desafios de Saúde Mental</label>
                  <textarea
                    rows={3}
                    placeholder="Descreva resumidamente as demandas da equipe..."
                    value={formData.mainChallenges}
                    onChange={(e) => setFormData({ ...formData, mainChallenges: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#0090FF]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#0090FF] hover:bg-[#007adb] disabled:opacity-50 text-white font-black text-sm uppercase tracking-wider py-4 rounded-xl transition-all"
                >
                  {submitting ? 'Enviando...' : 'Enviar Solicitação de Diagnóstico'}
                  <Send className="w-4 h-4" />
                </button>

                <p className="text-[10px] text-slate-500 text-center">
                  Ao enviar, você concorda com nosso contato comercial restrito à solicitação. Não enviamos spam.
                </p>
              </form>
            )}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
