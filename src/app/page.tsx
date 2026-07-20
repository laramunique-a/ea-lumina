import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  ArrowRight, Sparkles, Brain, Heart, Zap, Compass, Wind, Moon, Sun,
  Youtube, Instagram, Shield, Calendar, FileText, CheckCircle, Users, Building2
} from 'lucide-react'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'EA Lumina — Ecossistema de Saúde Integrativa',
  description: 'Conectamos pacientes a terapeutas holísticos com cuidado, autonomia e responsabilidade. Encontre sua conexão terapêutica, faça parte da Rede Lumina ou leve o bem-estar para sua empresa.',
  openGraph: {
    title: 'EA Lumina — Ecossistema de Saúde Integrativa',
    description: 'Conectamos pacientes, terapeutas e empresas em um ecossistema de cuidado integrativo.',
    type: 'website',
    url: 'https://ealumina.com',
  },
}

const TERAPIAS = [
  { nome: 'ThetaHealing', desc: 'Transforme crenças limitantes no nível subconsciente.', icon: <Sparkles className="w-6 h-6 text-[#C5A03F]" /> },
  { nome: 'TQA — Terapia Quântica', desc: 'Reequilíbrio vibracional profundo nos campos sutis.', icon: <Zap className="w-6 h-6 text-[#0090FF]" /> },
  { nome: 'Terapia Multidimensional', desc: 'Cura através do coração e dos campos energéticos.', icon: <Heart className="w-6 h-6 text-[#C5A03F]" /> },
  { nome: 'Mesa Metrônica MAQ', desc: 'Realinhamento quântico com geometrias sagradas.', icon: <Compass className="w-6 h-6 text-[#0090FF]" /> },
  { nome: 'Constelação Familiar', desc: 'Libere padrões sistêmicos e emaranhamentos ancestrais.', icon: <Brain className="w-6 h-6 text-[#C5A03F]" /> },
  { nome: 'Meditação Guiada', desc: 'Acalme a mente e reconecte-se à sua essência.', icon: <Moon className="w-6 h-6 text-[#0090FF]" /> },
  { nome: 'Mesa Arcturiana', desc: 'Elevação de frequência com tecnologia de luz.', icon: <Sun className="w-6 h-6 text-[#C5A03F]" /> },
  { nome: 'EMF Balancing', desc: 'Harmonização da malha de calibração universal.', icon: <Wind className="w-6 h-6 text-[#0090FF]" /> },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Explore os terapeutas', desc: 'Navegue pelos perfis, especialidades e avaliações sem precisar criar uma conta.' },
  { step: '02', title: 'Escolha sua abordagem', desc: 'Filtre por modalidade, tipo de terapia, disponibilidade e valores.' },
  { step: '03', title: 'Agende com segurança', desc: 'Pagamento protegido pelo Stripe. Sessões online ou presenciais.' },
  { step: '04', title: 'Inicie sua jornada', desc: 'Conecte-se com seu terapeuta e acompanhe sua evolução pelo dashboard.' },
]

const THERAPIST_BENEFITS = [
  { icon: <Calendar className="w-5 h-5 text-[#0090FF]" />, title: 'Agenda inteligente', desc: 'Controle total sobre disponibilidade e agendamentos automáticos.' },
  { icon: <FileText className="w-5 h-5 text-[#C5A03F]" />, title: 'Prontuários digitais', desc: 'Registre a evolução dos seus pacientes com segurança e organização.' },
  { icon: <Sparkles className="w-5 h-5 text-[#8A2BE2]" />, title: 'Lumina IA', desc: 'Assistente de IA exclusiva para criação de conteúdo e suporte clínico.' },
  { icon: <Shield className="w-5 h-5 text-[#C5A03F]" />, title: 'Vitrine premium', desc: 'Perfil profissional de alto padrão visível para milhares de pacientes.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#010409] text-slate-100 font-sans">

      {/* ── NAVBAR ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#010409]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3" aria-label="EA Lumina — página inicial">
            <img
              src="/logo-dark.jpg"
              alt="EA Lumina"
              className="w-8 h-8 object-contain"
              style={{ WebkitMaskImage: 'radial-gradient(circle at center, black 50%, transparent 80%)', maskImage: 'radial-gradient(circle at center, black 50%, transparent 80%)' }}
            />
            <span className="font-black text-sm uppercase tracking-[0.2em] text-white">EA Lumina</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6" aria-label="Navegação principal">
            <Link href="/terapeutas" className="text-xs font-semibold text-slate-400 hover:text-white transition-colors uppercase tracking-wider">
              Terapeutas
            </Link>
            <Link href="#para-terapeutas" className="text-xs font-semibold text-slate-400 hover:text-white transition-colors uppercase tracking-wider">
              Para Terapeutas
            </Link>
            <Link href="#empresas" className="text-xs font-semibold text-slate-400 hover:text-white transition-colors uppercase tracking-wider">
              Empresas
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 mr-2">
              <a href="https://www.youtube.com/@ealumina4444" target="_blank" rel="noopener noreferrer" aria-label="Canal EA Lumina no YouTube" className="text-slate-500 hover:text-white transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="https://www.instagram.com/ealumina4444" target="_blank" rel="noopener noreferrer" aria-label="EA Lumina no Instagram" className="text-slate-500 hover:text-white transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
            <Link href="/login" className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5">
              Entrar
            </Link>
            <Link href="/register" className="text-xs font-black uppercase tracking-wider bg-[#0090FF] hover:bg-[#007adb] text-white px-4 py-2 rounded-xl transition-colors">
              Criar conta
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ══════════════════════════════════════════
            SEÇÃO 1 — HERO
        ══════════════════════════════════════════ */}
        <section
          className="relative min-h-screen flex flex-col items-center justify-center pt-16 px-4 overflow-hidden bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(0,144,255,0.15),transparent)]"
          aria-labelledby="hero-title"
        >
          {/* Glow decorativo */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#0090FF]/5 blur-3xl pointer-events-none" aria-hidden="true" />

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <img
                src="/logo-dark.jpg"
                alt="EA Lumina"
                className="w-28 h-28 sm:w-36 sm:h-36 object-contain"
                style={{ WebkitMaskImage: 'radial-gradient(circle at center, black 50%, transparent 80%)', maskImage: 'radial-gradient(circle at center, black 50%, transparent 80%)' }}
              />
            </div>

            <div className="inline-flex items-center gap-2 bg-[#0090FF]/10 border border-[#0090FF]/20 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#0090FF]" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#0090FF]">Ecossistema de Cuidado Integrativo</span>
            </div>

            <h1 id="hero-title" className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-none tracking-tight mb-6"
              style={{ background: 'linear-gradient(135deg, #ffffff 0%, #C5A03F 50%, #0090FF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Conexão, Cuidado<br />e Desenvolvimento<br />Humano.
            </h1>

            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10 font-medium">
              A EA Lumina conecta pacientes a terapeutas holísticos de alto padrão, com autonomia, responsabilidade e respeito à sua jornada individual.
            </p>

            {/* Três portas de entrada */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <Link href="/terapeutas" className="group flex flex-col items-center gap-3 bg-white/5 border border-white/10 hover:bg-[#0090FF]/10 hover:border-[#0090FF]/30 rounded-2xl p-5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#0090FF] focus:ring-offset-2 focus:ring-offset-[#010409]">
                <Heart className="w-7 h-7 text-[#0090FF] group-hover:scale-110 transition-transform" />
                <span className="text-sm font-black uppercase tracking-wider text-white">Sou Paciente</span>
                <span className="text-[11px] text-slate-500 text-center">Encontre seu terapeuta ideal</span>
              </Link>

              <a href="#para-terapeutas" className="group flex flex-col items-center gap-3 bg-white/5 border border-white/10 hover:bg-[#C5A03F]/10 hover:border-[#C5A03F]/30 rounded-2xl p-5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C5A03F] focus:ring-offset-2 focus:ring-offset-[#010409]">
                <Sparkles className="w-7 h-7 text-[#C5A03F] group-hover:scale-110 transition-transform" />
                <span className="text-sm font-black uppercase tracking-wider text-white">Sou Terapeuta</span>
                <span className="text-[11px] text-slate-500 text-center">Faça parte da Rede Lumina</span>
              </a>

              <a href="#empresas" className="group flex flex-col items-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-2xl p-5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#010409]">
                <Building2 className="w-7 h-7 text-slate-300 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-black uppercase tracking-wider text-white">Empresas</span>
                <span className="text-[11px] text-slate-500 text-center">Bem-estar organizacional</span>
              </a>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40" aria-hidden="true">
            <span className="text-[10px] uppercase tracking-widest text-slate-500">Explorar</span>
            <div className="w-px h-10 bg-gradient-to-b from-slate-500 to-transparent" />
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SEÇÃO 2 — COMO FUNCIONA PARA PACIENTES
        ══════════════════════════════════════════ */}
        <section className="py-24 px-4 bg-[#020810]" aria-labelledby="como-funciona-titulo">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#0090FF] bg-[#0090FF]/10 border border-[#0090FF]/20 rounded-full px-4 py-1.5 mb-4">Para Pacientes</span>
              <h2 id="como-funciona-titulo" className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
                Como funciona
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto text-base leading-relaxed">
                Sua jornada de bem-estar começa com um simples passo. Nós cuidamos do resto.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
              {HOW_IT_WORKS.map((item) => (
                <div key={item.step} className="relative bg-white/3 border border-white/8 rounded-3xl p-6 hover:bg-white/5 hover:border-white/15 transition-all duration-300">
                  <span className="text-5xl font-black text-white/5 absolute top-4 right-5 leading-none select-none" aria-hidden="true">{item.step}</span>
                  <p className="text-xs font-black uppercase tracking-widest text-[#0090FF] mb-3">{item.step}</p>
                  <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <Link
                href="/terapeutas"
                className="inline-flex items-center gap-2 bg-[#0090FF] hover:bg-[#007adb] text-white font-black text-sm uppercase tracking-wider px-8 py-4 rounded-2xl transition-all duration-200 hover:shadow-[0_0_30px_rgba(0,144,255,0.3)] focus:outline-none focus:ring-2 focus:ring-[#0090FF] focus:ring-offset-2 focus:ring-offset-[#020810]"
              >
                Explorar Terapeutas <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SEÇÃO 3 — ABORDAGENS E PRÁTICAS
        ══════════════════════════════════════════ */}
        <section className="py-24 px-4" aria-labelledby="abordagens-titulo">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#C5A03F] bg-[#C5A03F]/10 border border-[#C5A03F]/20 rounded-full px-4 py-1.5 mb-4">Abordagens e Práticas</span>
              <h2 id="abordagens-titulo" className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
                Terapias disponíveis
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto text-base leading-relaxed">
                Diversidade de modalidades para que você encontre a abordagem que ressoa com a sua jornada.
              </p>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" role="list">
              {TERAPIAS.map((terapia) => (
                <li
                  key={terapia.nome}
                  className="bg-black/40 border border-slate-800 rounded-3xl p-6 hover:border-slate-600 hover:bg-black/60 transition-all duration-300 flex flex-col items-center text-center"
                >
                  <div className="mb-4 bg-slate-900 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg">
                    {terapia.icon}
                  </div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider mb-2">{terapia.nome}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{terapia.desc}</p>
                </li>
              ))}
            </ul>

            <p className="text-center text-xs text-slate-600 mt-8">
              As práticas oferecidas são complementares e não substituem acompanhamento médico, psicológico ou psiquiátrico. Em situações de urgência, procure um serviço de saúde.
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SEÇÃO 4 — REDE LUMINA (TERAPEUTAS)
        ══════════════════════════════════════════ */}
        <section id="para-terapeutas" className="py-24 px-4 bg-[#020810]" aria-labelledby="terapeutas-titulo">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#C5A03F] bg-[#C5A03F]/10 border border-[#C5A03F]/20 rounded-full px-4 py-1.5 mb-6">Rede Lumina</span>
                <h2 id="terapeutas-titulo" className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                  Expanda sua luz.<br />Fortaleça sua prática.
                </h2>
                <p className="text-slate-400 text-base leading-relaxed mb-8">
                  A EA Lumina oferece a terapeutas um ecossistema completo: vitrine premium, gestão de agenda, prontuários digitais, pagamentos integrados e inteligência artificial. Pertencer à Rede Lumina é comprometer-se com excelência, ética e cuidado genuíno.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/register?role=TERAPEUTA"
                    className="inline-flex items-center justify-center gap-2 bg-[#C5A03F] hover:bg-[#ab8a36] text-[#010409] font-black text-sm uppercase tracking-wider px-6 py-3.5 rounded-2xl transition-all duration-200 hover:shadow-[0_0_30px_rgba(197,160,63,0.3)] focus:outline-none focus:ring-2 focus:ring-[#C5A03F] focus:ring-offset-2 focus:ring-offset-[#020810]"
                  >
                    Quero fazer parte <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {THERAPIST_BENEFITS.map((benefit) => (
                  <div key={benefit.title} className="bg-black/40 border border-white/5 rounded-2xl p-5 hover:bg-white/5 hover:border-white/10 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-slate-900 w-9 h-9 rounded-xl flex items-center justify-center shrink-0">
                        {benefit.icon}
                      </div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wide">{benefit.title}</h3>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{benefit.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SEÇÃO 5 — MANIFESTO DA REDE LUMINA
        ══════════════════════════════════════════ */}
        <section className="py-24 px-4" aria-labelledby="manifesto-titulo">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#C5A03F] to-transparent mx-auto mb-10" aria-hidden="true" />
            <h2 id="manifesto-titulo" className="text-2xl sm:text-3xl font-black text-white mb-8 leading-relaxed">
              "Acreditamos que o cuidado genuíno transforma vidas. Que cada pessoa merece acesso a práticas que respeitem sua integralidade — corpo, mente, emoção e energia."
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              A EA Lumina existe para ser a ponte entre quem busca e quem oferece cuidado. Não prometemos curas. Oferecemos conexão, autonomia e um ambiente seguro para a sua jornada.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              {['Ética', 'Autonomia', 'Responsabilidade', 'Diversidade', 'Transparência'].map((valor) => (
                <span key={valor} className="flex items-center gap-1.5 text-xs font-bold text-slate-300 bg-white/5 border border-white/10 rounded-full px-4 py-1.5">
                  <CheckCircle className="w-3 h-3 text-[#0090FF]" />
                  {valor}
                </span>
              ))}
            </div>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#C5A03F] to-transparent mx-auto mt-10" aria-hidden="true" />
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SEÇÃO 6 — EMPRESAS
        ══════════════════════════════════════════ */}
        <section id="empresas" className="py-24 px-4 bg-[#020810]" aria-labelledby="empresas-titulo">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="hidden md:flex h-64 rounded-3xl border border-slate-800 bg-black/50 items-center justify-center relative overflow-hidden" aria-hidden="true">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0090FF]/10 to-transparent" />
                <div className="relative z-10 text-center">
                  <Users className="w-16 h-16 text-[#0090FF] mx-auto mb-4 opacity-70" />
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">Bem-estar Organizacional</span>
                </div>
              </div>

              <div>
                <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#0090FF] bg-[#0090FF]/10 border border-[#0090FF]/20 rounded-full px-4 py-1.5 mb-6">Soluções Corporativas</span>
                <h2 id="empresas-titulo" className="text-3xl sm:text-4xl font-black text-white mb-6 leading-tight">
                  Bem-estar que transforma equipes.
                </h2>
                <p className="text-slate-400 text-base leading-relaxed mb-8">
                  Leve a EA Lumina para a sua empresa. Pacotes exclusivos de terapias integrativas para colaboradores mais focados, saudáveis e resilientes. Ambientes saudáveis geram resultados extraordinários.
                </p>
                <a
                  href="https://www.instagram.com/ealumina4444"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 text-white font-black text-sm uppercase tracking-wider px-6 py-3.5 rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#020810]"
                >
                  Falar com consultor <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
