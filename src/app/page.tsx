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
} from 'lucide-react'
import { Footer } from '@/components/Footer'
import { LandingHeader } from '@/components/home/LandingHeader'
import { HeroContent } from '@/components/home/HeroContent'
import { ObjectiveMenu } from '@/components/home/ObjectiveMenu'
import { BenefitsSection } from '@/components/home/BenefitsSection'
import { LandingFooterStatement } from '@/components/home/LandingFooterStatement'

// --- DADOS DAS TERAPIAS PARA SEÇÕES SECUNDÁRIAS ---
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
      className="flex flex-row h-[100dvh] overflow-x-auto overflow-y-hidden snap-x snap-mandatory w-full bg-[#020812] text-[#F5F7FA] font-sans [&::-webkit-scrollbar]:hidden"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >

      {/* ──────────────────────────────────────────────────────────
          TELA 1: HOME PÚBLICA MODERNIZADA
      ────────────────────────────────────────────────────────── */}
      <section
        id="home"
        className="w-full min-w-full h-[100dvh] snap-center flex flex-col justify-between relative bg-[#020812] overflow-y-auto shrink-0 select-none p-3 sm:p-4 md:p-6 lg:p-8"
      >
        {/* IMAGEM DE FUNDO DO PORTAL CÓSMICO COM GRADIENTES INTEGRADOS */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img
            src="/img/portal-cosmic-bg.jpg"
            alt="Portal Cósmico EA Lumina"
            className="w-full h-full object-cover object-center filter brightness-105 contrast-105"
          />
          {/* Transições sutis para não atrapalhar leitura */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020812] via-[#020812]/40 to-[#020812]/75" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020812]/90 via-[#020812]/30 to-[#020812]/90" />
        </div>

        {/* 1. CABEÇALHO */}
        <LandingHeader />

        {/* 2. ÁREA PRINCIPAL (ESQUERDA: INSTITUCIONAL, CENTRO: PORTAL, DIREITA: MENU) */}
        <main className="relative z-20 w-full max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-center my-auto px-4 md:px-8 py-4">
          
          {/* LADO ESQUERDO: LOGO + HEADLINE + SUBTÍTULO */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <HeroContent />
          </div>

          {/* LADO DIREITO: MENU DE OBJETIVOS */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end w-full">
            <ObjectiveMenu onSelectObjective={scrollToSection} />
          </div>
        </main>

        {/* 3. CARDS INFERIORES DE BENEFÍCIOS */}
        <div className="relative z-20 w-full">
          <BenefitsSection />
        </div>

        {/* 4. FRASE INSTITUCIONAL FINAL */}
        <LandingFooterStatement />
      </section>

      {/* ──────────────────────────────────────────────────────────
          TELA 2: PACIENTES (MANTIDA 100% INTACTA)
      ────────────────────────────────────────────────────────── */}
      <section
        id="pacientes"
        className="w-full min-w-full h-[100dvh] snap-center flex flex-col items-center justify-start relative bg-[radial-gradient(circle_at_center,_#0a1428_0%,_#020812_100%)] overflow-y-auto shrink-0"
      >
        <div className="w-full px-4 md:px-12 pt-6 flex items-center justify-between">
          <button
            onClick={() => scrollToSection('home')}
            className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#AAB4C3] hover:text-[#D6AA4C] flex items-center gap-2 transition-colors z-40"
          >
            <ChevronLeft size={16} /> Voltar ao Início
          </button>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 md:px-12 w-full flex flex-col pb-12 justify-center my-auto">
          <div className="mb-6 md:mb-10 text-center">
            <span className="inline-block text-[#377DF4] font-bold text-xs uppercase tracking-[0.2em] bg-[#377DF4]/10 px-4 py-1.5 rounded-full border border-[#377DF4]/20 mb-3">
              Para Pacientes
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-[#D6AA4C]">
              Sua jornada de<br />Luz e Equilíbrio.
            </h2>
          </div>

          <div className="relative w-full overflow-hidden group">
            <div className="flex w-max animate-marquee hover:[animation-play-state:paused] py-4">
              {[...TERAPIAS, ...TERAPIAS].map((terapia, i) => (
                <div key={i} className="w-[75vw] max-w-[300px] md:w-[350px] lg:w-[380px] flex-shrink-0 px-2 md:px-4">
                  <div className="bg-[#0a1120]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 hover:border-[#D6AA4C]/50 transition-all flex flex-col items-center text-center h-full min-h-[240px] justify-center shadow-lg">
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
              <button className="bg-[#D6AA4C] hover:bg-[#F0CF78] text-[#020812] font-bold text-sm tracking-wider px-8 py-3.5 rounded-full transition-all shadow-[0_0_20px_rgba(214,170,76,0.4)] uppercase">
                Começar agora
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          TELA 3: TERAPEUTAS (MANTIDA 100% INTACTA)
      ────────────────────────────────────────────────────────── */}
      <section
        id="terapeutas"
        className="w-full min-w-full h-[100dvh] snap-center flex flex-col items-center justify-start relative bg-[radial-gradient(circle_at_center,_#0a1428_0%,_#020812_100%)] overflow-y-auto shrink-0"
      >
        <div className="w-full px-4 md:px-12 pt-6 flex items-center justify-between">
          <button
            onClick={() => scrollToSection('home')}
            className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#AAB4C3] hover:text-[#D6AA4C] flex items-center gap-2 transition-colors z-40"
          >
            <ChevronLeft size={16} /> Voltar ao Início
          </button>
        </div>

        <div className="max-w-5xl mx-auto px-4 md:px-12 w-full flex flex-col items-center text-center pb-12 my-auto">
          <div className="w-full mb-6 text-center">
            <span className="inline-block text-[#D6AA4C] font-bold text-xs uppercase tracking-[0.2em] bg-[#D6AA4C]/10 px-4 py-1.5 rounded-full border border-[#D6AA4C]/20 mb-3">
              Para Terapeutas
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-[#D6AA4C]">
              Expanda sua Luz.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8 text-left w-full">
            <div className="bg-[#0a1120]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-[#D6AA4C]/40 transition-colors group">
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-[#D6AA4C]/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 text-[#D6AA4C]" />
                </div>
                <h3 className="text-white font-bold text-base md:text-lg tracking-wide uppercase">Vitrine Premium</h3>
              </div>
              <p className="text-gray-300 text-xs md:text-sm leading-relaxed">Perfil de alto padrão desenhado para destacar suas especialidades e conectar sua energia a pacientes em busca de transformação.</p>
            </div>

            <div className="bg-[#0a1120]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-[#377DF4]/40 transition-colors group">
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-[#377DF4]/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <Compass className="w-6 h-6 text-[#377DF4]" />
                </div>
                <h3 className="text-white font-bold text-base md:text-lg tracking-wide uppercase">Gestão Inteligente</h3>
              </div>
              <p className="text-gray-300 text-xs md:text-sm leading-relaxed">Controle total sobre sua agenda com agendamentos automáticos e gestão de pagamentos integrados em um só lugar.</p>
            </div>
          </div>

          <Link href="/register?role=TERAPEUTA">
            <button className="bg-[#D6AA4C] hover:bg-[#F0CF78] text-[#020812] font-bold text-sm tracking-wider px-8 py-3.5 rounded-full transition-all shadow-[0_0_20px_rgba(214,170,76,0.4)] uppercase inline-flex items-center gap-2">
              Quero Atender <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          TELA 4: EMPRESAS (MANTIDA 100% INTACTA)
      ────────────────────────────────────────────────────────── */}
      <section
        id="empresas"
        className="w-full min-w-full h-[100dvh] snap-center flex flex-col items-center justify-start relative bg-[radial-gradient(circle_at_center,_#0a1428_0%,_#020812_100%)] overflow-y-auto shrink-0"
      >
        <div className="w-full px-4 md:px-12 pt-6 flex items-center justify-between">
          <button
            onClick={() => scrollToSection('home')}
            className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#AAB4C3] hover:text-[#D6AA4C] flex items-center gap-2 transition-colors z-40"
          >
            <ChevronLeft size={16} /> Voltar ao Início
          </button>
        </div>

        <div className="max-w-4xl mx-auto px-4 md:px-12 w-full flex flex-col items-center text-center pb-12 my-auto">
          <span className="inline-block text-[#377DF4] font-bold text-xs uppercase tracking-[0.2em] bg-[#377DF4]/10 px-4 py-1.5 rounded-full border border-[#377DF4]/20 mb-3">
            Soluções Corporativas
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-[#D6AA4C] mb-4">
            Bem-estar elevado para equipes.
          </h2>
          <p className="text-gray-300 text-xs md:text-sm leading-relaxed max-w-2xl mb-8">
            Proporcione equilíbrio mental e emocional para sua equipe através de pacotes exclusivos de terapias integrativas. Profissionais focados, saudáveis e resilientes transformam o ambiente de trabalho.
          </p>
          <Link href="/contact">
            <button className="bg-[#D6AA4C] hover:bg-[#F0CF78] text-[#020812] font-bold text-sm tracking-wider px-8 py-3.5 rounded-full transition-all shadow-[0_0_20px_rgba(214,170,76,0.4)] uppercase">
              Falar com Consultor
            </button>
          </Link>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          TELA 5: CURSOS (MANTIDA 100% INTACTA)
      ────────────────────────────────────────────────────────── */}
      <section
        id="cursos"
        className="w-full min-w-full h-[100dvh] snap-center flex flex-col items-center justify-start relative bg-[radial-gradient(circle_at_center,_#0a1428_0%,_#020812_100%)] overflow-y-auto shrink-0"
      >
        <div className="w-full px-4 md:px-12 pt-6 flex items-center justify-between">
          <button
            onClick={() => scrollToSection('home')}
            className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#AAB4C3] hover:text-[#D6AA4C] flex items-center gap-2 transition-colors z-40"
          >
            <ChevronLeft size={16} /> Voltar ao Início
          </button>
        </div>

        <div className="max-w-4xl mx-auto px-4 md:px-12 w-full flex flex-col items-center text-center pb-12 my-auto">
          <span className="inline-block text-[#D6AA4C] font-bold text-xs uppercase tracking-[0.2em] bg-[#D6AA4C]/10 px-4 py-1.5 rounded-full border border-[#D6AA4C]/20 mb-3">
            Educação e Evolução
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-[#D6AA4C] mb-4">
            Jornada de Aprendizado.
          </h2>
          <p className="text-gray-300 text-xs md:text-sm leading-relaxed max-w-2xl mb-8">
            Aprofunde seus conhecimentos e expanda sua consciência. Cursos ministrados por especialistas renomados em terapias integrativas, pensados para seu desenvolvimento pessoal e certificação.
          </p>
          <button className="bg-[#D6AA4C] hover:bg-[#F0CF78] text-[#020812] font-bold text-sm tracking-wider px-8 py-3.5 rounded-full transition-all shadow-[0_0_20px_rgba(214,170,76,0.4)] uppercase inline-flex items-center gap-2">
            Explorar Catálogo <ArrowRight size={16} />
          </button>
        </div>
        <Footer />
      </section>

    </div>
  )
}
