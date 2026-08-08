'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, Sparkles, Brain, Heart, Zap, Compass, Wind, Moon, Sun, Youtube, Instagram, UserCircle, Calendar, FileText, X } from 'lucide-react'
import { LANDING_THEME } from '@/constants/theme'
import { Footer } from '@/components/Footer'

// --- DADOS DAS TERAPIAS (Pacientes) ---
const TERAPIAS = [
  {
    nome: "ThetaHealing",
    desc: "Técnica quântica que atua na raiz das crenças limitantes e promove cura profunda no nível da alma.",
    icon: "/icon-thetahealing.png"
  },
  {
    nome: "TQA - Terapia Quântica Atlante",
    desc: "Terapia ancestral que acessa memórias profundas e harmoniza o campo energético.",
    icon: "/icon-tqa.png"
  },
  {
    nome: "EFT",
    desc: "Técnica de liberação emocional que remove bloqueios e reduz ansiedade e estresse.",
    icon: "/icon-eft.png"
  },
  {
    nome: "Mesa Arcturiana",
    desc: "Ferramenta de alta frequência que conecta com energias dos Arcturianos para alinhamento e expansão da consciência.",
    icon: "/icon-mesa-arcturiana.png"
  },
  {
    nome: "Terapia Multidimensional",
    desc: "Atua em múltiplos níveis do ser para promover equilíbrio físico, emocional, mental e espiritual.",
    icon: "/icon-terapia-multidimensional.png"
  },
  {
    nome: "Mesa Metatrônica",
    desc: "Tecnologia energética que restaura o equilíbrio dos corpos sutis e identifica padrões energéticos.",
    icon: "/icon-mesa-metatronica.png"
  },
  {
    nome: "Meditação",
    desc: "Práticas que acalmam a mente, equilibram as emoções e fortalecem o autoconhecimento.",
    icon: "/icon-meditacao.png"
  },
  {
    nome: "Constelação Familiar",
    desc: "Técnica que revela dinâmicas familiares inconscientes e promove cura nas relações e padrões do sistema.",
    icon: "/icon-constelacao-familiar.png"
  }
]

export default function LandingPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showSaibaMaisModal, setShowSaibaMaisModal] = useState(false)

  // Logo decorativo visível apenas no desktop
  const HeaderLogo = () => (
    <div className="hidden md:block absolute top-20 right-8 w-[140px] h-[140px] z-20 opacity-30 pointer-events-none">
      <img src="/logo-dark.png" alt="EA Lumina" className="w-full h-full object-contain" />
    </div>
  )

  // Scroll suave: sempre horizontal para todas as seções
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    const container = scrollContainerRef.current
    if (element && container) {
      element.scrollTop = 0
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
      if (showSaibaMaisModal) return // ignora quando o modal estiver aberto, permitindo scroll vertical do mouse no texto

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
  }, [showSaibaMaisModal])

  return (
    /*
      MOBILE:  flex-col, scroll vertical normal, sem snap
      DESKTOP: flex-row, snap horizontal, h-screen fixo
    */
    <div
      ref={scrollContainerRef}
      className="flex flex-row h-[100dvh] overflow-x-auto overflow-y-hidden snap-x snap-mandatory w-full bg-[#010409] text-slate-100 font-outfit [&::-webkit-scrollbar]:hidden"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >

      {/* ──────────────────────────────────────────────────────────
          TELA 1: HOME (LOGO + BOXES)
      ────────────────────────────────────────────────────────── */}
      <section
        id="home"
        className="w-full min-w-full min-h-[100dvh] md:h-[100dvh] md:max-h-[100dvh] snap-center flex flex-col relative bg-[#010409] overflow-y-auto md:overflow-hidden shrink-0 justify-between pb-6 md:pb-0"
      >
        {/* Fundo de imagem exclusivo da página principal (home) — centralizado entre os elementos com transição 100% suave */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
          <div className="relative w-full max-w-[850px] lg:max-w-[1020px] xl:max-w-[1150px] h-[88vh] max-h-[800px]">
            <img
              src="/img/hero-home.jpg"
              alt=""
              aria-hidden="true"
              className="w-full h-full object-contain object-center opacity-90 brightness-105 contrast-105"
            />
            {/* Overlays de gradiente para transição imperceptível com a cor de fundo #010409 */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#010409] via-transparent to-[#010409] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#010409] via-transparent to-[#010409] pointer-events-none" />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 50% 50%, transparent 25%, #010409 82%)',
              }}
            />
          </div>
        </div>

        {/* ── HEADER MOBILE: em fluxo normal, não sobrepõe nada ── */}
        <div className="flex md:hidden w-full items-center justify-between px-4 pt-3 pb-1 z-30 shrink-0">
          {/* Redes sociais */}
          <div className="flex items-center gap-4">
            <a href="https://www.youtube.com/@ealumina4444" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" style={{ color: '#e19b28' }}>
              <Youtube className="w-5 h-5" />
            </a>
            <a href="https://www.instagram.com/ealumina4444?utm_source=qr&igsh=MTJncnppN256cmpnaQ%3D%3D" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" style={{ color: '#e19b28' }}>
              <Instagram className="w-5 h-5" />
            </a>
          </div>
          {/* Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login">
              <button
                className="bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all shadow-md backdrop-blur-md"
                style={{ color: '#0063c6' }}
              >
                Entrar
              </button>
            </Link>
            <Link href="/register">
              <button
                className="bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all shadow-md backdrop-blur-md"
                style={{ color: '#0063c6' }}
              >
                Criar conta
              </button>
            </Link>
          </div>
        </div>

        {/* ── HEADER DESKTOP: absoluto, apenas visível em telas grandes ── */}
        <div className="hidden md:flex absolute top-6 left-8 items-center gap-4 z-30">
          <a href="https://www.youtube.com/@ealumina4444" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity group" style={{ color: '#e19b28' }}>
            <Youtube className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </a>
          <a href="https://www.instagram.com/ealumina4444?utm_source=qr&igsh=MTJncnppN256cmpnaQ%3D%3D" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity group" style={{ color: '#e19b28' }}>
            <Instagram className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </a>
        </div>
        <div className="hidden md:flex absolute top-6 right-8 items-center gap-3 z-30">
          <Link href="/login">
            <button
              className="bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 rounded-full px-5 py-2.5 text-xs lg:text-sm font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 backdrop-blur-md"
              style={{ color: '#0063c6' }}
            >
              Entrar
            </button>
          </Link>
          <Link href="/register">
            <button
              className="bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 rounded-full px-5 py-2.5 text-xs lg:text-sm font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 backdrop-blur-md"
              style={{ color: '#0063c6' }}
            >
              Criar conta
            </button>
          </Link>
        </div>

        {/* CONTEÚDO PRINCIPAL */}
        <div className="w-full max-w-[1850px] mx-auto flex-1 flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 pt-4 md:pt-10 lg:pt-12 pb-4 md:pb-6 md:px-8 lg:px-12 xl:px-16 gap-6 md:gap-12 relative z-10 md:overflow-hidden my-auto shrink-0">

          {/* LADO ESQUERDO: LOGO E TEXTO */}
          <div className="w-full md:w-5/12 flex flex-col items-center justify-center shrink-0">
            <div className="relative w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] md:w-[300px] md:h-[300px] lg:w-[360px] lg:h-[360px] max-w-[45vw] max-h-[42vh] -mt-2 md:-mt-6 mb-0.5 md:mb-1 transition-all duration-300">
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

            <div className="text-center flex flex-col items-center max-w-[520px] px-2 md:px-0 mt-0">
              <h1
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight mb-2 md:mb-4 leading-snug md:leading-tight bg-clip-text text-transparent text-center"
                style={{
                  background: '#E19B28',
                  backgroundImage: 'linear-gradient(to right, #E19B28 29%, #1063C2 50%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(3px 5px 8px #010409) drop-shadow(0px 2px 4px rgba(1, 4, 9, 0.95))'
                }}
              >
                Conectar quem busca transformar sua vida com quem já percorreu esse caminho.
              </h1>
              <p
                className="text-xs sm:text-sm md:text-base leading-relaxed font-normal md:max-w-[480px] text-center mx-auto mt-1"
                style={{
                  color: '#768294',
                  filter: 'drop-shadow(1px 2px 4px #010409) drop-shadow(0px 1px 2px rgba(0,0,0,0.9))'
                }}
              >
                A EA Lumina é o encontro entre quem precisa e quem já transformou. Um ecossistema de terapias, conhecimento e propósito para uma vida mais equilibrada, consciente e com sentido.
              </p>
            </div>
          </div>

          {/* LADO DIREITO: BOXES */}
          <div className="w-full md:w-5/12 flex flex-col items-center md:items-end md:h-full md:justify-center shrink-0">
            <div className="flex flex-col gap-2.5 md:gap-4 w-full max-w-[380px] animate-in slide-in-from-right-8 duration-1000">
              <h3
                className="text-slate-400 font-normal normal-case tracking-tight text-lg sm:text-xl md:text-2xl lg:text-3xl -mt-1 md:-mt-3 mb-2 md:mb-3 text-center md:text-left pl-2 opacity-90 leading-snug md:leading-tight"
                style={{ textTransform: 'none', fontVariant: 'normal' }}
              >
                Qual o seu objetivo hoje?
              </h3>

              {[
                { id: 'pacientes', label: 'Sou Paciente', icon: <Heart className="w-4 h-4 md:w-5 md:h-5 text-[#0066CC]" /> },
                { id: 'terapeutas', label: 'Sou Terapeuta', icon: <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-[#0066CC]" /> },
                { id: 'empresas', label: 'Para Empresas', icon: <Brain className="w-4 h-4 md:w-5 md:h-5 text-[#0066CC]" /> },
                { id: 'cursos', label: 'Academia', icon: <Compass className="w-4 h-4 md:w-5 md:h-5 text-[#0066CC]" /> }
              ].map((box) => (
                <button
                  key={box.id}
                  onClick={() => scrollToSection(box.id)}
                  className="group flex items-center justify-between px-5 py-4 md:px-6 md:py-5 rounded-3xl md:rounded-[2rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all shadow-lg hover:shadow-2xl hover:-translate-y-1 backdrop-blur-md"
                >
                  <div className="flex items-center gap-3 md:gap-5">
                    <div className="group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                      {box.icon}
                    </div>
                    <span
                      className="text-[10px] md:text-xs lg:text-sm font-black uppercase tracking-[0.2em] transition-colors"
                      style={{ color: '#626d7d' }}
                    >
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
        className="w-full min-w-full min-h-[100dvh] md:h-[100dvh] md:max-h-[100dvh] snap-center flex flex-col items-center justify-start md:justify-between relative bg-[#010409] overflow-y-auto md:overflow-hidden shrink-0 py-2 md:py-3 lg:py-4"
      >
        <HeaderLogo />

        {/* ── HEADER MOBILE DA PÁGINA 2 ── */}
        <div className="flex md:hidden w-full items-center justify-between px-4 pt-3 pb-1 z-30 shrink-0">
          <button onClick={() => scrollToSection('home')} className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white flex items-center gap-1 z-40">
            <ChevronLeft size={14} /> Voltar
          </button>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <button
                className="bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 rounded-full px-3 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all shadow-md backdrop-blur-md"
                style={{ color: '#0063c6' }}
              >
                Entrar
              </button>
            </Link>
            <Link href="/register">
              <button
                className="bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 rounded-full px-3 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all shadow-md backdrop-blur-md"
                style={{ color: '#0063c6' }}
              >
                Criar conta
              </button>
            </Link>
          </div>
        </div>

        {/* ── HEADER DESKTOP DA PÁGINA 2 ── */}
        <div className="hidden md:flex absolute top-6 left-8 items-center gap-4 z-40">
          <button onClick={() => scrollToSection('home')} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white flex items-center gap-2">
            <ChevronLeft size={14} /> Voltar
          </button>
        </div>
        <div className="hidden md:flex absolute top-6 right-8 items-center gap-3 z-40">
          <Link href="/login">
            <button
              className="bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 rounded-full px-5 py-2.5 text-xs lg:text-sm font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 backdrop-blur-md"
              style={{ color: '#0063c6' }}
            >
              Entrar
            </button>
          </Link>
          <Link href="/register">
            <button
              className="bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 rounded-full px-5 py-2.5 text-xs lg:text-sm font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 backdrop-blur-md"
              style={{ color: '#0063c6' }}
            >
              Criar conta
            </button>
          </Link>
        </div>

        <div className="max-w-[1380px] mx-auto px-4 md:px-8 lg:px-10 w-full flex-1 flex flex-col justify-start md:justify-center items-center gap-1.5 md:gap-2.5 lg:gap-4 pt-2 pb-4 md:py-2 shrink-0 overflow-y-auto md:overflow-hidden">

          <div className="mb-1 md:mb-2 text-center flex flex-col items-center max-w-[760px] px-2 shrink-0">
            <h5 className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-0.5 md:mb-1" style={{ color: '#768294' }}>
              Para Pacientes
            </h5>
            <h2
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-extrabold tracking-tight mb-0.5 md:mb-1.5 leading-snug md:leading-tight bg-clip-text text-transparent text-center"
              style={{
                background: '#E19B28',
                backgroundImage: 'linear-gradient(to right, #E19B28 29%, #1063C2 50%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(3px 5px 8px #010409) drop-shadow(0px 2px 4px rgba(1, 4, 9, 0.95))'
              }}
            >
              Toda transformação começa dentro.
            </h2>
            <p
              className="text-[11px] sm:text-xs md:text-sm lg:text-base leading-relaxed font-normal max-w-[680px] text-center mx-auto"
              style={{
                color: '#768294',
                filter: 'drop-shadow(1px 2px 4px #010409) drop-shadow(0px 1px 2px rgba(0,0,0,0.9))'
              }}
            >
              Encontre terapeutas preparados para ajudar você a compreender e transformar a origem emocional do seu sofrimento. Conectamos pessoas que buscam compreender sua dor com terapeutas preparados para caminhar ao seu lado.
            </p>
          </div>

          {/* GRID ESTÁTICO DE 8 CARDS (4 EM CIMA, 4 EM BAIXO NO DESKTOP) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 md:gap-2.5 lg:gap-3.5 w-full max-w-[1320px] px-2 md:px-4 my-1 md:my-1.5">
            {TERAPIAS.map((terapia, i) => (
              <div
                key={i}
                className="bg-white/[0.03] border border-white/5 backdrop-blur-md rounded-2xl md:rounded-3xl p-2.5 md:p-3 lg:p-4 hover:bg-white/[0.08] hover:border-white/10 transition-all hover:-translate-y-0.5 shadow-lg flex flex-col items-center text-center justify-center min-h-[110px] sm:min-h-[125px] md:min-h-[130px] lg:min-h-[150px]"
              >
                <div className="mb-1 w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 flex items-center justify-center shrink-0">
                  <img
                    src={terapia.icon}
                    alt={terapia.nome}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-[10px] sm:text-[11px] md:text-xs lg:text-sm font-black text-white uppercase tracking-widest mb-0.5 line-clamp-2 min-h-[1.75rem] md:min-h-[2rem] flex items-center justify-center">
                  {terapia.nome}
                </h3>
                <p className="text-[9px] sm:text-[10px] md:text-xs text-[#768294] leading-relaxed font-normal line-clamp-3">
                  {terapia.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-1 md:mt-2 flex flex-col md:flex-row items-center justify-center px-4 gap-4 shrink-0 z-20">
            <button
              onClick={() => setShowSaibaMaisModal(true)}
              className="bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 rounded-full px-6 py-2.5 md:px-8 md:py-3 text-xs lg:text-sm font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 backdrop-blur-md cursor-pointer"
              style={{ color: '#0063c6' }}
            >
              Saiba Mais
            </button>
          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          TELA 3: TERAPEUTAS
      ────────────────────────────────────────────────────────── */}
      <section
        id="terapeutas"
        className="w-full min-w-full min-h-[100dvh] md:h-[100dvh] md:max-h-[100dvh] snap-center flex flex-col items-center justify-start md:justify-between relative bg-[#010409] overflow-y-auto md:overflow-hidden shrink-0 py-2 md:py-3 lg:py-4"
      >
        {/* ── HEADER MOBILE DA PÁGINA 3 ── */}
        <div className="flex md:hidden w-full items-center justify-between px-4 pt-3 pb-1 z-30 shrink-0">
          <button onClick={() => scrollToSection('home')} className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white flex items-center gap-1 z-40">
            <ChevronLeft size={14} /> Voltar
          </button>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <button
                className="bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 rounded-full px-3 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all shadow-md backdrop-blur-md"
                style={{ color: '#0063c6' }}
              >
                Entrar
              </button>
            </Link>
            <Link href="/register">
              <button
                className="bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 rounded-full px-3 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all shadow-md backdrop-blur-md"
                style={{ color: '#0063c6' }}
              >
                Criar conta
              </button>
            </Link>
          </div>
        </div>

        {/* ── HEADER DESKTOP DA PÁGINA 3 ── */}
        <div className="hidden md:flex absolute top-6 left-8 items-center gap-4 z-40">
          <button onClick={() => scrollToSection('home')} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white flex items-center gap-2">
            <ChevronLeft size={14} /> Voltar
          </button>
        </div>
        <div className="hidden md:flex absolute top-6 right-8 items-center gap-3 z-40">
          <Link href="/login">
            <button
              className="bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 rounded-full px-5 py-2.5 text-xs lg:text-sm font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 backdrop-blur-md"
              style={{ color: '#0063c6' }}
            >
              Entrar
            </button>
          </Link>
          <Link href="/register">
            <button
              className="bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 rounded-full px-5 py-2.5 text-xs lg:text-sm font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 backdrop-blur-md"
              style={{ color: '#0063c6' }}
            >
              Criar conta
            </button>
          </Link>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 md:px-12 lg:px-16 w-full flex-1 flex flex-col justify-start md:justify-center items-start gap-1.5 md:gap-2.5 lg:gap-3.5 pt-2 pb-4 md:py-2 shrink-0 overflow-y-auto md:overflow-hidden">

          {/* ÁREA SUPERIOR: DIVISÃO 2 COLUNAS (TEXTOS CENTRALIZADOS, IMAGEM HERO À DIREITA) */}
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-1 items-center shrink-0">
            {/* LADO ESQUERDO: TÍTULO E SUBTÍTULOS (CENTRALIZADOS) */}
            <div className="md:col-span-6 text-center flex flex-col items-center justify-center w-full shrink-0 z-10 px-2">
              <h5 className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-1 md:mb-1.5 lg:mb-2 text-center" style={{ color: '#768294' }}>
                Para Terapeutas
              </h5>
              <h2
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight mb-1 md:mb-1.5 leading-snug md:leading-tight bg-clip-text text-transparent text-center"
                style={{
                  background: '#E19B28',
                  backgroundImage: 'linear-gradient(to right, #E19B28 29%, #1063C2 50%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(3px 5px 8px #010409) drop-shadow(0px 2px 4px rgba(1, 4, 9, 0.95))'
                }}
              >
                Você nasceu para cuidar de pessoas.
              </h2>
              <p
                className="text-xs sm:text-sm md:text-base leading-relaxed font-semibold mb-1 text-center"
                style={{
                  color: '#fbfbfb',
                  filter: 'drop-shadow(1px 2px 4px #010409) drop-shadow(0px 1px 2px rgba(0,0,0,0.9))'
                }}
              >
                Nós ajudamos o mundo a encontrar você!
              </p>
              <p
                className="text-xs sm:text-sm md:text-base leading-relaxed font-normal text-center max-w-[650px] mx-auto"
                style={{
                  color: '#768294',
                  filter: 'drop-shadow(1px 2px 4px #010409) drop-shadow(0px 1px 2px rgba(0,0,0,0.9))'
                }}
              >
                Muitos terapeutas possuem conhecimento extraordinário, mas permanecem invisíveis. Na EA Lumina você faz parte de uma comunidade que cresce unida, compartilha propósito e utiliza tecnologia para ampliar seu alcance sem perder sua essência.
              </p>
            </div>

            {/* LADO DIREITO: IMAGEM HERO DA PÁGINA TERAPEUTAS (COL 6) */}
            <div className="md:col-span-6 relative w-full h-[200px] sm:h-[240px] md:h-[290px] lg:h-[330px] mt-2 md:mt-4 -ml-0 md:-ml-4 lg:-ml-8 flex items-center justify-center overflow-hidden shrink-0 z-0 pointer-events-none">
              <img
                src="/hero-terapeutas.jpg"
                alt="Comunidade de Terapeutas EA Lumina"
                className="w-full h-full object-contain object-center scale-105 md:scale-110 opacity-95 brightness-110 contrast-105 filter drop-shadow-2xl"
              />
              {/* Overlays de gradiente para transição imperceptível com a cor de fundo #010409 */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#010409] via-transparent to-[#010409] pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#010409] via-transparent to-[#010409] pointer-events-none" />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, transparent 40%, #010409 90%)',
                }}
              />
            </div>
          </div>

          {/* BOX ÚNICO CENTRALIZADO NA TELA COM CONTEÚDO E DIVISÓRIA | */}
          <div className="w-full max-w-4xl bg-white/[0.03] border border-white/5 backdrop-blur-md rounded-2xl md:rounded-3xl p-4 sm:p-5 md:p-6 min-h-[140px] md:min-h-[160px] flex flex-col md:flex-row items-center justify-between shadow-lg my-1 md:my-1.5 self-center mx-auto z-10 gap-3 md:gap-0">
            {/* LADO ESQUERDO DO BOX: TÍTULO E SUBTÍTULO (CENTRALIZADOS) */}
            <div className="flex-1 text-center flex flex-col items-center justify-center px-2 md:px-4">
              <h3
                className="text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold tracking-tight mb-1 leading-snug bg-clip-text text-transparent text-center"
                style={{
                  background: '#E19B28',
                  backgroundImage: 'linear-gradient(to right, #E19B28 29%, #1063C2 50%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(2px 3px 6px #010409)'
                }}
              >
                Você não está sozinho(a)!
              </h3>
              <p
                className="text-[11px] sm:text-xs md:text-sm leading-relaxed font-normal text-center max-w-[540px] mx-auto"
                style={{
                  color: '#768294',
                  filter: 'drop-shadow(1px 1px 3px #010409)'
                }}
              >
                Na EA Lumina acreditamos que terapeutas unidos criam uma força maior do que qualquer competição. Quando uma comunidade cresce em propósito, todos crescem juntos.
              </p>
            </div>

            {/* DIVISÓRIA VERTICAL | (Sem encostar no topo nem na base do box) */}
            <div className="hidden md:block w-[1px] h-[70px] lg:h-[85px] bg-white/10 mx-4 lg:mx-6 shrink-0" />

            {/* LADO DIREITO DO BOX: TEXTO CURSIVO RISCADO E INCLINADO COM SUBTRACE */}
            <div className="shrink-0 flex flex-col items-center justify-center pt-1 md:pt-0 transform -rotate-3 hover:-rotate-1 transition-transform">
              <span
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#E19B28] leading-tight text-center font-normal tracking-wide"
                style={{
                  fontFamily: "'Caveat', 'Dancing Script', cursive",
                  textShadow: '0px 2px 4px rgba(1, 4, 9, 0.9)'
                }}
              >
                Juntos somos<br />mais fortes!
              </span>
              {/* Linha riscada de sublinhado inclinado */}
              <div className="w-[110px] md:w-[130px] h-[2px] bg-[#E19B28] rounded-full mt-1 opacity-90 shadow-sm" />
            </div>
          </div>

          {/* BOTÃO SAIBA MAIS */}
          <div className="mt-1 md:mt-2 flex flex-col md:flex-row items-center justify-center px-4 gap-4 shrink-0 z-20 self-center mx-auto">
            <Link href="/register?role=TERAPEUTA" className="shrink-0">
              <button
                className="bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 rounded-full px-6 py-2.5 md:px-8 md:py-3 text-xs lg:text-sm font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 backdrop-blur-md inline-flex items-center gap-2 justify-center cursor-pointer"
                style={{ color: '#0063c6' }}
              >
                Saiba Mais <ArrowRight size={14} />
              </button>
            </Link>
          </div>

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
              Jornada de <br className="hidden md:block" />Aprendizado.
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

      {/* ── MODAL FLUTUANTE: SAIBA MAIS (PACIENTES) ── */}
      {showSaibaMaisModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
          onWheel={(e) => e.stopPropagation()}
        >
          <div className="relative w-full max-w-3xl max-h-[85vh] bg-[#010409]/95 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden">
            {/* Header do Modal com botão X */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0 bg-white/[0.02]">
              <span className="text-xs font-black uppercase tracking-widest text-[#0063c6]">
                EALUMINA — Carta de Boas-Vindas
              </span>
              <button
                onClick={() => setShowSaibaMaisModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conteúdo com scroll interno */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-4 text-xs sm:text-sm leading-relaxed font-normal" style={{ color: '#768294' }}>
              <p className="font-semibold text-white text-sm sm:text-base">
                Olá, seja muito bem-vindo(a) à EALUMINA!
              </p>

              <p className="italic font-medium text-slate-300">
                A chave sempre esteve dentro de você. Obrigado por permitir que nossos caminhos se cruzem.
              </p>

              <p>
                Se você está lendo estas palavras, talvez haja uma parte de você que já não busca apenas aliviar os sintomas. Talvez você esteja tentando entender o que sente, compreender o que vivencia e, acima de tudo, compreender a si mesmo. Na EALUMINA, acreditamos que ninguém chega aqui por acaso. Toda busca nasce de uma profunda necessidade da alma de redescobrir o equilíbrio, o sentido e a paz.
              </p>

              <p>
                Antes de continuarmos, queremos lhe agradecer por ter a coragem de buscar um novo caminho e por nos permitir fazer parte da sua jornada. Esta plataforma foi criada pensando exatamente em você.
              </p>

              <p>
                Vivemos em um mundo que nos ensinou a buscar as respostas fora de nós mesmos — seja esperando que alguém resolva nossos problemas, seja procurando uma técnica perfeita ou uma solução imediata. Mas acreditamos que a verdadeira transformação nasce quando decidimos olhar para o nosso interior. Nenhum terapeuta possui esse poder, e nenhuma técnica fará isso por você. O terapeuta simplesmente ilumina as possibilidades, a tecnologia fornece as ferramentas, mas a transformação sempre pertence àqueles que decidem vivenciá-la.
              </p>

              <p>
                Por isso, nossa missão é simples: conectar pessoas que buscam compreender sua dor a terapeutas preparados para acompanhá-las nesse processo.
              </p>

              <p>
                Cada terapeuta da EALUMINA percorreu um caminho próprio, assim como você. Quando essas duas histórias se encontram, nasce um espaço de confiança. Não acreditamos que exista um terapeuta perfeito para todo mundo, mas sim o encontro certo, no momento certo. Mais do que encontrar uma técnica, você encontrará alguém capaz de apoiá-lo com respeito, escuta e humanidade.
              </p>

              <p>
                Sabemos que, às vezes, o corpo fala, as emoções transbordam e a mente pede ajuda. Independentemente da abordagem, há uma pergunta que merece ser feita: <span className="text-white italic">&quot;O que a vida está tentando me ensinar?&quot;</span> Como combinamos diferentes abordagens terapêuticas, entendemos que não existe uma resposta única, pois cada ser humano tem uma história e um caminho únicos.
              </p>

              <p>
                Você é muito maior do que parece ser. Mais do que um simples corpo físico, do que simples pensamentos ou emoções. Você possui uma profunda dimensão de consciência, capaz de aprender, transformar-se e reconstruir a sua própria história. Nosso trabalho não consiste em mudar quem você é, mas em ajudá-lo a lembrar da sua própria força.
              </p>

              <p>
                Nós sonhamos com um futuro onde o cuidado seja centrado no ser humano — mais consciente, preventivo e colaborativo. Um lugar onde as pessoas possam encontrar apoio antes que o sofrimento se transforme em doença e onde se lembrem de uma verdade profunda: <strong className="text-[#E19B28] font-bold">&quot;EU SOU O QUE SOU&quot;</strong>. Ninguém precisa se transformar em outra pessoa; a verdadeira transformação acontece quando deixamos de viver pelo medo, escolhemos viver conscientemente e reconhecemos a luz que sempre existiu dentro de nós.
              </p>

              <p>
                A decisão sempre será sua. Nenhuma mudança acontece sem vontade, e nenhum terapeuta pode caminhar por você. Mas você não precisa caminhar sozinho. Estamos aqui para oferecer ferramentas, conhecimento, escuta, tecnologia, comunidade e profissionais comprometidos em acompanhá-lo com respeito e responsabilidade.
              </p>

              <p className="font-medium text-slate-300">
                A chave sempre esteve dentro de você. Nós simplesmente ajudamos você a encontrá-la.
              </p>

              <div className="pt-3 border-t border-white/10">
                <p className="font-semibold text-white">Com carinho e dedicação,</p>
                <p className="font-bold text-[#E19B28]">Equipe EALUMINA.</p>
              </div>
            </div>

            {/* Footer do Modal com botão 'Fechar' */}
            <div className="flex items-center justify-end px-6 py-4 border-t border-white/10 shrink-0 bg-white/[0.02]">
              <button
                onClick={() => setShowSaibaMaisModal(false)}
                className="bg-white/[0.05] border border-white/10 hover:bg-white/10 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-md cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
