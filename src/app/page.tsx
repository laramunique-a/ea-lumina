'use client'

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  ArrowRight, ChevronLeft, Youtube, Instagram,
  Heart, Sparkles, Brain, Compass,
  Atom, Waves, Users, Flower2,
} from 'lucide-react'
import { Footer } from '@/components/Footer'

// ─── Constantes de tipografia e estilo padronizados ─────────────────────────
const S = {
  // Títulos de seção (H1/H2 grandes)
  heading: 'text-3xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white text-center',
  // Subtítulo de destaque (tag de categoria acima do título)
  tag: 'text-[11px] md:text-xs font-black uppercase tracking-[0.3em] text-center mb-3',
  // Parágrafo descritivo padrão
  body: 'text-sm md:text-base text-slate-300 leading-relaxed text-center max-w-[560px] mx-auto',
  // Texto secundário/detalhe
  small: 'text-xs md:text-sm text-slate-400 leading-relaxed text-center max-w-[480px] mx-auto',
  // Card / box padronizado
  card: 'bg-white/[0.06] border border-white/10 backdrop-blur-sm rounded-2xl',
  // Overlay de fundo padrão (igual à home e cursos)
  overlayL: 'absolute inset-0 bg-gradient-to-r from-[#010814]/90 via-[#010814]/65 to-[#010814]/30',
  overlayT: 'absolute inset-0 bg-gradient-to-t from-[#010814]/80 via-transparent to-[#010814]/25',
  // Gradiente dourado
  gradGold: 'linear-gradient(90deg, #C5A03F 0%, #e8d08a 100%)',
  // Gradiente azul
  gradBlue: 'linear-gradient(90deg, #0090FF 0%, #55c0ff 100%)',
  // Botão principal dourado
  btnGold: 'inline-flex items-center gap-2 bg-[#C5A03F] text-black px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#d6af4b] transition-all hover:scale-105 shadow-[0_0_20px_rgba(197,160,63,0.3)]',
}

// ─── Ícone de Estrela Decorativa ────────────────────────────────────────────
const StarIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M30 0 L32.5 27.5 L60 30 L32.5 32.5 L30 60 L27.5 32.5 L0 30 L27.5 27.5 Z" fill="white" fillOpacity="0.85" />
  </svg>
)

// ─── Estrela decorativa ─────────────────────────────────────────────────────
const DecoStar = () => (
  <div className="absolute bottom-10 right-8 w-8 h-8 md:w-12 md:h-12 opacity-60 animate-twinkle pointer-events-none z-10">
    <StarIcon className="w-full h-full" />
  </div>
)

// ─── Background de herói padronizado ────────────────────────────────────────
const HeroBg = ({ src }: { src: string }) => (
  <div className="absolute inset-0 z-0">
    <img src={src} alt="" aria-hidden="true" className="w-full h-full object-cover object-center opacity-70" />
    <div className={S.overlayL} />
    <div className={S.overlayT} />
  </div>
)

// ─── Ícones sociais ──────────────────────────────────────────────────────────
const SocialIcons = () => (
  <div className="flex items-center gap-4">
    <a href="https://www.youtube.com/@ealumina4444" target="_blank" rel="noopener noreferrer"
      className="text-white hover:text-white/70 transition-colors group">
      <Youtube className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
    </a>
    <a href="https://www.instagram.com/ealumina4444?utm_source=qr&igsh=MTJncnppN256cmpnaQ%3D%3D"
      target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/70 transition-colors group">
      <Instagram className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
    </a>
  </div>
)

// ─── Logo pequeno (canto superior direito) ───────────────────────────────────
const LogoSmall = () => (
  <div className="hidden md:block absolute top-4 right-8 z-30">
    <img src="/logo-dark.jpg" alt="EA Lumina" className="w-[90px] h-[90px] object-contain"
      style={{ mixBlendMode: 'screen', filter: 'drop-shadow(0 0 10px rgba(197,160,63,0.5))' }}
    />
  </div>
)

// ─── Botão Voltar ────────────────────────────────────────────────────────────
const BackButton = ({ label = 'Voltar', onClick }: { label?: string; onClick: () => void }) => (
  <div className="w-full px-5 md:px-10 pt-5 md:pt-0 md:absolute md:top-8 md:left-8 md:w-auto z-40">
    <button onClick={onClick}
      className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
      <ChevronLeft size={14} /> {label}
    </button>
  </div>
)

// ─── Linha separadora brilhante ──────────────────────────────────────────────
const GlowDivider = () => (
  <div className="flex flex-col items-center gap-2">
    <div className="glow-line w-40" />
    <div className="w-1.5 h-1.5 rounded-full bg-[#C5A03F] opacity-80" />
  </div>
)

// ─── Dados das terapias ──────────────────────────────────────────────────────
const TERAPIAS = [
  { nome: 'ThetaHealing',             desc: 'Técnica quântica que atua na raiz das crenças limitantes e promove cura profunda no nível da alma.', icon: <Atom className="w-7 h-7 text-[#C5A03F]" />, color: '#C5A03F' },
  { nome: 'TQA — Terapia Quântica',   desc: 'Terapia ancestral que acessa memórias profundas e harmoniza o campo energético.',                      icon: <Sparkles className="w-7 h-7 text-[#0090FF]" />, color: '#0090FF' },
  { nome: 'EFT',                       desc: 'Técnica de liberação emocional que remove bloqueios e reduz ansiedade e estresse.',                    icon: <Waves className="w-7 h-7 text-[#7B61FF]" />, color: '#7B61FF' },
  { nome: 'Terapia Multidimensional',  desc: 'Atua em múltiplos níveis do ser para promover equilíbrio físico, emocional, mental e espiritual.',      icon: <Atom className="w-7 h-7 text-[#C5A03F]" />, color: '#C5A03F' },
  { nome: 'Mesa Arcturiana',           desc: 'Ferramenta de alta frequência que conecta com energias dos Arcturianos para alinhamento da consciência.', icon: <Brain className="w-7 h-7 text-[#C5A03F]" />, color: '#C5A03F' },
  { nome: 'Mesa Metatrônica',          desc: 'Tecnologia energética que restaura o equilíbrio dos corpos sutis e identifica padrões energéticos.',    icon: <Compass className="w-7 h-7 text-[#0090FF]" />, color: '#0090FF' },
  { nome: 'Meditação',                 desc: 'Práticas que acalmam a mente, equilibram as emoções e fortalecem o autoconhecimento.',                  icon: <Flower2 className="w-7 h-7 text-[#7B61FF]" />, color: '#7B61FF' },
  { nome: 'Constelação Familiar',      desc: 'Técnica que revela dinâmicas familiares inconscientes e promove cura nas relações e padrões do sistema.', icon: <Users className="w-7 h-7 text-[#0090FF]" />, color: '#0090FF' },
]

// ════════════════════════════════════════════════════════════════════════════
export default function LandingPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    const container = scrollContainerRef.current
    if (element && container) {
      container.scrollTo({ left: element.offsetLeft, top: 0, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return
    const handleWheel = (e: WheelEvent) => {
      if (window.innerWidth < 768) return
      if (e.deltaY !== 0 && e.deltaX === 0) {
        e.preventDefault()
        container.scrollBy({ left: e.deltaY > 0 ? window.innerWidth : -window.innerWidth, behavior: 'smooth' })
      }
    }
    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [])

  return (
    <div
      ref={scrollContainerRef}
      className="flex flex-row h-[100dvh] overflow-x-auto overflow-y-hidden snap-x snap-mandatory w-full bg-[#010409] text-slate-100 font-sans [&::-webkit-scrollbar]:hidden"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >

      {/* ════════════════════════════════════════════════════════════════
          TELA 1 — HOME
      ════════════════════════════════════════════════════════════════ */}
      <section
        id="home"
        className="w-full min-w-full h-[100dvh] snap-center relative flex flex-col bg-[#010814] overflow-y-auto shrink-0"
      >
        <HeroBg src="/img/hero-home.png" />

        {/* Header Mobile */}
        <div className="flex md:hidden w-full items-center justify-between px-5 pt-5 pb-2 z-30 shrink-0 relative">
          <SocialIcons />
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Entrar</Link>
            <Link href="/register">
              <button className={S.btnGold + ' px-4 py-2 text-[10px]'}>Criar conta</button>
            </Link>
          </div>
        </div>

        {/* Header Desktop */}
        <div className="hidden md:flex absolute top-8 left-8 items-center gap-4 z-30"><SocialIcons /></div>
        <div className="hidden md:flex absolute top-6 right-8 items-center gap-4 z-30">
          <Link href="/login" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors px-2">Entrar</Link>
          <Link href="/register">
            <button className={S.btnGold}>Criar conta</button>
          </Link>
        </div>

        {/* Conteúdo principal — centralizado */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center md:justify-between px-6 pt-4 pb-12 md:p-12 lg:p-20 gap-10 md:gap-8 md:h-full shrink-0">

          {/* ESQUERDA — Logo + Título + Subtítulo (centralizado) */}
          <div className="w-full md:w-1/2 flex flex-col items-center gap-3 md:gap-4">
            <div className="w-[260px] h-[260px] md:w-[380px] md:h-[380px] lg:w-[440px] lg:h-[440px] shrink-0 relative flex items-center justify-center -mb-4">
              <img src="/logo-dark.jpg" alt="EA Lumina" className="w-full h-full object-contain"
                style={{
                  mixBlendMode: 'screen',
                  filter: 'drop-shadow(0 0 40px rgba(197,160,63,0.75)) drop-shadow(0 0 15px rgba(255,215,0,0.5))',
                }}
              />
            </div>

            <h1 className={S.heading}>
              Conectar quem busca{' '}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: S.gradGold }}>transformar</span>
              <br />
              sua vida com quem já{' '}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: S.gradBlue }}>percorreu</span>
              <br />esse caminho.
            </h1>

            <p className={S.body}>
              A EALUMINA é o encontro entre quem precisa e quem já transformou.
              Um ecossistema de terapias, conhecimento e propósito para uma vida mais equilibrada, consciente e com sentido.
            </p>
          </div>

          {/* DIREITA — Painel de seleção */}
          <div className="w-full md:w-auto flex flex-col items-center">
            <div className="flex flex-col gap-3 w-full max-w-[360px]">
              <h3 className={S.tag + ' text-slate-400'}>Qual é o seu objetivo hoje?</h3>
              {[
                { id: 'pacientes',   label: 'Sou Paciente',  icon: <Heart className="w-5 h-5 text-[#4A9EFF]" /> },
                { id: 'terapeutas', label: 'Sou Terapeuta', icon: <Sparkles className="w-5 h-5 text-[#4A9EFF]" /> },
                { id: 'empresas',   label: 'Para Empresas', icon: <Brain className="w-5 h-5 text-[#4A9EFF]" /> },
                { id: 'cursos',     label: 'Ver Cursos',    icon: <Compass className="w-5 h-5 text-[#4A9EFF]" /> },
              ].map((box) => (
                <button key={box.id} onClick={() => scrollToSection(box.id)}
                  className={`${S.card} group flex items-center justify-between px-5 py-4 md:py-5 hover:bg-white/10 hover:border-white/20 transition-all shadow-lg hover:shadow-2xl hover:-translate-y-0.5`}>
                  <div className="flex items-center gap-4">
                    <div className="group-hover:scale-110 transition-transform duration-300">{box.icon}</div>
                    <span className="text-xs font-black uppercase tracking-[0.22em] text-white">{box.label}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#4A9EFF] transition-colors group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <DecoStar />
      </section>


      {/* ════════════════════════════════════════════════════════════════
          TELA 2 — PACIENTES
      ════════════════════════════════════════════════════════════════ */}
      <section
        id="pacientes"
        className="w-full min-w-full h-[100dvh] snap-center relative flex flex-col overflow-y-auto shrink-0 bg-[#010814]"
      >
        <HeroBg src="/img/hero-paciente.png" />
        <LogoSmall />
        <BackButton onClick={() => scrollToSection('home')} label="Voltar" />

        <div className="relative z-10 max-w-5xl mx-auto px-5 md:px-10 w-full flex flex-col items-center text-center pb-10 md:justify-center md:h-full mt-2 md:mt-0 shrink-0">

          {/* Tag + Título */}
          <p className={`${S.tag} text-[#C5A03F] mt-6 md:mt-0`}>Para Pacientes</p>
          <h2 className={`${S.heading} mb-4`}>
            Toda transformação começa{' '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: S.gradGold }}>dentro.</span>
          </h2>
          <p className={`${S.body} mb-2`}>
            Encontre terapeutas preparados para ajudar você a compreender e transformar a origem emocional do seu sofrimento.
          </p>
          <p className={`${S.small} mb-8`}>
            Conectamos pessoas que buscam compreender sua dor com terapeutas preparados para caminhar ao seu lado.
          </p>

          {/* Grid de 8 terapias */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 w-full">
            {TERAPIAS.map((t, i) => (
              <div key={i}
                className={`${S.card} flex flex-col items-center text-center p-4 md:p-5 hover:bg-white/[0.1] hover:border-white/20 transition-all group`}>
                <div
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                  style={{ background: `radial-gradient(circle, ${t.color}25 0%, ${t.color}08 100%)`, border: `1px solid ${t.color}40` }}>
                  {t.icon}
                </div>
                <h4 className="text-[10px] md:text-xs font-black uppercase tracking-wider text-white mb-1.5 leading-tight">{t.nome}</h4>
                <p className="text-[9px] md:text-[10px] text-slate-400 leading-relaxed line-clamp-3">{t.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-3">
            <Link href="/register?role=PACIENTE">
              <button className={S.btnGold}>Conheça Mais <ArrowRight size={13} /></button>
            </Link>
            <p className={S.small + ' max-w-none'}>Saiba mais sobre cada terapia e como pode te ajudar.</p>
            <GlowDivider />
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════════════════════════
          TELA 3 — TERAPEUTAS
      ════════════════════════════════════════════════════════════════ */}
      <section
        id="terapeutas"
        className="w-full min-w-full h-[100dvh] snap-center relative flex flex-col overflow-y-auto shrink-0 bg-[#010814]"
      >
        <HeroBg src="/img/hero-terapeuta.png" />

        {/* Social topo esquerdo */}
        <div className="absolute top-8 left-8 z-30 hidden md:flex"><SocialIcons /></div>
        <div className="flex md:hidden w-full px-5 pt-5 pb-2 shrink-0 relative z-30"><SocialIcons /></div>

        <div className="relative z-10 max-w-4xl mx-auto px-5 md:px-10 w-full flex flex-col items-center text-center pb-10 md:justify-center md:h-full mt-4 md:mt-0 shrink-0">

          {/* Título */}
          <h2 className={`${S.heading} mb-3`}>
            Você nasceu para{' '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: S.gradGold }}>cuidar</span>
            {' '}de pessoas.
          </h2>
          <p className="text-white text-sm md:text-base font-semibold mb-3 text-center">
            Nós ajudamos o mundo a encontrar você.
          </p>
          <p className={`${S.small} mb-8`}>
            Muitos terapeutas possuem conhecimento extraordinário, mas permanecem invisíveis.
            Na EALUMINA você faz parte de uma comunidade que cresce unida, compartilha propósito
            e utiliza tecnologia para ampliar seu alcance sem perder sua essência.
          </p>

          {/* Card "Você não está sozinho" */}
          <div className={`${S.card} w-full p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-4`}>
            <div className="text-center md:text-left max-w-[480px]">
              <h3 className="text-xl md:text-3xl font-black text-white mb-2">
                Você não está{' '}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: S.gradGold }}>sozinho.</span>
              </h3>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                Na EALUMINA acreditamos que terapeutas unidos criam uma força maior do que qualquer competição.
                Quando uma comunidade cresce em propósito, todos crescem juntos.
              </p>
            </div>
            <div className="shrink-0 text-center md:text-right">
              <p className="font-cursive text-[#C5A03F] text-xl md:text-2xl leading-tight italic">
                Juntos somos<br />mais fortes
              </p>
            </div>
          </div>

          {/* CTA + rodapé */}
          <div className="flex flex-col items-center gap-4">
            <Link href="/register?role=TERAPEUTA">
              <button className={S.btnGold}>Conheça Nossa Missão <ArrowRight size={13} /></button>
            </Link>
            <div className="flex items-center gap-3 w-full max-w-[420px]">
              <div className="glow-line flex-1" />
              <p className="text-[10px] text-slate-500 text-center whitespace-nowrap">
                Uma comunidade. Um propósito. Um mundo mais leve.
              </p>
              <div className="glow-line flex-1" />
            </div>
            <GlowDivider />
            <p className="text-lg md:text-2xl font-black tracking-[0.18em] text-white uppercase opacity-50">EALUMINA</p>
          </div>
        </div>

        <DecoStar />
      </section>


      {/* ════════════════════════════════════════════════════════════════
          TELA 4 — EMPRESAS
      ════════════════════════════════════════════════════════════════ */}
      <section
        id="empresas"
        className="w-full min-w-full h-[100dvh] snap-center relative flex flex-col overflow-y-auto shrink-0 bg-[#010814]"
      >
        <HeroBg src="/img/hero-empresas.png" />

        {/* Social topo esquerdo */}
        <div className="absolute top-8 left-8 z-30 hidden md:flex"><SocialIcons /></div>
        <div className="flex md:hidden w-full px-5 pt-5 pb-2 shrink-0 relative z-30"><SocialIcons /></div>
        <LogoSmall />

        <div className="relative z-10 max-w-4xl mx-auto px-5 md:px-10 w-full flex flex-col items-center text-center pb-10 md:justify-center md:h-full mt-4 md:mt-0 shrink-0">

          {/* Título */}
          <h2 className={`${S.heading} mb-4`}>
            Empresas{' '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: S.gradGold }}>saudáveis</span>
            {' '}começam por{' '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: S.gradBlue }}>pessoas</span>
            <br />emocionalmente{' '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: S.gradBlue }}>saudáveis.</span>
          </h2>

          <p className={`${S.body} mb-2`}>
            Equipes emocionalmente equilibradas comunicam melhor, cooperam mais e desenvolvem ambientes de trabalho mais produtivos.
          </p>
          <p className={`${S.small} mb-8`}>
            A EALUMINA conecta sua empresa a profissionais especializados em programas de bem-estar emocional, desenvolvimento humano e fortalecimento da cultura organizacional.
          </p>

          {/* Card motivacional */}
          <div className={`${S.card} w-full p-6 md:p-10 mb-6 text-center relative`}>
            <h3 className="text-xl md:text-3xl font-black text-white mb-3">
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: S.gradGold }}>Grandes mudanças</span>{' '}
              começam por uma decisão correta.
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-1">Na harmonia e na paz, a vida floresce.</p>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">Viva mais leve. Viva mais feliz.</p>
            <p className="font-cursive text-[#C5A03F] text-lg md:text-xl italic mb-5">Vive a felicidade. Vive a alegria.</p>
            <GlowDivider />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 opacity-25 animate-twinkle">
              <StarIcon className="w-full h-full" />
            </div>
          </div>

          {/* CTA */}
          <button className="inline-flex items-center gap-2 bg-transparent border border-[#C5A03F]/60 text-[#C5A03F] px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#C5A03F]/10 transition-all hover:scale-105">
            Falar com Consultor <ArrowRight size={13} />
          </button>
        </div>

        <DecoStar />
      </section>


      {/* ════════════════════════════════════════════════════════════════
          TELA 5 — CURSOS
      ════════════════════════════════════════════════════════════════ */}
      <section
        id="cursos"
        className="w-full min-w-full h-[100dvh] snap-center relative flex flex-col overflow-y-auto shrink-0 bg-[#010814]"
      >
        <HeroBg src="/img/hero-cursos.png" />

        {/* Social + Logo topo esquerdo */}
        <div className="relative z-30 flex items-center gap-4 px-5 md:px-10 pt-6 md:pt-8 shrink-0">
          <SocialIcons />
          <img src="/logo-dark.jpg" alt="EA Lumina" className="w-10 h-10 md:w-12 md:h-12 object-contain ml-2"
            style={{ mixBlendMode: 'screen', filter: 'drop-shadow(0 0 6px rgba(197,160,63,0.5))' }}
          />
        </div>

        {/* Conteúdo — centralizado */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-5 md:px-10 pb-16 md:pb-0 text-center">
          <div className="max-w-[560px] flex flex-col items-center gap-5">
            <h1 className={S.heading}>
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: S.gradGold }}>Educação</span>{' '}
              para transformar{' '}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: S.gradBlue }}>vidas.</span>
            </h1>
            <p className={S.body}>
              Conhecimento que expande.<br />
              Comunidade que compartilha.
            </p>
            <button className={S.btnGold}>Conheça Nossos Benefícios</button>
          </div>
        </div>

        <DecoStar />
        <Footer />
      </section>

    </div>
  )
}
