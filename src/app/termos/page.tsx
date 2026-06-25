'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Footer } from '@/components/Footer'

export default function TermsPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between bg-[#010409] bg-[radial-gradient(circle_at_center,_#020c16_0%,_#010810_50%,_#010409_100%)] selection:bg-[#C5A03F]/20 overflow-x-hidden w-full">
      
      <div className="flex-1 flex flex-col items-center justify-center w-full px-6 py-12">
        <div className="relative z-10 w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-1000 flex flex-col">
        
        {/* Header com Botão Voltar e Logotipo Centralizado */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <Link href="/register">
            <Button className="h-10 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 self-start">
              <ArrowLeft size={14} className="mr-2" />
              Voltar ao Cadastro
            </Button>
          </Link>
          
          <div className="flex sm:justify-end justify-center">
            <Link href="/" className="transition-transform hover:scale-105 active:scale-95 duration-500 block">
              <div className="relative w-24 h-24 md:w-28 md:h-28">
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
        <div className="bg-black/40 border border-white/5 backdrop-blur-xl shadow-2xl p-8 md:p-12 rounded-[2.5rem] text-slate-300 space-y-8">
          
          <div className="border-b border-white/5 pb-6">
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">Termos de Uso</h1>
            <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold">Última atualização: Junho de 2026</p>
          </div>

          <div className="space-y-6">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white tracking-tight">1. Aceitação dos Termos</h2>
              <p className="text-sm leading-relaxed">
                Ao acessar e utilizar a plataforma <strong>EA Lumina</strong>, você concorda expressamente em cumprir e estar vinculado aos seguintes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá criar uma conta ou utilizar nossos serviços.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white tracking-tight">2. O Ecossistema EA Lumina</h2>
              <p className="text-sm leading-relaxed">
                A <strong>EA Lumina</strong> é uma plataforma de tecnologia que atua como marketplace de terapias integrativas. Nosso papel é conectar profissionais (Terapeutas) e usuários finais (Pacientes). Nós não prestamos diretamente serviços de terapia, psicologia ou medicina, e não nos responsabilizamos pelo conteúdo das sessões ou pela conduta técnica dos terapeutas cadastrados.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white tracking-tight">3. Cadastro e Segurança de Conta</h2>
              <p className="text-sm leading-relaxed">
                Para utilizar as funcionalidades da plataforma, o usuário deve se cadastrar fornecendo informações precisas e atualizadas:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li><strong>Pacientes:</strong> Devem ser maiores de 18 anos ou possuir autorização legal dos responsáveis.</li>
                <li><strong>Terapeutas:</strong> Devem comprovar formação e certificação nas respectivas áreas de atuação. O cadastro de terapeutas passa por uma análise de perfil prévia pela equipe de moderação.</li>
                <li>O usuário é o único responsável pela guarda e confidencialidade de sua senha de acesso.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white tracking-tight">4. Agendamentos e Pagamentos</h2>
              <p className="text-sm leading-relaxed">
                Todos os pagamentos de consultas e pacotes são processados de forma segura através da integração com o <strong>Stripe</strong>. 
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>Os cancelamentos e remarcações devem seguir as regras de antecedência estipuladas no perfil de cada terapeuta.</li>
                <li>Em caso de ausência sem aviso prévio (no-show), o valor da sessão poderá ser retido integralmente para remunerar o tempo reservado do profissional.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white tracking-tight">5. Conduta do Usuário</h2>
              <p className="text-sm leading-relaxed">
                É estritamente proibido utilizar a plataforma para:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>Fins ilícitos, criminosos ou contrários à ética terapêutica.</li>
                <li>Assediar, ameaçar, fraudar ou discriminar qualquer membro do ecossistema.</li>
                <li>Disseminar vírus, malwares ou utilizar robôs que possam sobrecarregar a infraestrutura do site.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white tracking-tight">6. Limitação de Responsabilidade</h2>
              <p className="text-sm leading-relaxed">
                A <strong>EA Lumina</strong> não se responsabiliza por:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>Interrupções técnicas temporárias devido a problemas no servidor ou na internet do usuário.</li>
                <li>Divergências ou insatisfação em relação à metodologia terapêutica aplicada pelo profissional parceiro.</li>
                <li>Danos resultantes do uso não autorizado de sua conta por terceiros.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white tracking-tight">7. Alterações nos Termos</h2>
              <p className="text-sm leading-relaxed">
                Podemos modificar estes Termos de Uso a qualquer momento para refletir melhorias no sistema ou mudanças regulatórias. Notificaremos os usuários sobre alterações significativas através do e-mail cadastrado ou de avisos na plataforma.
              </p>
            </section>

            <section className="space-y-3 border-t border-white/5 pt-6 text-center">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Ao utilizar a EA Lumina, você concorda com estes termos e inicia sua jornada rumo ao equilíbrio.
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
