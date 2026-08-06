'use client'

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  ArrowRight, ChevronLeft, Youtube, Instagram,
  Heart, Sparkles, Brain, Compass,
  Atom, Zap, Waves, Users, Flower2, Moon
} from 'lucide-react'
import { Footer } from '@/components/Footer'

// ─── Ícone de Estrela Decorativa ───────────────────────────────────────────
const StarIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M30 0 L32.5 27.5 L60 30 L32.5 32.5 L30 60 L27.5 32.5 L0 30 L27.5 27.5 Z" fill="white" fillOpacity="0.85" />
  </svg>
)

// ─── Dados das terapias para a seção Pacientes ─────────────────────────────
const TERAPIAS = [
  {
    nome: 'ThetaHealing',
    desc: 'Técnica quântica que atua na raiz das crenças limitantes e promove cura profunda no nível da alma.',
    icon: <Atom className="w-7 h-7 text-[#C5A03F]" />,
    color: '#C5A03F',
  },
  {
    nome: 'TQA — Terapia Quântica Atlante',
    desc: 'Terapia ancestral que acessa memórias profundas e harmoniza o campo energético.',
    icon: <Sparkles className="w-7 h-7 text-[#0090FF]" />,
    color: '#0090FF',
  },
  {
    nome: 'EFT',
    desc: 'Técnica de liberação emocional que remove bloqueios e reduz ansiedade e estresse.',
    icon: <Waves className="w-7 h-7 text-[#7B61FF]" />,
    color: '#7B61FF',
  },
  {
    nome: 'Terapia Multidimensional',
    desc: 'Atua em múltiplos níveis do ser para promover equilíbrio físico, emocional, mental e espiritual.',
    icon: <Atom className="w-7 h-7 text-[#C5A03F]" />,
    color: '#C5A03F',
  },
  {
    nome: 'Mesa Arcturiana',
    desc: 'Ferramenta de alta frequência que conecta com energias dos Arcturianos para alinhamento e expansão da consciência.',
    icon: <Brain className="w-7 h-7 text-[#C5A03F]" />,
    color: '#C5A03F',
  },
  {
    nome: 'Mesa Metatrônica',
    desc: 'Tecnologia energética que restaura o equilíbrio dos corpos sutis e identifica padrões energéticos.',
    icon: <Compass className="w-7 h-7 text-[#0090FF]" />,
    color: '#0090FF',
  },
  {
    nome: 'Meditação',
    desc: 'Práticas que acalmam a mente, equilibram as emoções e fortalecem o autoconhecimento.',
    icon: <Flower2 className="w-7 h-7 text-[#7B61FF]" />,
    color: '#7B61FF',
  },
  {
    nome: 'Constelação Familiar',
    desc: 'Técnica que revela dinâmicas familiares inconscientes e promove cura nas relações e padrões do sistema.',
    icon: <Users className="w-7 h-7 text-[#0090FF]" />,
    color: '#0090FF',
  },
]

// ─── Social Header ──────────────────────────────────────────────────────────
const SocialIcons = () => (
  <div className="flex items-center gap-4">
    <a
      href="https://www.youtube.com/@ealumina4444"
      target="_blank"
      rel="noopener noreferrer"
      className="text-white hover:text-white/70 transition-colors group"
    >
      <Youtube className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
    </a>
    <a
      href="https://www.instagram.com/ealumina4444?utm_source=qr&igsh=MTJncnppN256cmpnaQ%3D%3D"
      target="_blank"
      rel="noopener noreferrer"
      className="text-white hover:text-white/70 transition-colors group"
    >
      <Instagram className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
    </a>
  </div>
)

// ─── Logo small (canto superior direito das sub-seções) ─────────────────────
const LogoSmall = () => (
  <div className="hidden md:block absolute top-4 right-8 z-30">
    <img
      src="/logo-dark.jpg"
      alt="EA Lumina"
      className="w-[100px] h-[100px] object-contain"
      style={{
        WebkitMaskImage: 'radial-gradient(circle at center, black 50%, transparent 75%)',
        maskImage: 'radial-gradient(circle at center, black 50%, transparent 75%)',
      }}
    />
  </div>
)

// ─── Botão Voltar ────────────────────────────────────────────────────────────
const BackButton = ({ label = 'Voltar', onClick }: { label?: string; onClick: () => void }) => (
  <div className="w-full px-5 md:px-10 pt-5 md:pt-0 md:absolute md:top-8 md:left-8 md:w-auto z-40">
    <button
      onClick={onClick}
      className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white flex items-center gap-2 transition-colors"
    >
      <ChevronLeft size={14} /> {label}
    </button>
  </div>
)

// ─── Estrela decorativa ──────────────────────────────────────────────────────
const DecoStar = () => (
  <div className="absolute bottom-10 right-8 w-8 h-8 md:w-12 md:h-12 opacity-60 animate-twinkle pointer-events-none z-10">
    <StarIcon className="w-full h-full" />
  </div>
)

// ════════════════════════════════════════════════════════════════════════════
export default function LandingPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Scroll suave: sempre horizontal para todas as seções
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    const container = scrollContainerRef.current
    if (element && container) {
      container.scrollTo({
        left: element.offsetLeft,
        top: 0,
        behavior: 'smooth',
      })
    }
  }

  // Wheel → scroll horizontal (desktop apenas)
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      if (window.innerWidth < 768) return
      if (e.deltaY !== 0 && e.deltaX === 0) {
        e.preventDefault()
        container.scrollBy({
          left: e.deltaY > 0 ? window.innerWidth : -window.innerWidth,
          behavior: 'smooth',
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

      {/* ════════════════════════════════════════════════════════════════
          TELA 1: HOME
      ════════════════════════════════════════════════════════════════ */}
      <section
        id="home"
        className="w-full min-w-full h-[100dvh] snap-center relative flex flex-col bg-[#010814] overflow-y-auto shrink-0"
      >
        {/* Imagem de herói (fundo) */}
        <div className="absolute inset-0 z-0">
          <img
            src="/img/portal-cosmic-bg.jpg"
            alt="Portal Cósmico"
            aria-hidden="true"
            className="w-full h-full object-cover object-center filter brightness-110 contrast-105"
          />
          {/* Overlay gradiente suave para leitura do texto */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#010814]/90 via-[#010814]/40 to-[#010814]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#010814]/90 via-transparent to-[#010814]/30" />
        </div>

        {/* Header Mobile */}
        <div className="flex md:hidden w-full items-center justify-between px-5 pt-5 pb-2 z-30 shrink-0 relative">
          <SocialIcons />
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
              Entrar
            </Link>
            <Link href="/register">
              <button className="bg-[#C5A03F] text-black px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#d6af4b] transition-all">
                Criar conta
              </button>
            </Link>
          </div>
        </div>

        {/* Header Desktop */}
        <div className="hidden md:flex absolute top-8 left-8 items-center gap-4 z-30">
          <SocialIcons />
        </div>
        <div className="hidden md:flex absolute top-6 right-8 items-center gap-4 z-30">
          <Link href="/login" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors px-2">
            Entrar
          </Link>
          <Link href="/register">
            <button className="bg-[#C5A03F] text-black px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#d6af4b] transition-all shadow-[0_0_20px_rgba(197,160,63,0.3)]">
              Criar conta
            </button>
          </Link>
        </div>

        {/* Conteúdo principal */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center md:justify-between px-6 pt-4 pb-12 md:p-12 lg:p-20 gap-8 md:gap-4 md:h-full shrink-0">

          {/* ESQUERDA: Logo + Título + Subtítulo */}
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start gap-4 md:gap-6">
            {/* Logo */}
            <div className="w-[130px] h-[130px] md:w-[160px] md:h-[160px] shrink-0">
              <img
                src="/logo-dark.jpg"
                alt="EA Lumina"
                className="w-full h-full object-contain"
                style={{
                  WebkitMaskImage: 'radial-gradient(circle at center, black 55%, transparent 80%)',
                  maskImage: 'radial-gradient(circle at center, black 55%, transparent 80%)',
                }}
              />
            </div>

            {/* Marca textual */}
            <p className="text-2xl md:text-3xl font-black tracking-[0.15em] text-white uppercase -mt-4">
              EALUMINA
            </p>

            {/* Título */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight text-center md:text-left max-w-[520px]">
              <span className="text-white">Conectar </span>
              <span className="text-white">quem busca </span>
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(90deg, #C5A03F 0%, #e8d08a 100%)' }}
              >
                transformar
              </span>
              <br />
              <span className="text-white">sua vida </span>
              <span className="text-white">com quem já </span>
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(90deg, #0090FF 0%, #55c0ff 100%)' }}
              >
                percorreu
              </span>
              <br />
              <span className="text-white">esse caminho.</span>
            </h1>

            {/* Subtítulo */}
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-[440px] text-center md:text-left">
              A EALUMINA é o encontro entre quem precisa e quem já transformou.
              Um ecossistema de terapias, conhecimento e propósito para uma vida
              mais equilibrada, consciente e com sentido.
            </p>
          </div>

          {/* DIREITA: Painel de seleção */}
          <div className="w-full md:w-auto flex flex-col items-center md:items-end">
            <div className="flex flex-col gap-3 w-full max-w-[360px]">
              <h3 className="text-slate-400 font-bold uppercase tracking-[0.22em] text-[10px] md:text-[11px] mb-1 text-center md:text-left">
                Qual é o seu objetivo hoje?
              </h3>

              {[
                { id: 'pacientes',   label: 'Sou Paciente',   icon: <Heart className="w-4 h-4 md:w-5 md:h-5 text-[#4A9EFF]" /> },
                { id: 'terapeutas', label: 'Sou Terapeuta',  icon: <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-[#4A9EFF]" /> },
                { id: 'empresas',   label: 'Para Empresas',  icon: <Brain className="w-4 h-4 md:w-5 md:h-5 text-[#4A9EFF]" /> },
                { id: 'cursos',     label: 'Ver Cursos',     icon: <Compass className="w-4 h-4 md:w-5 md:h-5 text-[#4A9EFF]" /> },
              ].map((box) => (
                <button
                  key={box.id}
                  onClick={() => scrollToSection(box.id)}
                  className="group flex items-center justify-between px-5 py-4 md:py-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all shadow-lg hover:shadow-2xl hover:-translate-y-0.5 backdrop-blur-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="group-hover:scale-110 transition-transform duration-300">
                      {box.icon}
                    </div>
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.22em] text-white">
                      {box.label}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#4A9EFF] transition-colors group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Estrela decorativa */}
        <DecoStar />
      </section>


      {/* ════════════════════════════════════════════════════════════════
          TELA 2: PACIENTES
      ════════════════════════════════════════════════════════════════ */}
      <section
        id="pacientes"
        className="w-full min-w-full h-[100dvh] snap-center flex flex-col relative overflow-y-auto shrink-0"
        style={{ background: 'radial-gradient(ellipse at 30% 40%, #12203a 0%, #050d1a 60%, #010409 100%)' }}
      >
        {/* Logo canto superior direito */}
        <LogoSmall />

        {/* Botão Voltar */}
        <BackButton onClick={() => scrollToSection('home')} label="Voltar" />

        <div className="max-w-[1300px] mx-auto px-5 md:px-10 w-full flex flex-col pb-10 md:justify-center md:h-full mt-2 md:mt-0 shrink-0">

          {/* Herói: Esquerda = texto | Direita = imagem */}
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 mb-8 md:mb-10">
            {/* Esquerda */}
            <div className="w-full md:w-1/2 flex flex-col items-start text-left mt-6 md:mt-0">
              <p className="text-[10px] md:text-xs font-black text-[#C5A03F] uppercase tracking-[0.3em] mb-3">
                Para Pacientes
              </p>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight mb-4 text-white">
                Toda transformação<br />começa{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(90deg, #C5A03F 0%, #e8d08a 100%)' }}
                >
                  dentro.
                </span>
              </h2>
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed mb-2 max-w-[420px]">
                Encontre terapeutas preparados para ajudar você a compreender e transformar a origem emocional do seu sofrimento.
              </p>
              <p className="text-slate-400 text-[11px] md:text-xs leading-relaxed max-w-[420px]">
                Conectamos pessoas que buscam compreender sua dor com terapeutas preparados para caminhar ao seu lado.
              </p>
            </div>

            {/* Direita: Imagem */}
            <div className="w-full md:w-1/2 h-[220px] md:h-[280px] rounded-3xl overflow-hidden relative shrink-0">
              <img
                src="/img/hero-paciente.png"
                alt="Meditação em grupo"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#050d1a]/40" />
            </div>
          </div>

          {/* Grid de 8 terapias */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
            {TERAPIAS.map((t, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center bg-white/[0.04] border border-white/10 rounded-2xl p-4 md:p-5 hover:bg-white/[0.07] hover:border-white/20 transition-all group"
              >
                <div
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                  style={{ background: `radial-gradient(circle, ${t.color}22 0%, ${t.color}08 100%)`, border: `1px solid ${t.color}33` }}
                >
                  {t.icon}
                </div>
                <h4 className="text-[10px] md:text-xs font-black uppercase tracking-wider text-white mb-1.5 leading-tight">
                  {t.nome}
                </h4>
                <p className="text-[9px] md:text-[10px] text-slate-400 leading-relaxed line-clamp-3">
                  {t.desc}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <Link href="/register?role=PACIENTE">
              <button className="bg-[#C5A03F] text-black px-8 py-3.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-[#d6af4b] transition-all hover:scale-105 shadow-[0_0_20px_rgba(197,160,63,0.3)] inline-flex items-center gap-2">
                Conheça Mais <ArrowRight size={13} />
              </button>
            </Link>
            <p className="text-[10px] text-slate-500">Saiba mais sobre cada terapia e como pode te ajudar.</p>
            <div className="glow-line w-40" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#C5A03F] opacity-80" />
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════════════════════════
          TELA 3: TERAPEUTAS
      ════════════════════════════════════════════════════════════════ */}
      <section
        id="terapeutas"
        className="w-full min-w-full h-[100dvh] snap-center flex flex-col relative overflow-y-auto shrink-0"
        style={{ background: 'radial-gradient(ellipse at 70% 30%, #12203a 0%, #050d1a 60%, #010409 100%)' }}
      >
        {/* Social topo esquerdo */}
        <div className="absolute top-8 left-8 z-30 hidden md:flex">
          <SocialIcons />
        </div>
        {/* Mobile social */}
        <div className="flex md:hidden w-full px-5 pt-5 pb-2 shrink-0">
          <SocialIcons />
        </div>

        <div className="max-w-[1300px] mx-auto px-5 md:px-10 w-full flex flex-col pb-10 md:justify-center md:h-full mt-2 md:mt-0 shrink-0">

          {/* Herói: Esquerda = texto | Direita = imagem */}
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 mb-8 md:mb-10 mt-6 md:mt-0">
            {/* Esquerda */}
            <div className="w-full md:w-1/2 flex flex-col items-start text-left">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight mb-4 text-white">
                Você nasceu para{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(90deg, #C5A03F 0%, #e8d08a 50%, #0090FF 100%)' }}
                >
                  cuidar de pessoas.
                </span>
              </h2>
              <p className="text-white text-sm md:text-base font-semibold mb-3">
                Nós ajudamos o mundo a encontrar você.
              </p>
              <p className="text-slate-400 text-[11px] md:text-sm leading-relaxed max-w-[440px]">
                Muitos terapeutas possuem conhecimento extraordinário, mas permanecem invisíveis.
                Na EALUMINA você faz parte de uma comunidade que cresce unida, compartilha propósito
                e utiliza tecnologia para ampliar seu alcance sem perder sua essência.
              </p>
            </div>

            {/* Direita: Imagem */}
            <div className="w-full md:w-1/2 h-[220px] md:h-[280px] rounded-3xl overflow-hidden relative shrink-0">
              <img
                src="/img/hero-terapeuta.png"
                alt="Comunidade de terapeutas"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#050d1a]/40" />
            </div>
          </div>

          {/* Card "Você não está sozinho" */}
          <div className="relative border border-white/10 rounded-2xl p-6 md:p-8 bg-white/[0.03] backdrop-blur-sm mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="max-w-[520px]">
              <h3 className="text-xl md:text-3xl font-black text-white mb-2">
                Você não está{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(90deg, #C5A03F 0%, #e8d08a 100%)' }}
                >
                  sozinho.
                </span>
              </h3>
              <p className="text-slate-400 text-[11px] md:text-sm leading-relaxed">
                Na EALUMINA acreditamos que terapeutas unidos criam uma força maior do que qualquer competição.
                Quando uma comunidade cresce em propósito, todos crescem juntos.
              </p>
            </div>
            {/* Texto cursivo decorativo */}
            <div className="shrink-0 text-right">
              <p className="font-cursive text-[#C5A03F] text-xl md:text-2xl leading-tight italic">
                Juntos somos<br />mais fortes
              </p>
            </div>
          </div>

          {/* CTA + rodapé */}
          <div className="flex flex-col items-center gap-4 shrink-0">
            <Link href="/register?role=TERAPEUTA">
              <button className="bg-[#C5A03F] text-black px-8 py-3.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-[#d6af4b] transition-all hover:scale-105 shadow-[0_0_20px_rgba(197,160,63,0.3)] inline-flex items-center gap-2">
                Conheça Nossa Missão <ArrowRight size={13} />
              </button>
            </Link>

            <div className="flex items-center gap-3 w-full max-w-[440px]">
              <div className="glow-line flex-1" />
              <p className="text-[10px] text-slate-500 text-center whitespace-nowrap">
                Uma comunidade. Um propósito. Um mundo mais leve.
              </p>
              <div className="glow-line flex-1" />
            </div>

            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C5A03F] opacity-80" />
            </div>

            <p className="text-lg md:text-2xl font-black tracking-[0.18em] text-white uppercase opacity-60">
              EALUMINA
            </p>
          </div>
        </div>

        <DecoStar />
      </section>


      {/* ════════════════════════════════════════════════════════════════
          TELA 4: EMPRESAS
      ════════════════════════════════════════════════════════════════ */}
      <section
        id="empresas"
        className="w-full min-w-full h-[100dvh] snap-center flex flex-col relative overflow-y-auto shrink-0"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, #0d1a2e 0%, #050d1a 60%, #010409 100%)' }}
      >
        {/* Social topo esquerdo */}
        <div className="absolute top-8 left-8 z-30 hidden md:flex">
          <SocialIcons />
        </div>
        {/* Mobile social */}
        <div className="flex md:hidden w-full px-5 pt-5 pb-2 shrink-0">
          <SocialIcons />
        </div>

        {/* Logo canto superior direito */}
        <LogoSmall />

        <div className="max-w-[1300px] mx-auto px-5 md:px-10 w-full flex flex-col pb-10 md:justify-center md:h-full mt-2 md:mt-0 shrink-0">

          {/* Herói: Esquerda = texto | Direita = imagem */}
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 mb-8 md:mb-10 mt-6 md:mt-0">
            {/* Esquerda */}
            <div className="w-full md:w-1/2 flex flex-col items-start text-left">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-5 text-white">
                Empresas{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(90deg, #C5A03F 0%, #e8d08a 100%)' }}
                >
                  saudáveis
                </span>
                <br />
                começam por{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(90deg, #0090FF 0%, #55c0ff 100%)' }}
                >
                  pessoas
                </span>
                <br />
                emocionalmente{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(90deg, #0090FF 0%, #55c0ff 100%)' }}
                >
                  saudáveis.
                </span>
              </h2>
              <p className="text-slate-300 text-[11px] md:text-sm leading-relaxed mb-3 max-w-[420px]">
                Equipes emocionalmente equilibradas comunicam melhor, cooperam mais e desenvolvem ambientes de trabalho mais produtivos.
              </p>
              <p className="text-slate-400 text-[11px] md:text-xs leading-relaxed max-w-[420px]">
                A EALUMINA conecta sua empresa a profissionais especializados em programas de bem-estar emocional, desenvolvimento humano e fortalecimento da cultura organizacional.
              </p>
            </div>

            {/* Direita: Imagem */}
            <div className="w-full md:w-1/2 h-[220px] md:h-[300px] rounded-3xl overflow-hidden relative shrink-0">
              <img
                src="/img/hero-empresas.png"
                alt="Equipe corporativa"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#050d1a]/30" />
            </div>
          </div>

          {/* Card motivacional */}
          <div className="border border-white/10 rounded-2xl p-6 md:p-10 bg-white/[0.03] backdrop-blur-sm mb-6 text-center relative">
            <h3 className="text-xl md:text-3xl font-black text-white mb-2">
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(90deg, #C5A03F 0%, #e8d08a 100%)' }}
              >
                Grandes mudanças
              </span>{' '}
              começam
              <br className="hidden md:block" /> por uma decisão correta.
            </h3>
            <p className="text-slate-400 text-[11px] md:text-sm leading-relaxed mb-1">
              Na harmonia e na paz, a vida floresce.
            </p>
            <p className="text-slate-400 text-[11px] md:text-sm leading-relaxed mb-5">
              Viva mais leve. Viva mais feliz.
            </p>
            <p className="font-cursive text-[#C5A03F] text-lg md:text-xl italic mb-5">
              Vive a felicidade. Vive a alegria.
            </p>
            <div className="glow-line w-48 mx-auto" />
            <div className="flex justify-center mt-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C5A03F] opacity-80" />
            </div>

            {/* Estrela decorativa interna */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 opacity-30 animate-twinkle">
              <StarIcon className="w-full h-full" />
            </div>
          </div>

          {/* CTA */}
          <div className="flex justify-center shrink-0">
            <button className="bg-transparent border border-[#C5A03F]/60 text-[#C5A03F] px-8 py-3 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-[#C5A03F]/10 transition-all hover:scale-105 inline-flex items-center gap-2">
              Falar com Consultor <ArrowRight size={13} />
            </button>
          </div>
        </div>

        <DecoStar />
      </section>


      {/* ════════════════════════════════════════════════════════════════
          TELA 5: CURSOS
      ════════════════════════════════════════════════════════════════ */}
      <section
        id="cursos"
        className="w-full min-w-full h-[100dvh] snap-center relative flex flex-col overflow-y-auto shrink-0"
      >
        {/* Imagem de herói full-background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/img/hero-cursos.png"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#010814]/90 via-[#010814]/60 to-[#010814]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#010814]/70 via-transparent to-[#010814]/30" />
        </div>

        {/* Social + Logo topo esquerdo */}
        <div className="relative z-30 flex items-center gap-4 px-5 md:px-10 pt-6 md:pt-8 shrink-0">
          <SocialIcons />
          <div className="ml-2">
            <img
              src="/logo-dark.jpg"
              alt="EA Lumina"
              className="w-10 h-10 md:w-12 md:h-12 object-contain"
              style={{
                WebkitMaskImage: 'radial-gradient(circle at center, black 55%, transparent 80%)',
                maskImage: 'radial-gradient(circle at center, black 55%, transparent 80%)',
              }}
            />
          </div>
        </div>

        {/* Conteúdo esquerdo */}
        <div className="relative z-10 flex flex-col justify-center h-full px-6 md:px-16 lg:px-20 pb-16 md:pb-0">
          <div className="max-w-[520px]">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-4 text-white">
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(90deg, #C5A03F 0%, #e8d08a 100%)' }}
              >
                Educação
              </span>{' '}
              para
              <br />
              transformar{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(90deg, #0090FF 0%, #55c0ff 100%)' }}
              >
                vidas.
              </span>
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
              Conhecimento que expande.<br />
              Comunidade que compartilha.
            </p>
            <button className="bg-[#C5A03F] text-black px-8 py-3.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-[#d6af4b] transition-all hover:scale-105 shadow-[0_0_20px_rgba(197,160,63,0.3)] inline-flex items-center gap-2">
              Conheça Nossos Benefícios
            </button>
          </div>
        </div>

        {/* Estrela decorativa */}
        <DecoStar />

        <Footer />
      </section>

    </div>
  )
}
