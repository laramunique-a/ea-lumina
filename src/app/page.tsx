'use client'

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  ChevronLeft,
  Sparkles,
  Brain,
  Heart,
  Zap,
  Compass,
  Wind,
  Moon,
  Sun,
  Youtube,
  Instagram,
  Users,
  TrendingUp
} from 'lucide-react'
import { Footer } from '@/components/Footer'

// --- DADOS DAS TERAPIAS PARA OUTRAS TELAS ---
const TERAPIAS = [
  {
    nome: "ThetaHealing",
    desc: "Identifique e transforme crenças limitantes no nível subconsciente para criar uma realidade mais leve e abundante.",
    icon: <Sparkles className="text-[#C5A03F]" />
  },
  {
    nome: "TQA — Terapia Quântica",
    desc: "Reequilíbrio vibracional profundo, atuando nos campos sutis para restaurar a harmonia física e emocional.",
    icon: <Zap className="text-[#3B82F6]" />
  },
  {
    nome: "Terapia Multidimensional",
    desc: "Cura através do coração, trabalhando com seres de luz para limpar energias estagnadas de vidas passadas e do presente.",
    icon: <Heart className="text-[#C5A03F]" />
  },
  {
    nome: "Mesa Metrônica MAQ",
    desc: "Ferramenta quântica de realinhamento energético que harmoniza todas as áreas da vida com geometrias sagradas.",
    icon: <Compass className="text-[#3B82F6]" />
  },
  {
    nome: "Constelação Familiar",
    desc: "Libere emaranhamentos sistêmicos e padrões familiares repetitivos, trazendo paz e fluxo para sua ancestralidade.",
    icon: <Brain className="text-[#C5A03F]" />
  },
  {
    nome: "Meditação",
    desc: "Práticas guiadas para acalmar a mente, reduzir a ansiedade e reconectar-se com a sua essência interior.",
    icon: <Moon className="text-[#3B82F6]" />
  },
  {
    nome: "Mesa Arcturiana Multidimensional",
    desc: "Sistema de cura baseado na tecnologia de luz arcturiana, focado na elevação de frequência e limpeza espiritual.",
    icon: <Sun className="text-[#C5A03F]" />
  },
  {
    nome: "EMF Balancing Technique",
    desc: "Harmonização da malha de calibração universal. Fortaleça sua energia e alinhe-se com seu propósito mais elevado.",
    icon: <Wind className="text-[#3B82F6]" />
  }
]

export default function LandingPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      if (window.innerWidth < 1024) return
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
    <div
      ref={scrollContainerRef}
      className="flex flex-row h-[100dvh] overflow-x-auto overflow-y-hidden snap-x snap-mandatory w-full bg-[#02050b] text-slate-100 font-sans [&::-webkit-scrollbar]:hidden"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >

      {/* ──────────────────────────────────────────────────────────
          TELA 1: HOME (REPLICAÇÃO 1:1 DO MODELO SOLICITADO)
      ────────────────────────────────────────────────────────── */}
      <section
        id="home"
        className="w-full min-w-full h-[100dvh] snap-center flex flex-col justify-between relative bg-[#02050b] overflow-hidden shrink-0 select-none p-4 md:p-6 lg:p-8"
      >
        {/* IMAGEM DE FUNDO DO PORTAL CÓSMICO (ENVIA PELO USUÁRIO) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img
            src="/img/portal-cosmic-bg.jpg"
            alt="Portal Cósmico"
            className="w-full h-full object-cover object-center filter brightness-105 contrast-105"
          />
          {/* MÁSCARA GRADIENTE SUAVE PARA DESTACAR CONTEÚDOS */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#02050b] via-[#02050b]/30 to-[#02050b]/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#02050b]/80 via-transparent to-[#02050b]/80" />
        </div>

        {/* ── TOP HEADER (SOCIAIS + LOGIN/REGISTRO) ── */}
        <header className="relative z-30 flex items-center justify-between w-full max-w-[1400px] mx-auto pt-1 px-4">
          {/* Redes Sociais */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.youtube.com/@ealumina4444"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:opacity-80 transition-opacity"
              aria-label="YouTube"
            >
              <Youtube className="w-5 h-5 stroke-[2]" />
            </a>
            <a
              href="https://www.instagram.com/ealumina4444"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:opacity-80 transition-opacity"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5 stroke-[2]" />
            </a>
          </div>

          {/* Autenticação */}
          <div className="flex items-center gap-5">
            <Link
              href="/login"
              className="text-white text-[11px] md:text-xs font-bold uppercase tracking-[0.2em] hover:text-[#C5A03F] transition-colors"
            >
              ENTRAR
            </Link>
            <Link
              href="/register"
              className="bg-[#C5A03F] hover:bg-[#D5B048] text-black font-bold text-[11px] md:text-xs tracking-[0.15em] px-6 py-2.5 rounded-full transition-all shadow-[0_0_15px_rgba(197,160,63,0.3)] uppercase"
            >
              CRIAR CONTA
            </Link>
          </div>
        </header>

        {/* ── CORPO CENTRAL (MODELO EXACTO DE DUAS COLUNAS) ── */}
        <main className="relative z-30 w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-auto px-4">

          {/* COLUNA ESQUERDA: EMBLEMA + NOME + HEADLINE COLORIDA + SUBTÍTULO */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left pr-0 lg:pr-8">
            
            {/* LOGO OFICIAL EALUMINA */}
            <div className="flex flex-col items-center lg:items-start mb-3">
              <div className="w-56 md:w-72 lg:w-80 h-auto">
                <img
                  src="/img/logo-official.png"
                  alt="EALUMINA"
                  className="w-full h-auto object-contain mix-blend-screen filter drop-shadow-[0_0_20px_rgba(197,160,63,0.5)]"
                />
              </div>
            </div>

            {/* HEADLINE PRINCIPAL COM CORES EXATAS DO MODELO */}
            <h2 className="text-xl md:text-2xl lg:text-[34px] font-black leading-[1.25] tracking-tight mb-3 max-w-xl">
              <span className="text-[#C5A03F]">Conectar quem busca </span>
              <span className="text-[#3B82F6]">transformar </span>
              <br className="hidden sm:inline" />
              <span className="text-[#C5A03F]">sua vida com quem já percorreu </span>
              <br className="hidden sm:inline" />
              <span className="text-[#C5A03F]">esse </span>
              <span className="text-[#3B82F6]">caminho.</span>
            </h2>

            {/* TEXTO DESCRITIVO */}
            <p className="text-gray-300 text-[11px] md:text-xs lg:text-sm leading-relaxed font-normal max-w-lg">
              A EALUMINA é o encontro entre quem precisa e quem já transformou.<br className="hidden sm:inline" />
              Um ecossistema de terapias, conhecimento e propósito para uma vida mais equilibrada, consciente e com sentido.
            </p>
          </div>

          {/* COLUNA DIREITA: CARDS DE OBJETIVO (PILLS TRANSLÚCIDAS) */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end w-full">
            <div className="w-full max-w-[380px] flex flex-col gap-3">
              <h3 className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] md:text-[11px] mb-1 text-center lg:text-left pl-1">
                QUAL É O SEU OBJETIVO HOJE?
              </h3>

              {/* CARD 1: SOU PACIENTE */}
              <button
                onClick={() => scrollToSection('pacientes')}
                className="group flex items-center justify-between w-full bg-[#0a1120]/80 backdrop-blur-md border border-white/10 hover:border-[#3B82F6]/50 hover:bg-[#0f192e] text-white rounded-2xl px-5 py-3.5 transition-all shadow-md"
              >
                <div className="flex items-center gap-3.5">
                  <Heart className="w-4 h-4 text-[#3B82F6]" />
                  <span className="text-xs font-bold tracking-[0.18em] uppercase text-white">
                    SOU PACIENTE
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#3B82F6] group-hover:translate-x-1 transition-all" />
              </button>

              {/* CARD 2: SOU TERAPEUTA */}
              <button
                onClick={() => scrollToSection('terapeutas')}
                className="group flex items-center justify-between w-full bg-[#0a1120]/80 backdrop-blur-md border border-white/10 hover:border-[#3B82F6]/50 hover:bg-[#0f192e] text-white rounded-2xl px-5 py-3.5 transition-all shadow-md"
              >
                <div className="flex items-center gap-3.5">
                  <Sparkles className="w-4 h-4 text-[#3B82F6]" />
                  <span className="text-xs font-bold tracking-[0.18em] uppercase text-white">
                    SOU TERAPEUTA
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#3B82F6] group-hover:translate-x-1 transition-all" />
              </button>

              {/* CARD 3: PARA EMPRESAS */}
              <button
                onClick={() => scrollToSection('empresas')}
                className="group flex items-center justify-between w-full bg-[#0a1120]/80 backdrop-blur-md border border-white/10 hover:border-[#3B82F6]/50 hover:bg-[#0f192e] text-white rounded-2xl px-5 py-3.5 transition-all shadow-md"
              >
                <div className="flex items-center gap-3.5">
                  <Brain className="w-4 h-4 text-[#3B82F6]" />
                  <span className="text-xs font-bold tracking-[0.18em] uppercase text-white">
                    PARA EMPRESAS
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#3B82F6] group-hover:translate-x-1 transition-all" />
              </button>

              {/* CARD 4: VER CURSOS */}
              <button
                onClick={() => scrollToSection('cursos')}
                className="group flex items-center justify-between w-full bg-[#0a1120]/80 backdrop-blur-md border border-white/10 hover:border-[#3B82F6]/50 hover:bg-[#0f192e] text-white rounded-2xl px-5 py-3.5 transition-all shadow-md"
              >
                <div className="flex items-center gap-3.5">
                  <Compass className="w-4 h-4 text-[#3B82F6]" />
                  <span className="text-xs font-bold tracking-[0.18em] uppercase text-white">
                    VER CURSOS
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#3B82F6] group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>

        </main>

        {/* ── GRID INFERIOR DE CARDS (4 PILARES DA MARCA) ── */}
        <div className="relative z-30 w-full max-w-[1400px] mx-auto pb-1 px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* PILAR 1 */}
            <div className="bg-[#050b16]/75 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center hover:border-[#C5A03F]/40 transition-colors">
              <div className="w-8 h-8 rounded-full border border-[#C5A03F]/40 flex items-center justify-center mb-2">
                <Heart className="w-4 h-4 text-[#C5A03F]" />
              </div>
              <h4 className="text-[#C5A03F] font-bold text-[11px] tracking-[0.15em] uppercase mb-1.5">
                CONECTAMOS PROPÓSITOS
              </h4>
              <p className="text-gray-300 text-[10px] leading-relaxed">
                A plataforma que aproxima quem busca transformação com profissionais que já trilharam esse caminho.
              </p>
            </div>

            {/* PILAR 2 */}
            <div className="bg-[#050b16]/75 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center hover:border-[#3B82F6]/40 transition-colors">
              <div className="w-8 h-8 rounded-full border border-[#3B82F6]/40 flex items-center justify-center mb-2">
                <Sparkles className="w-4 h-4 text-[#3B82F6]" />
              </div>
              <h4 className="text-[#3B82F6] font-bold text-[11px] tracking-[0.15em] uppercase mb-1.5">
                TRANSFORMAÇÃO REAL
              </h4>
              <p className="text-gray-300 text-[10px] leading-relaxed">
                Terapias, ferramentas e profissionais preparados para cuidar do corpo, da mente e das emoções.
              </p>
            </div>

            {/* PILAR 3 */}
            <div className="bg-[#050b16]/75 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center hover:border-[#C5A03F]/40 transition-colors">
              <div className="w-8 h-8 rounded-full border border-[#C5A03F]/40 flex items-center justify-center mb-2">
                <Users className="w-4 h-4 text-[#C5A03F]" />
              </div>
              <h4 className="text-[#C5A03F] font-bold text-[11px] tracking-[0.15em] uppercase mb-1.5">
                COMUNIDADE QUE FORTALECE
              </h4>
              <p className="text-gray-300 text-[10px] leading-relaxed">
                Um espaço de apoio, troca e evolução coletiva para terapeutas e pessoas em busca de equilíbrio.
              </p>
            </div>

            {/* PILAR 4 */}
            <div className="bg-[#050b16]/75 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center hover:border-[#3B82F6]/40 transition-colors">
              <div className="w-8 h-8 rounded-full border border-[#3B82F6]/40 flex items-center justify-center mb-2">
                <TrendingUp className="w-4 h-4 text-[#3B82F6]" />
              </div>
              <h4 className="text-[#3B82F6] font-bold text-[11px] tracking-[0.15em] uppercase mb-1.5">
                IMPACTO QUE SE MULTIPLICA
              </h4>
              <p className="text-gray-300 text-[10px] leading-relaxed">
                Empresas e profissionais conectados para um mundo mais saudável e consciente.
              </p>
            </div>

          </div>
        </div>

        {/* ── LINHA DE RODAPÉ COM BRILHO CENTRAL ── */}
        <footer className="relative z-30 w-full max-w-[1400px] mx-auto pb-1 px-4">
          <div className="relative flex items-center justify-center mb-1">
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#C5A03F]/40 to-transparent" />
            <div className="absolute bg-[#02050b] px-2 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rotate-45 bg-[#C5A03F]" />
            </div>
          </div>
          <p className="text-center text-[9px] md:text-[10px] tracking-[0.3em] text-[#C5A03F] font-bold uppercase">
            MAIS QUE UMA PLATAFORMA. UMA JORNADA COLETIVA.
          </p>
        </footer>
      </section>

      {/* ──────────────────────────────────────────────────────────
          TELA 2: PACIENTES
      ────────────────────────────────────────────────────────── */}
      <section
        id="pacientes"
        className="w-full min-w-full h-[100dvh] snap-center flex flex-col items-center justify-start relative bg-[radial-gradient(circle_at_center,_#0a1428_0%,_#02050b_100%)] overflow-y-auto shrink-0"
      >
        <div className="w-full px-4 md:px-12 pt-6 flex items-center justify-between">
          <button
            onClick={() => scrollToSection('home')}
            className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-[#C5A03F] flex items-center gap-2 transition-colors z-40"
          >
            <ChevronLeft size={16} /> Voltar ao Início
          </button>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 md:px-12 w-full flex flex-col pb-12 justify-center my-auto">
          <div className="mb-6 md:mb-10 text-center">
            <span className="inline-block text-[#3B82F6] font-bold text-xs uppercase tracking-[0.2em] bg-[#3B82F6]/10 px-4 py-1.5 rounded-full border border-[#3B82F6]/20 mb-3">
              Para Pacientes
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-[#C5A03F]">
              Sua jornada de<br />Luz e Equilíbrio.
            </h2>
          </div>

          <div className="relative w-full overflow-hidden group">
            <div className="flex w-max animate-marquee hover:[animation-play-state:paused] py-4">
              {[...TERAPIAS, ...TERAPIAS].map((terapia, i) => (
                <div key={i} className="w-[75vw] max-w-[300px] md:w-[350px] lg:w-[380px] flex-shrink-0 px-2 md:px-4">
                  <div className="bg-[#0a1120]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 hover:border-[#C5A03F]/50 transition-all flex flex-col items-center text-center h-full min-h-[240px] justify-center shadow-lg">
                    <div className="mb-4 bg-slate-900/80 w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shrink-0 [&>svg]:w-6 [&>svg]:h-6 md:[&>svg]:w-8 md:[&>svg]:h-8 border border-white/5 shadow-inner">
                      {terapia.icon}
                    </div>
                    <h3 className="text-sm md:text-lg font-bold text-white uppercase tracking-widest mb-3 line-clamp-2">{terapia.nome}</h3>
                    <p className="text-xs text-gray-300 leading-relaxed font-normal line-clamp-4">{terapia.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Link href="/register?role=PACIENTE">
              <button className="bg-[#C5A03F] hover:bg-[#D5B048] text-black font-bold text-sm tracking-wider px-8 py-3.5 rounded-full transition-all shadow-[0_0_20px_rgba(197,160,63,0.4)] uppercase">
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
        className="w-full min-w-full h-[100dvh] snap-center flex flex-col items-center justify-start relative bg-[radial-gradient(circle_at_center,_#0a1428_0%,_#02050b_100%)] overflow-y-auto shrink-0"
      >
        <div className="w-full px-4 md:px-12 pt-6 flex items-center justify-between">
          <button
            onClick={() => scrollToSection('home')}
            className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-[#C5A03F] flex items-center gap-2 transition-colors z-40"
          >
            <ChevronLeft size={16} /> Voltar ao Início
          </button>
        </div>

        <div className="max-w-5xl mx-auto px-4 md:px-12 w-full flex flex-col items-center text-center pb-12 my-auto">
          <div className="w-full mb-6 text-center">
            <span className="inline-block text-[#C5A03F] font-bold text-xs uppercase tracking-[0.2em] bg-[#C5A03F]/10 px-4 py-1.5 rounded-full border border-[#C5A03F]/20 mb-3">
              Para Terapeutas
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-[#C5A03F]">
              Expanda sua Luz.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8 text-left w-full">
            <div className="bg-[#0a1120]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-[#C5A03F]/40 transition-colors group">
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-[#C5A03F]/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 text-[#C5A03F]" />
                </div>
                <h3 className="text-white font-bold text-base md:text-lg tracking-wide uppercase">Vitrine Premium</h3>
              </div>
              <p className="text-gray-300 text-xs md:text-sm leading-relaxed">Perfil de alto padrão desenhado para destacar suas especialidades e conectar sua energia a pacientes em busca de transformação.</p>
            </div>

            <div className="bg-[#0a1120]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-[#3B82F6]/40 transition-colors group">
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-[#3B82F6]/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <Compass className="w-6 h-6 text-[#3B82F6]" />
                </div>
                <h3 className="text-white font-bold text-base md:text-lg tracking-wide uppercase">Gestão Inteligente</h3>
              </div>
              <p className="text-gray-300 text-xs md:text-sm leading-relaxed">Controle total sobre sua agenda com agendamentos automáticos e gestão de pagamentos integrados em um só lugar.</p>
            </div>
          </div>

          <Link href="/register?role=TERAPEUTA">
            <button className="bg-[#C5A03F] hover:bg-[#D5B048] text-black font-bold text-sm tracking-wider px-8 py-3.5 rounded-full transition-all shadow-[0_0_20px_rgba(197,160,63,0.4)] uppercase inline-flex items-center gap-2">
              Quero Atender <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          TELA 4: EMPRESAS
      ────────────────────────────────────────────────────────── */}
      <section
        id="empresas"
        className="w-full min-w-full h-[100dvh] snap-center flex flex-col items-center justify-start relative bg-[radial-gradient(circle_at_center,_#0a1428_0%,_#02050b_100%)] overflow-y-auto shrink-0"
      >
        <div className="w-full px-4 md:px-12 pt-6 flex items-center justify-between">
          <button
            onClick={() => scrollToSection('home')}
            className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-[#C5A03F] flex items-center gap-2 transition-colors z-40"
          >
            <ChevronLeft size={16} /> Voltar ao Início
          </button>
        </div>

        <div className="max-w-4xl mx-auto px-4 md:px-12 w-full flex flex-col items-center text-center pb-12 my-auto">
          <span className="inline-block text-[#3B82F6] font-bold text-xs uppercase tracking-[0.2em] bg-[#3B82F6]/10 px-4 py-1.5 rounded-full border border-[#3B82F6]/20 mb-3">
            Soluções Corporativas
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-[#C5A03F] mb-4">
            Bem-estar elevado para equipes.
          </h2>
          <p className="text-gray-300 text-xs md:text-sm leading-relaxed max-w-2xl mb-8">
            Proporcione equilíbrio mental e emocional para sua equipe através de pacotes exclusivos de terapias integrativas. Profissionais focados, saudáveis e resilientes transformam o ambiente de trabalho.
          </p>
          <Link href="/contact">
            <button className="bg-[#C5A03F] hover:bg-[#D5B048] text-black font-bold text-sm tracking-wider px-8 py-3.5 rounded-full transition-all shadow-[0_0_20px_rgba(197,160,63,0.4)] uppercase">
              Falar com Consultor
            </button>
          </Link>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          TELA 5: CURSOS
      ────────────────────────────────────────────────────────── */}
      <section
        id="cursos"
        className="w-full min-w-full h-[100dvh] snap-center flex flex-col items-center justify-start relative bg-[radial-gradient(circle_at_center,_#0a1428_0%,_#02050b_100%)] overflow-y-auto shrink-0"
      >
        <div className="w-full px-4 md:px-12 pt-6 flex items-center justify-between">
          <button
            onClick={() => scrollToSection('home')}
            className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-[#C5A03F] flex items-center gap-2 transition-colors z-40"
          >
            <ChevronLeft size={16} /> Voltar ao Início
          </button>
        </div>

        <div className="max-w-4xl mx-auto px-4 md:px-12 w-full flex flex-col items-center text-center pb-12 my-auto">
          <span className="inline-block text-[#C5A03F] font-bold text-xs uppercase tracking-[0.2em] bg-[#C5A03F]/10 px-4 py-1.5 rounded-full border border-[#C5A03F]/20 mb-3">
            Educação e Evolução
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-[#C5A03F] mb-4">
            Jornada de Aprendizado.
          </h2>
          <p className="text-gray-300 text-xs md:text-sm leading-relaxed max-w-2xl mb-8">
            Aprofunde seus conhecimentos e expanda sua consciência. Cursos ministrados por especialistas renomados em terapias integrativas, pensados para seu desenvolvimento pessoal e certificação.
          </p>
          <button className="bg-[#C5A03F] hover:bg-[#D5B048] text-black font-bold text-sm tracking-wider px-8 py-3.5 rounded-full transition-all shadow-[0_0_20px_rgba(197,160,63,0.4)] uppercase inline-flex items-center gap-2">
            Explorar Catálogo <ArrowRight size={16} />
          </button>
        </div>
        <Footer />
      </section>

    </div>
  )
}
