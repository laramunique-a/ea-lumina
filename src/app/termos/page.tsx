'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, ShieldAlert, HeartPulse, Bot, AlertTriangle, Scale, Lock, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Footer } from '@/components/Footer'

export default function TermsPage() {
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

          {/* Card de Termos com Glassmorphism */}
          <div className="bg-black/40 border border-white/5 backdrop-blur-xl shadow-2xl p-6 sm:p-10 md:p-12 rounded-[2.5rem] text-slate-300 space-y-8">
            
            <div className="border-b border-white/5 pb-6 space-y-2">
              <div className="flex items-center gap-2 text-[#C5A03F]">
                <Scale className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">Condições Gerais de Uso</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Termos de Uso</h1>
              <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold">
                Última atualização: Junho de 2026 — Versão 2.0 (Revisão Responsável)
              </p>
            </div>

            {/* AVISO DE EMERGÊNCIA - DESTACADO */}
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-5 flex items-start gap-4 text-xs text-rose-200">
              <HeartPulse className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="font-bold text-rose-300 text-sm block">Atenção em Caso de Urgência ou Crise de Saúde Mental:</strong>
                <p className="leading-relaxed">
                  A plataforma EA Lumina <strong>não presta atendimento médico de urgência ou emergência</strong>. Se você ou alguém que você conhece está passando por uma crise emocional grave, ideação suicida ou emergência médica, procure imediatamente o <strong>SAMU (192)</strong>, a <strong>UPA/Pronto-Socorro</strong> mais próximo ou ligue para o <strong>CVV (188)</strong>.
                </p>
              </div>
            </div>

            <div className="space-y-7">
              
              {/* 1. Natureza da Plataforma */}
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-white tracking-tight">1. Natureza de Intermediação Tecnológica</h2>
                <p className="text-sm leading-relaxed">
                  A <strong>EA Lumina</strong> é uma plataforma de tecnologia que conecta profissionais autônomos credenciados (Terapeutas) a pessoas interessadas em práticas integrativas e de autoconhecimento (Pacientes). A EA Lumina não presta diretamente serviços clínicos de medicina ou psicologia, atuando exclusivamente como intermediadora tecnológica e facilitadora de agendamentos e pagamentos.
                </p>
              </section>

              {/* 2. Limites das Práticas Integrativas e Complementares */}
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-white tracking-tight">2. Limites das Práticas Integrativas e Complementares</h2>
                <p className="text-sm leading-relaxed">
                  As abordagens oferecidas pelos profissionais parceiros tratam de práticas integrativas e voltadas ao bem-estar e ao desenvolvimento pessoal. <strong>Essas práticas não substituem consultas, diagnósticos ou tratamentos médicos, psicológicos ou psiquiátricos convencionais.</strong> Recomendamos que o paciente mantenha o acompanhamento com seus médicos de referência.
                </p>
              </section>

              {/* 3. Ausência de Garantia de Resultado */}
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-white tracking-tight">3. Ausência de Garantia de Resultados Clinicos</h2>
                <p className="text-sm leading-relaxed">
                  O desenvolvimento pessoal e o bem-estar são processos individuais e subjetivos. A EA Lumina e seus terapeutas parceiros não prometem, garantem ou asseguram cura, cura espiritual, tratamentos infalíveis ou resultados específicos. Os resultados variam conforme a singularidade de cada pessoa e de cada processo terapêutico.
                </p>
              </section>

              {/* 4. Responsabilidade do Terapeuta */}
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-white tracking-tight">4. Responsabilidade Profissional dos Terapeutas</h2>
                <p className="text-sm leading-relaxed">
                  Cada terapeuta cadastrado responde de forma autônoma, direta e exclusiva pela condução técnica, ética e profissional de seus atendimentos. Os profissionais declaram possuir a formação informada em seus perfis e comprometem-se a cumprir integralmente o <strong>Manifesto do Terapeuta da Rede Lumina</strong>.
                </p>
              </section>

              {/* 5. Cancelamentos, Reagendamentos e Reembolsos */}
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-white tracking-tight">5. Cancelamentos, Reagendamentos e Reembolsos</h2>
                <p className="text-sm leading-relaxed">
                  Os agendamentos e pagamentos são processados via integração segura com o Stripe:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-xs text-slate-300">
                  <li>Reagendamentos ou cancelamentos com mais de 24 horas de antecedência concedem direito a remarcação ou estorno sem penalidade.</li>
                  <li>Cancelamentos com menos de 24 horas de antecedência ou não comparecimento (no-show) poderão ensejar a retenção integral ou parcial da sessão para remunerar a agenda reservada do terapeuta.</li>
                </ul>
              </section>

              {/* 6. Pacientes Menores de Idade */}
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-white tracking-tight">6. Atendimento a Menores de Idade</h2>
                <p className="text-sm leading-relaxed">
                  A utilização da plataforma por menores de 18 anos exige o consentimento prévio expressamente manifestado por seus pais ou responsáveis legais, que deverão acompanhar ou autorizar expressamente os atendimentos.
                </p>
              </section>

              {/* 7. Ferramentas de IA e Proibição de Diagnóstico Automatizado */}
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Bot className="w-4 h-4 text-[#0090FF]" />
                  7. Conteúdo Gerado por IA e Proibição de Diagnóstico Automatizado
                </h2>
                <p className="text-sm leading-relaxed">
                  Quaisquer ferramentas de inteligência artificial ou questionários interativos disponibilizados na plataforma possuem caráter puramente educativo, informativo ou de apoio ao autoconhecimento. <strong>É terminantemente proibido utilizar ferramentas automatizadas para emissão de diagnósticos clínicos ou prescrições terapêuticas.</strong>
                </p>
              </section>

              {/* 8. Código de Conduta */}
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-white tracking-tight">8. Código de Conduta do Usuário</h2>
                <p className="text-sm leading-relaxed">
                  É vedado utilizar a plataforma para práticas ilegais, difamação, assédio, fraude ou violação da privacidade alheia. A violação deste código sujeita o infrator ao cancelamento imediato da conta e às sanções legais cabíveis.
                </p>
              </section>

              {/* 9. Privacidade e Dados Sensíveis */}
              <section className="space-y-3">
                <h2 className="text-lg font-bold text-white tracking-tight">9. Privacidade e Tratamento de Dados</h2>
                <p className="text-sm leading-relaxed">
                  O tratamento de dados pessoais e dados sensíveis de saúde é regido de forma detalhada por nossa <Link href="/privacidade" className="text-[#0090FF] underline font-bold">Política de Privacidade</Link>, alinhada à Lei Geral de Proteção de Dados (LGPD).
                </p>
              </section>

              <section className="space-y-3 border-t border-white/5 pt-6 text-center">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  Ao utilizar a EA Lumina, você declara ter lido, compreendido e concordado com estes Termos de Uso.
                </p>
              </section>
            </div>
          </div>

        </div>
      </div>
      
      <Footer />
    </div>
  )
}
