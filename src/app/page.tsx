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
  TrendingUp,
  Award,
  BookOpen
} from 'lucide-react'
import { Footer } from '@/components/Footer'

// --- DADOS DAS TERAPIAS ---
const TERAPIAS = [
  {
    nome: "ThetaHealing",
    desc: "Identifique e transforme crenças limitantes no nível subconsciente para criar uma realidade mais leve e abundante.",
    icon: <Sparkles className="text-[#D5B048]" />
  },
  {
    nome: "TQA — Terapia Quântica",
    desc: "Reequilíbrio vibracional profundo, atuando nos campos sutis para restaurar a harmonia física e emocional.",
    icon: <Zap className="text-[#409CFF]" />
  },
  {
    nome: "Terapia Multidimensional",
    desc: "Cura através do coração, trabalhando com seres de luz para limpar energias estagnadas de vidas passadas e do presente.",
    icon: <Heart className="text-[#D5B048]" />
  },
  {
    nome: "Mesa Metrônica MAQ",
    desc: "Ferramenta quântica de realinhamento energético que harmoniza todas as áreas da vida com geometrias sagradas.",
    icon: <Compass className="text-[#409CFF]" />
  },
  {
    nome: "Constelação Familiar",
    desc: "Libere emaranhamentos sistêmicos e padrões familiares repetitivos, trazendo paz e fluxo para sua ancestralidade.",
    icon: <Brain className="text-[#D5B048]" />
  },
  {
    nome: "Meditação",
    desc: "Práticas guiadas para acalmar a mente, reduzir a ansiedade e reconectar-se com a sua essência interior.",
    icon: <Moon className="text-[#409CFF]" />
  },
  {
    nome: "Mesa Arcturiana Multidimensional",
    desc: "Sistema de cura baseado na tecnologia de luz arcturiana, focado na elevação de frequência e limpeza espiritual.",
    icon: <Sun className="text-[#D5B048]" />
  },
  {
    nome: "EMF Balancing Technique",
    desc: "Harmonização da malha de calibração universal. Fortaleça sua energia e alinhe-se com seu propósito mais elevado.",
    icon: <Wind className="text-[#409CFF]" />
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

  // Scroll horizontal no desktop
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
      className="flex flex-row h-[100dvh] overflow-x-auto overflow-y-hidden snap-x snap-mandatory w-full bg-[#050811] text-slate-100 font-sans [&::-webkit-scrollbar]:hidden"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >

      {/* ──────────────────────────────────────────────────────────
          TELA 1: HOME (DESIGNEXACTO DA IMAGEM REFERENCE)
      ────────────────────────────────────────────────────────── */}
      <section
        id="home"
        className="w-full min-w-full h-[100dvh] snap-center flex flex-col justify-between relative bg-[#050811] overflow-y-auto shrink-0 p-4 md:p-8 lg:p-10 select-none"
      >
        {/* IMAGEM DE FUNDO PORTAL CÓSMICO */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img
            src="/img/hero-portal-bg.png"
            alt="Cosmic Portal"
            className="w-full h-full object-cover object-center opacity-85 scale-105 filter brightness-110 contrast-105"
          />
          {/* VIGNETTE GRADIENT PARA GARANTIR LEITURA PERFEITA DOS TEXTOS */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-[#050811]/45 to-[#050811]/80" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#050811]/30 to-[#050811]/90" />
        </div>

        {/* ── HEADER SUPERIOR ── */}
        <header className="relative z-20 flex items-center justify-between w-full max-w-7xl mx-auto pt-2 px-2">
          {/* Ícones Sociais (Youtube + Instagram) */}
          <div className="flex items-center gap-5">
            <a
              href="https://www.youtube.com/@ealumina4444"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-[#D5B048] transition-all transform hover:scale-110"
              aria-label="YouTube"
            >
              <Youtube className="w-6 h-6 stroke-[1.8]" />
            </a>
            <a
              href="https://www.instagram.com/ealumina4444"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-[#D5B048] transition-all transform hover:scale-110"
              aria-label="Instagram"
            >
              <Instagram className="w-6 h-6 stroke-[1.8]" />
            </a>
          </div>

          {/* Botões de Acesso (Entrar / Criar Conta) */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-white text-xs md:text-sm font-black uppercase tracking-[0.2em] hover:text-[#D5B048] transition-colors px-3 py-2"
            >
              ENTRAR
            </Link>
            <Link
              href="/register"
              className="bg-gradient-to-r from-[#D5B048] to-[#E5C158] hover:from-[#E5C158] hover:to-[#F5D568] text-black font-extrabold text-xs md:text-sm tracking-[0.15em] px-6 py-2.5 rounded-full transition-all shadow-[0_0_20px_rgba(213,176,72,0.4)] hover:shadow-[0_0_30px_rgba(213,176,72,0.7)] uppercase transform hover:scale-105"
            >
              CRIAR CONTA
            </Link>
          </div>
        </header>

        {/* ── CORPO CENTRAL (DUAS COLUNAS NO DESKTOP) ── */}
        <main className="relative z-20 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto py-4">

          {/* COLUNA ESQUERDA: LOGO + HEADLINE PRINCIPAL */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left pr-0 lg:pr-6">
            
            {/* EMBLEMA + BRAND TITLE */}
            <div className="flex flex-col items-center lg:items-start mb-3">
              <div className="relative w-28 h-28 md:w-36 md:h-36 mb-2">
                <img
                  src="/img/ea-lumina-emblem.png"
                  alt="EALUMINA Emblem"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_25px_rgba(213,176,72,0.5)]"
                />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-[0.2em] uppercase font-black text-transparent bg-clip-text bg-gradient-to-r from-[#D5B048] via-[#F5D568] to-[#90C8FF]">
                EALUMINA
              </h1>
            </div>

            {/* SLOGAN COM TEXTO COLORIDO EXACTAMENTE IGUAL À IMAGEM */}
            <h2 className="text-2xl md:text-3xl lg:text-[40px] font-black leading-[1.25] tracking-tight mb-4 max-w-2xl">
              <span className="text-[#E5C158]">Conectar quem busca </span>
              <span className="text-[#3B82F6]">transformar </span>
              <br className="hidden sm:inline" />
              <span className="text-[#E5C158]">sua vida com quem já percorreu </span>
              <br className="hidden sm:inline" />
              <span className="text-[#E5C158]">esse </span>
              <span className="text-[#3B82F6]">caminho.</span>
            </h2>

            {/* SUBTÍTULO DESCRITIVO */}
            <p className="text-gray-300/90 text-xs md:text-sm lg:text-base leading-relaxed font-normal max-w-xl">
              A EALUMINA é o encontro entre quem precisa e quem já transformou.<br className="hidden sm:inline" />
              Um ecossistema de terapias, conhecimento e propósito para uma vida mais equilibrada, consciente e com sentido.
            </p>
          </div>

          {/* COLUNA DIREITA: BOTÕES DE OBJETIVO */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end w-full">
            <div className="w-full max-w-md flex flex-col gap-3.5">
              <h3 className="text-gray-400 font-bold uppercase tracking-[0.25em] text-[11px] md:text-xs mb-1 text-center lg:text-left pl-1">
                QUAL É O SEU OBJETIVO HOJE?
              </h3>

              {[
                { id: 'pacientes', label: 'SOU PACIENTE', icon: <Heart className="w-5 h-5 text-[#409CFF]" /> },
                { id: 'terapeutas', label: 'SOU TERAPEUTA', icon: <Sparkles className="w-5 h-5 text-[#409CFF]" /> },
                { id: 'empresas', label: 'PARA EMPRESAS', icon: <Brain className="w-5 h-5 text-[#409CFF]" /> },
                { id: 'cursos', label: 'VER CURSOS', icon: <Compass className="w-5 h-5 text-[#409CFF]" /> }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="group flex items-center justify-between w-full bg-[#091122]/80 backdrop-blur-xl border border-white/10 hover:border-[#D5B048]/60 hover:bg-[#0E1B36]/90 text-white rounded-2xl px-6 py-4 transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(213,176,72,0.25)] transform hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-1 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <span className="text-xs md:text-sm font-black tracking-[0.2em] uppercase text-white group-hover:text-[#F5D568] transition-colors">
                      {item.label}
                    </span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#D5B048] group-hover:translate-x-1.5 transition-all" />
                </button>
              ))}
            </div>
          </div>

        </main>

        {/* ── CARD GRID INFERIOR (4 CARDS DE PILARES) ── */}
        <div className="relative z-20 w-full max-w-7xl mx-auto pt-2 pb-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            
            {/* CARD 1 */}
            <div className="bg-[#091124]/70 backdrop-blur-md border border-white/10 hover:border-[#D5B048]/50 rounded-2xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:shadow-[0_0_20px_rgba(213,176,72,0.15)] group">
              <div className="w-10 h-10 rounded-full bg-[#D5B048]/10 border border-[#D5B048]/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Heart className="w-5 h-5 text-[#D5B048]" />
              </div>
              <h4 className="text-[#D5B048] font-bold text-xs md:text-sm tracking-[0.15em] uppercase mb-2">
                CONECTAMOS PROPÓSITOS
              </h4>
              <p className="text-gray-300 text-[11px] md:text-xs leading-relaxed">
                A plataforma que aproxima quem busca transformação com profissionais que já trilharam esse caminho.
              </p>
            </div>

            {/* CARD 2 */}
            <div className="bg-[#091124]/70 backdrop-blur-md border border-white/10 hover:border-[#409CFF]/50 rounded-2xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:shadow-[0_0_20px_rgba(64,156,255,0.15)] group">
              <div className="w-10 h-10 rounded-full bg-[#409CFF]/10 border border-[#409CFF]/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5 text-[#409CFF]" />
              </div>
              <h4 className="text-[#409CFF] font-bold text-xs md:text-sm tracking-[0.15em] uppercase mb-2">
                TRANSFORMAÇÃO REAL
              </h4>
              <p className="text-gray-300 text-[11px] md:text-xs leading-relaxed">
                Terapias, ferramentas e profissionais preparados para cuidar do corpo, da mente e das emoções.
              </p>
            </div>

            {/* CARD 3 */}
            <div className="bg-[#091124]/70 backdrop-blur-md border border-white/10 hover:border-[#D5B048]/50 rounded-2xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:shadow-[0_0_20px_rgba(213,176,72,0.15)] group">
              <div className="w-10 h-10 rounded-full bg-[#D5B048]/10 border border-[#D5B048]/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5 text-[#D5B048]" />
              </div>
              <h4 className="text-[#D5B048] font-bold text-xs md:text-sm tracking-[0.15em] uppercase mb-2">
                COMUNIDADE QUE FORTALECE
              </h4>
              <p className="text-gray-300 text-[11px] md:text-xs leading-relaxed">
                Um espaço de apoio, troca e evolução coletiva para terapeutas e pessoas em busca de equilíbrio.
              </p>
            </div>

            {/* CARD 4 */}
            <div className="bg-[#091124]/70 backdrop-blur-md border border-white/10 hover:border-[#409CFF]/50 rounded-2xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:shadow-[0_0_20px_rgba(64,156,255,0.15)] group">
              <div className="w-10 h-10 rounded-full bg-[#409CFF]/10 border border-[#409CFF]/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5 text-[#409CFF]" />
              </div>
              <h4 className="text-[#409CFF] font-bold text-xs md:text-sm tracking-[0.15em] uppercase mb-2">
                IMPACTO QUE SE MULTIPLICA
              </h4>
              <p className="text-gray-300 text-[11px] md:text-xs leading-relaxed">
                Empresas e profissionais conectados para um mundo mais saudável e consciente.
              </p>
            </div>

          </div>
        </div>

        {/* ── FOOTER INFERIOR DA LANDING ── */}
        <footer className="relative z-20 w-full max-w-7xl mx-auto pt-2 pb-1">
          <div className="relative flex items-center justify-center mb-2">
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#D5B048]/50 to-transparent" />
            <div className="absolute bg-[#050811] px-3 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-[#D5B048]" />
            </div>
          </div>
          <p className="text-center text-[10px] md:text-xs tracking-[0.3em] text-[#D5B048] font-bold uppercase">
            MAIS QUE UMA PLATAFORMA. UMA JORNADA COLETIVA.
          </p>
        </footer>
      </section>


      {/* ──────────────────────────────────────────────────────────
          TELA 2: PACIENTES
      ────────────────────────────────────────────────────────── */}
      <section
        id="pacientes"
        className="w-full min-w-full h-[100dvh] snap-center flex flex-col items-center justify-start relative bg-[radial-gradient(circle_at_center,_#0a1428_0%,_#050811_100%)] overflow-y-auto shrink-0"
      >
        <div className="w-full px-4 md:px-12 pt-6 flex items-center justify-between">
          <button
            onClick={() => scrollToSection('home')}
            className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[#D5B048] flex items-center gap-2 transition-colors z-40"
          >
            <ChevronLeft size={16} /> Voltar ao Início
          </button>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 md:px-12 w-full flex flex-col pb-12 justify-center my-auto">
          <div className="mb-6 md:mb-10 text-center">
            <span className="inline-block text-[#409CFF] font-bold text-xs uppercase tracking-[0.2em] bg-[#409CFF]/10 px-4 py-1.5 rounded-full border border-[#409CFF]/20 mb-3">
              Para Pacientes
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-[#D5B048]">
              Sua jornada de<br />Luz e Equilíbrio.
            </h2>
          </div>

          <div className="relative w-full overflow-hidden group">
            <div className="flex w-max animate-marquee hover:[animation-play-state:paused] py-4">
              {[...TERAPIAS, ...TERAPIAS].map((terapia, i) => (
                <div key={i} className="w-[75vw] max-w-[300px] md:w-[350px] lg:w-[380px] flex-shrink-0 px-2 md:px-4">
                  <div className="bg-[#091122]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 hover:border-[#D5B048]/50 transition-all flex flex-col items-center text-center h-full min-h-[240px] justify-center shadow-lg hover:shadow-[0_0_25px_rgba(213,176,72,0.15)]">
                    <div className="mb-4 bg-slate-900/80 w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shrink-0 [&>svg]:w-6 [&>svg]:h-6 md:[&>svg]:w-8 md:[&>svg]:h-8 border border-white/5 shadow-inner">
                      {terapia.icon}
                    </div>
                    <h3 className="text-sm md:text-lg font-black text-white uppercase tracking-widest mb-3 line-clamp-2">{terapia.nome}</h3>
                    <p className="text-xs text-gray-300 leading-relaxed font-medium line-clamp-4">{terapia.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Link href="/register?role=PACIENTE">
              <button className="bg-gradient-to-r from-[#D5B048] to-[#E5C158] hover:from-[#E5C158] hover:to-[#F5D568] text-black font-extrabold text-sm tracking-wider px-8 py-3.5 rounded-full transition-all shadow-[0_0_20px_rgba(213,176,72,0.4)] uppercase transform hover:scale-105">
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
        className="w-full min-w-full h-[100dvh] snap-center flex flex-col items-center justify-start relative bg-[radial-gradient(circle_at_center,_#0a1428_0%,_#050811_100%)] overflow-y-auto shrink-0"
      >
        <div className="w-full px-4 md:px-12 pt-6 flex items-center justify-between">
          <button
            onClick={() => scrollToSection('home')}
            className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[#D5B048] flex items-center gap-2 transition-colors z-40"
          >
            <ChevronLeft size={16} /> Voltar ao Início
          </button>
        </div>

        <div className="max-w-5xl mx-auto px-4 md:px-12 w-full flex flex-col items-center text-center pb-12 my-auto">
          <div className="w-full mb-6 text-center">
            <span className="inline-block text-[#D5B048] font-bold text-xs uppercase tracking-[0.2em] bg-[#D5B048]/10 px-4 py-1.5 rounded-full border border-[#D5B048]/20 mb-3">
              Para Terapeutas
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-[#D5B048]">
              Expanda sua Luz.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8 text-left w-full">
            <div className="bg-[#091122]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-[#D5B048]/40 transition-colors group">
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-[#D5B048]/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 text-[#D5B048]" />
                </div>
                <h3 className="text-white font-bold text-base md:text-lg tracking-wide uppercase">Vitrine Premium</h3>
              </div>
              <p className="text-gray-300 text-xs md:text-sm leading-relaxed">Perfil de alto padrão desenhado para destacar suas especialidades e conectar sua energia a pacientes em busca de transformação.</p>
            </div>

            <div className="bg-[#091122]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-[#409CFF]/40 transition-colors group">
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-[#409CFF]/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <Compass className="w-6 h-6 text-[#409CFF]" />
                </div>
                <h3 className="text-white font-bold text-base md:text-lg tracking-wide uppercase">Gestão Inteligente</h3>
              </div>
              <p className="text-gray-300 text-xs md:text-sm leading-relaxed">Controle total sobre sua agenda com agendamentos automáticos e gestão de pagamentos integrados em um só lugar.</p>
            </div>
          </div>

          <Link href="/register?role=TERAPEUTA">
            <button className="bg-gradient-to-r from-[#D5B048] to-[#E5C158] hover:from-[#E5C158] hover:to-[#F5D568] text-black font-extrabold text-sm tracking-wider px-8 py-3.5 rounded-full transition-all shadow-[0_0_20px_rgba(213,176,72,0.4)] uppercase transform hover:scale-105 inline-flex items-center gap-2">
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
        className="w-full min-w-full h-[100dvh] snap-center flex flex-col items-center justify-start relative bg-[radial-gradient(circle_at_center,_#0a1428_0%,_#050811_100%)] overflow-y-auto shrink-0"
      >
        <div className="w-full px-4 md:px-12 pt-6 flex items-center justify-between">
          <button
            onClick={() => scrollToSection('home')}
            className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[#D5B048] flex items-center gap-2 transition-colors z-40"
          >
            <ChevronLeft size={16} /> Voltar ao Início
          </button>
        </div>

        <div className="max-w-4xl mx-auto px-4 md:px-12 w-full flex flex-col items-center text-center pb-12 my-auto">
          <span className="inline-block text-[#409CFF] font-bold text-xs uppercase tracking-[0.2em] bg-[#409CFF]/10 px-4 py-1.5 rounded-full border border-[#409CFF]/20 mb-3">
            Soluções Corporativas
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-[#D5B048] mb-4">
            Bem-estar elevado para equipes.
          </h2>
          <p className="text-gray-300 text-xs md:text-sm leading-relaxed max-w-2xl mb-8">
            Proporcione equilíbrio mental e emocional para sua equipe através de pacotes exclusivos de terapias integrativas. Profissionais focados, saudáveis e resilientes transformam o ambiente de trabalho.
          </p>
          <Link href="/contact">
            <button className="bg-gradient-to-r from-[#D5B048] to-[#E5C158] text-black font-extrabold text-sm tracking-wider px-8 py-3.5 rounded-full transition-all shadow-[0_0_20px_rgba(213,176,72,0.4)] uppercase transform hover:scale-105">
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
        className="w-full min-w-full h-[100dvh] snap-center flex flex-col items-center justify-start relative bg-[radial-gradient(circle_at_center,_#0a1428_0%,_#050811_100%)] overflow-y-auto shrink-0"
      >
        <div className="w-full px-4 md:px-12 pt-6 flex items-center justify-between">
          <button
            onClick={() => scrollToSection('home')}
            className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[#D5B048] flex items-center gap-2 transition-colors z-40"
          >
            <ChevronLeft size={16} /> Voltar ao Início
          </button>
        </div>

        <div className="max-w-4xl mx-auto px-4 md:px-12 w-full flex flex-col items-center text-center pb-12 my-auto">
          <span className="inline-block text-[#D5B048] font-bold text-xs uppercase tracking-[0.2em] bg-[#D5B048]/10 px-4 py-1.5 rounded-full border border-[#D5B048]/20 mb-3">
            Educação e Evolução
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-[#D5B048] mb-4">
            Jornada de Aprendizado.
          </h2>
          <p className="text-gray-300 text-xs md:text-sm leading-relaxed max-w-2xl mb-8">
            Aprofunde seus conhecimentos e expanda sua consciência. Cursos ministrados por especialistas renomados em terapias integrativas, pensados para seu desenvolvimento pessoal e certificação.
          </p>
          <button className="bg-gradient-to-r from-[#D5B048] to-[#E5C158] text-black font-extrabold text-sm tracking-wider px-8 py-3.5 rounded-full transition-all shadow-[0_0_20px_rgba(213,176,72,0.4)] uppercase transform hover:scale-105 inline-flex items-center gap-2">
            Explorar Catálogo <ArrowRight size={16} />
          </button>
        </div>
        <Footer />
      </section>

    </div>
  )
}
