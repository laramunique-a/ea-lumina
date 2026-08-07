'use client'

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, Sparkles, Brain, Heart, Zap, Compass, Wind, Moon, Sun, Youtube, Instagram, UserCircle, Calendar, FileText } from 'lucide-react'
import { LANDING_THEME } from '@/constants/theme'
import { Footer } from '@/components/Footer'

// --- DADOS DAS TERAPIAS (Pacientes) ---
const TERAPIAS = [
  {
    nome: "ThetaHealing",
    desc: "Identifique e transforme crenças limitantes no nível subconsciente para criar uma realidade mais leve e abundante.",
    icon: <Sparkles className="text-[#C5A03F]" />
  },
  {
    nome: "TQA — Terapia Quântica",
    desc: "Reequilíbrio vibracional profundo, atuando nos campos sutis para restaurar a harmonia física e emocional.",
    icon: <Zap className="text-[#0090FF]" />
  },
  {
    nome: "Terapia Multidimensional",
    desc: "Cura através do coração, trabalhando com seres de luz para limpar energias estagnadas de vidas passadas e do presente.",
    icon: <Heart className="text-[#C5A03F]" />
  },
  {
    nome: "Mesa Metrônica MAQ",
    desc: "Ferramenta quântica de realinhamento energético que harmoniza todas as áreas da vida com geometrias sagradas.",
    icon: <Compass className="text-[#0090FF]" />
  },
  {
    nome: "Constelação Familiar",
    desc: "Libere emaranhamentos sistêmicos e padrões familiares repetitivos, trazendo paz e fluxo para sua ancestralidade.",
    icon: <Brain className="text-[#C5A03F]" />
  },
  {
    nome: "Meditação",
    desc: "Práticas guiadas para acalmar a mente, reduzir a ansiedade e reconectar-se com a sua essência interior.",
    icon: <Moon className="text-[#0090FF]" />
  },
  {
    nome: "Mesa Arcturiana Multidimensional",
    desc: "Sistema de cura baseado na tecnologia de luz arcturiana, focado na elevação de frequência e limpeza espiritual.",
    icon: <Sun className="text-[#C5A03F]" />
  },
  {
    nome: "EMF Balancing Technique",
    desc: "Harmonização da malha de calibração universal. Fortaleça sua energia e alinhe-se com seu propósito mais elevado.",
    icon: <Wind className="text-[#0090FF]" />
  }
]

export default function LandingPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Logo decorativo visível apenas no desktop
  const HeaderLogo = () => (
    <div className="hidden md:block absolute top-8 right-8 w-[180px] h-[180px] z-30 opacity-80 pointer-events-none">
      <img src="/logo-dark.jpg" alt="EA Lumina" className="w-full h-full object-contain" style={{ WebkitMaskImage: 'radial-gradient(circle at center, black 50%, transparent 75%)', maskImage: 'radial-gradient(circle at center, black 50%, transparent 75%)' }} />
    </div>
  )

  // Scroll suave: sempre horizontal para todas as seções
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    const container = scrollContainerRef.current
    if (element && container) {
      container.scrollTo({
        left: element.offsetLeft,
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  // Wheel → scroll horizontal (desktop apenas)
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      if (window.innerWidth < 768) return // ignora no mobile
      if (e.deltaY !== 0 && e.deltaX === 0) {
        e.preventDefault()
        container.scrollBy({
          left: e.deltaY > 0 ? window.innerWidth : -window.innerWidth,
          behavior: 'smooth'
        })
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [])

  return (
    /*
      MOBILE:  flex-col, scroll vertical normal, sem snap
      DESKTOP: flex-row, snap horizontal, h-screen fixo
    */
    <div
      ref={scrollContainerRef}
      className="flex flex-row h-[100dvh] overflow-x-auto overflow-y-hidden snap-x snap-mandatory w-full bg-[#010409] text-slate-100 font-sans [&::-webkit-scrollbar]:hidden"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >

      {/* ──────────────────────────────────────────────────────────
          TELA 1: HOME (LOGO + BOXES)
      ────────────────────────────────────────────────────────── */}
      <section
        id="home"
        className="w-full min-w-full min-h-[100dvh] md:h-[100dvh] md:max-h-[100dvh] snap-center flex flex-col relative bg-[#010409] overflow-y-auto md:overflow-hidden shrink-0 justify-between pb-6 md:pb-0"
      >
        {/* Fundo de imagem exclusivo da página principal (home) com transição suave */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img
            src="/img/hero-home.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-contain object-center opacity-50 mix-blend-screen"
          />
          {/* Overlays de gradiente para transição 100% suave com o fundo #010409 */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#010409] via-transparent to-[#010409]/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#010409] via-transparent to-[#010409]" />
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 50% 50%, transparent 20%, #010409 85%)',
            }}
          />
        </div>

        {/* ── HEADER MOBILE: em fluxo normal, não sobrepõe nada ── */}
        <div className="flex md:hidden w-full items-center justify-between px-4 pt-3 pb-1 z-30 shrink-0">
          {/* Redes sociais */}
          <div className="flex items-center gap-4">
            <a href="https://www.youtube.com/@ealumina4444" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/70 transition-colors">
              <Youtube className="w-5 h-5" />
            </a>
            <a href="https://www.instagram.com/ealumina4444?utm_source=qr&igsh=MTJncnppN256cmpnaQ%3D%3D" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/70 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
          </div>
          {/* Auth */}
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
              Entrar
            </Link>
            <Link href="/register">
              <button className={LANDING_THEME.button.ghost}>Criar conta</button>
            </Link>
          </div>
        </div>

        {/* ── HEADER DESKTOP: absoluto, apenas visível em telas grandes ── */}
        <div className="hidden md:flex absolute top-6 left-8 items-center gap-4 z-30">
          <a href="https://www.youtube.com/@ealumina4444" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/70 transition-colors group">
            <Youtube className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </a>
          <a href="https://www.instagram.com/ealumina4444?utm_source=qr&igsh=MTJncnppN256cmpnaQ%3D%3D" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/70 transition-colors group">
            <Instagram className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </a>
        </div>
        <div className="hidden md:flex absolute top-6 right-8 items-center gap-4 z-30">
          <Link href="/login" className="text-xs lg:text-sm font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors px-2">
            Entrar
          </Link>
          <Link href="/register">
            <button className={LANDING_THEME.button.ghost}>Criar conta</button>
          </Link>
        </div>

        {/* CONTEÚDO PRINCIPAL */}
        <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col md:flex-row items-center justify-center md:justify-between px-4 sm:px-6 pt-4 md:pt-10 lg:pt-12 pb-4 md:pb-6 md:px-12 lg:px-16 gap-4 md:gap-8 relative z-10 md:overflow-hidden my-auto shrink-0">

          {/* LADO ESQUERDO: LOGO E TEXTO */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center shrink-0">
            <div className="relative w-[100px] h-[100px] sm:w-[140px] sm:h-[140px] md:w-[220px] md:h-[220px] lg:w-[250px] lg:h-[250px] max-w-[28vw] max-h-[28vh]">
              <img
                src="/logo-dark.jpg"
                alt="EA Lumina"
                className="w-full h-full object-contain"
                style={{
                  WebkitMaskImage: 'radial-gradient(circle at center, black 50%, transparent 75%)',
                  maskImage: 'radial-gradient(circle at center, black 50%, transparent 75%)'
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<div class="text-xs text-slate-500 font-light tracking-widest text-center h-full flex flex-col justify-center border border-dashed border-slate-800 rounded-3xl p-6">[ LOGOTIPO ]<br/>Salve a imagem anexa como<br/>"logo-dark.jpg" na pasta "public"</div>';
                }}
              />
            </div>

            <div className="text-center max-w-[480px] px-2 md:px-0 mt-1">
              <h1
                className={LANDING_THEME.typography.titleGradient}
                style={LANDING_THEME.typography.titleGradientStyle}
              >
                Conectar quem busca transformar sua vida com quem já percorreu esse caminho.
              </h1>
              <p className="text-[10px] sm:text-xs md:text-xs lg:text-sm text-slate-300 leading-relaxed font-medium md:max-w-[400px] mx-auto mt-1">
                A EA Lumina é o encontro entre quem precisa e quem já transformou. Um ecossistema de terapias, conhecimento e propósito para uma vida mais equilibrada, consciente e com sentido.
              </p>
            </div>
          </div>

          {/* LADO DIREITO: BOXES */}
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-end md:h-full md:justify-center shrink-0">
            <div className="flex flex-col gap-2.5 md:gap-4 w-full max-w-[380px] animate-in slide-in-from-right-8 duration-1000">
              <h3 className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] sm:text-[11px] md:text-[13px] mb-1 text-center md:text-left pl-2 opacity-80">
                Qual é o seu objetivo hoje?
              </h3>

              {[
                { id: 'pacientes', label: 'Sou Paciente', icon: <Heart className="w-4 h-4 md:w-5 md:h-5 text-[#0066CC]" /> },
                { id: 'terapeutas', label: 'Sou Terapeuta', icon: <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-[#0066CC]" /> },
                { id: 'empresas', label: 'Para Empresas', icon: <Brain className="w-4 h-4 md:w-5 md:h-5 text-[#0066CC]" /> },
                { id: 'cursos', label: 'Ver Cursos', icon: <Compass className="w-4 h-4 md:w-5 md:h-5 text-[#0066CC]" /> }
              ].map((box) => (
                <button
                  key={box.id}
                  onClick={() => scrollToSection(box.id)}
                  className="group flex items-center justify-between px-4 py-3 md:px-5 md:py-4.5 rounded-2xl md:rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all shadow-lg hover:shadow-2xl hover:-translate-y-1 backdrop-blur-md"
                >
                  <div className="flex items-center gap-3 md:gap-5">
                    <div className="group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                      {box.icon}
                    </div>
                    <span className="text-[10px] md:text-xs lg:text-sm font-black uppercase tracking-[0.2em] text-white transition-colors">
                      {box.label}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-slate-500 group-hover:text-[#0066CC] transition-colors group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>


      {/* ──────────────────────────────────────────────────────────
          TELA 2: PACIENTES
      ────────────────────────────────────────────────────────── */}
      <section
        id="pacientes"
        className="w-full min-w-full min-h-[100dvh] md:h-[100dvh] md:max-h-[100dvh] snap-center flex flex-col items-center justify-between relative bg-[radial-gradient(circle_at_center,_#1e293b_0%,_#0f172a_50%,_#020617_100%)] overflow-y-auto md:overflow-hidden shrink-0 pb-6 md:pb-0"
      >
        <HeaderLogo />

        {/* Botão Voltar: estático no mobile (no topo do fluxo), absoluto no desktop */}
        <div className="w-full px-4 md:px-12 pt-4 md:pt-0 md:absolute md:top-8 md:left-8 md:w-auto">
          <button onClick={() => scrollToSection('home')} className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white flex items-center gap-2 z-40">
            <ChevronLeft size={14} /> Voltar
          </button>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 md:px-12 w-full flex-1 flex flex-col justify-center items-center py-4 shrink-0 overflow-y-auto md:overflow-hidden">

          <div className="mb-4 md:mb-6 text-center shrink-0">
            <h5 className={LANDING_THEME.tag.blue}>Para Pacientes</h5>
            <h2 className={LANDING_THEME.typography.titleGradient} style={LANDING_THEME.typography.titleGradientStyle}>
              Sua jornada de<br />Luz e Equilíbrio.
            </h2>
          </div>

          <div className="relative w-full overflow-hidden group">
            {/* CAROUSEL TRACK (MARQUEE) */}
            <div className="flex w-max animate-marquee hover:[animation-play-state:paused] py-2">
              {[...TERAPIAS, ...TERAPIAS].map((terapia, i) => (
                <div key={i} className="w-[75vw] max-w-[300px] md:w-[320px] lg:w-[350px] flex-shrink-0 px-2 md:px-3">
                  <div className="bg-black/40 backdrop-blur-sm border border-slate-800 rounded-3xl p-4 md:p-6 hover:border-slate-600 transition-colors flex flex-col items-center text-center h-full min-h-[180px] md:min-h-[240px] justify-center">
                    <div className="mb-2 md:mb-3 bg-slate-900 w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 [&>svg]:w-5 [&>svg]:h-5 md:[&>svg]:w-7 md:[&>svg]:h-7 shadow-lg">
                      {terapia.icon}
                    </div>
                    <h3 className="text-xs md:text-base lg:text-lg font-black text-white uppercase tracking-widest mb-1.5 line-clamp-2">{terapia.nome}</h3>
                    <p className="text-[10px] md:text-xs text-slate-400 leading-relaxed font-medium line-clamp-3">{terapia.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 md:mt-6 flex flex-col md:flex-row items-center justify-center px-4 gap-4 shrink-0">
            <Link href="/register?role=PACIENTE">
              <button className={LANDING_THEME.button.gold}>
                Começar agora
              </button>
            </Link>
          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          TELA 3: TERAPEUTAS
      ────────────────────────────────────────────────────────── */}
      <section
        id="terapeutas"
        className="w-full min-w-full min-h-[100dvh] md:h-[100dvh] md:max-h-[100dvh] snap-center flex flex-col items-center justify-between relative bg-[radial-gradient(circle_at_center,_#1e293b_0%,_#0f172a_50%,_#020617_100%)] overflow-y-auto md:overflow-hidden shrink-0 pb-6 md:pb-0"
      >
        <HeaderLogo />

        {/* Botão Início: estático no mobile (no topo do fluxo), absoluto no desktop */}
        <div className="w-full px-4 md:px-12 pt-4 md:pt-0 md:absolute md:top-8 md:left-8 md:w-auto">
          <button onClick={() => scrollToSection('home')} className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white flex items-center gap-2 z-40">
            <ChevronLeft size={14} /> Início
          </button>
        </div>

        <div className="max-w-5xl mx-auto px-4 md:px-12 w-full flex-1 flex flex-col items-center justify-center text-center py-4 shrink-0 overflow-y-auto md:overflow-hidden">

          <div className="w-full mb-4 md:mb-6 text-center">
            <h5 className={LANDING_THEME.tag.gold}>Para Terapeutas</h5>
            <h2 className={LANDING_THEME.typography.titleGradient} style={LANDING_THEME.typography.titleGradientStyle}>
              Expanda sua Luz.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6 text-left w-full">
            <div className="bg-black/40 border border-white/5 rounded-2xl p-3.5 md:p-5 hover:bg-white/5 transition-colors group">
              <div className="flex items-center gap-3 mb-1.5">
                <div className="bg-[#C5A03F]/20 p-2 rounded-xl group-hover:scale-110 transition-transform">
                  <UserCircle className="w-4 h-4 md:w-5 md:h-5 text-[#C5A03F]" />
                </div>
                <h3 className="text-white font-bold text-xs md:text-base tracking-wide uppercase">Vitrine Premium</h3>
              </div>
              <p className="text-slate-400 text-[11px] md:text-sm leading-relaxed">Perfil de alto padrão desenhado para destacar suas especialidades e conectar sua energia a pacientes em busca de transformação.</p>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-3.5 md:p-5 hover:bg-white/5 transition-colors group">
              <div className="flex items-center gap-3 mb-1.5">
                <div className="bg-[#0090FF]/20 p-2 rounded-xl group-hover:scale-110 transition-transform">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5 text-[#0090FF]" />
                </div>
                <h3 className="text-white font-bold text-xs md:text-base tracking-wide uppercase">Gestão Inteligente</h3>
              </div>
              <p className="text-slate-400 text-[11px] md:text-sm leading-relaxed">Controle total sobre sua agenda com agendamentos automáticos e gestão de pagamentos integrados em um só lugar.</p>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-3.5 md:p-5 hover:bg-white/5 transition-colors group">
              <div className="flex items-center gap-3 mb-1.5">
                <div className="bg-white/10 p-2 rounded-xl group-hover:scale-110 transition-transform">
                  <FileText className="w-4 h-4 md:w-5 md:h-5 text-slate-300" />
                </div>
                <h3 className="text-white font-bold text-xs md:text-base tracking-wide uppercase">Prontuários e Segurança</h3>
              </div>
              <p className="text-slate-400 text-[11px] md:text-sm leading-relaxed">Ambiente digital criptografado e organizado para você registrar a evolução holística e clínica de cada paciente com total segurança.</p>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-3.5 md:p-5 hover:bg-white/5 transition-colors group">
              <div className="flex items-center gap-3 mb-1.5">
                <div className="bg-[#8A2BE2]/20 p-2 rounded-xl group-hover:scale-110 transition-transform">
                  <Brain className="w-4 h-4 md:w-5 md:h-5 text-[#8A2BE2]" />
                </div>
                <h3 className="text-white font-bold text-xs md:text-base tracking-wide uppercase">Lumina IA</h3>
              </div>
              <p className="text-slate-400 text-[11px] md:text-sm leading-relaxed">Sua assistente de inteligência artificial exclusiva. Receba auxílio para criar conteúdos e direcionamentos clínicos de alta performance.</p>
            </div>
          </div>

          <Link href="/register?role=TERAPEUTA" className="shrink-0">
            <button className={`${LANDING_THEME.button.gold} inline-flex items-center gap-2 whitespace-nowrap justify-center`}>
              Quero Atender <ArrowRight size={14} />
            </button>
          </Link>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          TELA 4: EMPRESAS
      ────────────────────────────────────────────────────────── */}
      <section
        id="empresas"
        className="w-full min-w-full min-h-[100dvh] md:h-[100dvh] md:max-h-[100dvh] snap-center flex flex-col items-center justify-between relative bg-[radial-gradient(circle_at_center,_#1e293b_0%,_#0f172a_50%,_#020617_100%)] overflow-y-auto md:overflow-hidden shrink-0 pb-6 md:pb-0"
      >
        <HeaderLogo />

        {/* Botão Início: estático no mobile (no topo do fluxo), absoluto no desktop */}
        <div className="w-full px-4 md:px-12 pt-4 md:pt-0 md:absolute md:top-8 md:left-8 md:w-auto">
          <button onClick={() => scrollToSection('home')} className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white flex items-center gap-2 z-40">
            <ChevronLeft size={14} /> Início
          </button>
        </div>

        <div className="max-w-6xl mx-auto px-4 md:px-12 w-full flex-1 grid md:grid-cols-2 gap-6 md:gap-12 items-center justify-center py-4 shrink-0 overflow-y-auto md:overflow-hidden">
          <div className="text-center md:text-left">
            <h5 className={LANDING_THEME.tag.blue}>Soluções Corporativas</h5>
            <h2 className={LANDING_THEME.typography.titleGradient} style={LANDING_THEME.typography.titleGradientStyle}>
              Bem-estar elevado.
            </h2>
            <p className={LANDING_THEME.typography.paragraph + " mb-4 md:mb-6 max-w-[500px]"}>
              Proporcione equilíbrio mental e emocional para sua equipe através de pacotes exclusivos de terapias integrativas. Profissionais focados, saudáveis e resilientes transformam completamente o ambiente de trabalho e os resultados da sua empresa.
            </p>
            <button className={LANDING_THEME.button.gold}>
              Falar com Consultor
            </button>
          </div>
          <div className="hidden md:flex h-52 lg:h-72 rounded-3xl border border-slate-800 bg-black/50 items-center justify-center p-6 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-tr from-[#0090FF]/10 to-transparent" />
             <div className="text-center relative z-10">
                <Wind className="w-12 h-12 lg:w-16 lg:h-16 text-[#0090FF] mx-auto mb-3 opacity-80" />
                <h4 className="text-base lg:text-xl font-black text-white uppercase tracking-widest">Corporativo</h4>
             </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          TELA 5: CURSOS
      ────────────────────────────────────────────────────────── */}
      <section
        id="cursos"
        className="w-full min-w-full min-h-[100dvh] md:h-[100dvh] md:max-h-[100dvh] snap-center flex flex-col items-center justify-between relative bg-[radial-gradient(circle_at_center,_#1e293b_0%,_#0f172a_50%,_#020617_100%)] overflow-y-auto md:overflow-hidden shrink-0 pb-6 md:pb-0"
      >
        <HeaderLogo />

        {/* Botão Início: estático no mobile (no topo do fluxo), absoluto no desktop */}
        <div className="w-full px-4 md:px-12 pt-4 md:pt-0 md:absolute md:top-8 md:left-8 md:w-auto">
          <button onClick={() => scrollToSection('home')} className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white flex items-center gap-2 z-40">
            <ChevronLeft size={14} /> Início
          </button>
        </div>

        <div className="max-w-5xl mx-auto px-4 md:px-12 w-full flex-1 flex flex-col items-center justify-center text-center py-4 shrink-0 overflow-y-auto md:overflow-hidden">
          <div className="w-full mb-4 md:mb-6 text-center">
            <h5 className={LANDING_THEME.tag.gold}>Educação e Evolução</h5>
            <h2 className={LANDING_THEME.typography.titleGradient} style={LANDING_THEME.typography.titleGradientStyle}>
              Jornada de <br className="hidden md:block"/>Aprendizado.
            </h2>
          </div>
          <p className={LANDING_THEME.typography.paragraph + " mb-6 md:mb-8 max-w-[800px] px-2 md:px-4"}>
            Aprofunde seus conhecimentos e expanda sua consciência. Cursos ministrados por especialistas renomados em terapias integrativas, pensados para o seu desenvolvimento pessoal e certificação profissional.
          </p>
          <button className={`${LANDING_THEME.button.gold} inline-flex items-center gap-3 justify-center whitespace-nowrap mx-auto`}>
            Explorar Catálogo <ArrowRight size={14} />
          </button>
        </div>
        <Footer />
      </section>

    </div>
  )
}
