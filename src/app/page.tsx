'use client'

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, Sparkles, Brain, Heart, Zap, Compass, Wind, Moon, Sun } from 'lucide-react'

// --- DADOS DAS TERAPIAS (Pacientes) ---
const TERAPIAS = [
  {
    nome: "ThetaHealing",
    desc: "Identifique e transforme crenças limitantes no nível subconsciente para criar uma realidade mais leve e abundante.",
    icon: <Sparkles className="text-[#C5A03F] w-6 h-6" />
  },
  {
    nome: "TQA — Terapia Quântica",
    desc: "Reequilíbrio vibracional profundo, atuando nos campos sutis para restaurar a harmonia física e emocional.",
    icon: <Zap className="text-[#0090FF] w-6 h-6" />
  },
  {
    nome: "Terapia Multidimensional",
    desc: "Cura através do coração, trabalhando com seres de luz para limpar energias estagnadas de vidas passadas e do presente.",
    icon: <Heart className="text-[#C5A03F] w-6 h-6" />
  },
  {
    nome: "Mesa Metrônica MAQ",
    desc: "Ferramenta quântica de realinhamento energético que harmoniza todas as áreas da vida com geometrias sagradas.",
    icon: <Compass className="text-[#0090FF] w-6 h-6" />
  },
  {
    nome: "Constelação Familiar",
    desc: "Libere emaranhamentos sistêmicos e padrões familiares repetitivos, trazendo paz e fluxo para sua ancestralidade.",
    icon: <Brain className="text-[#C5A03F] w-6 h-6" />
  },
  {
    nome: "Meditação",
    desc: "Práticas guiadas para acalmar a mente, reduzir a ansiedade e reconectar-se com a sua essência interior.",
    icon: <Moon className="text-[#0090FF] w-6 h-6" />
  },
  {
    nome: "Mesa Arcturiana Multidimensional",
    desc: "Sistema de cura baseado na tecnologia de luz arcturiana, focado na elevação de frequência e limpeza espiritual.",
    icon: <Sun className="text-[#C5A03F] w-6 h-6" />
  },
  {
    nome: "EMF Balancing Technique",
    desc: "Harmonização da malha de calibração universal. Fortaleça sua energia e alinhe-se com seu propósito mais elevado.",
    icon: <Wind className="text-[#0090FF] w-6 h-6" />
  }
]

export default function LandingPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Função para scroll suave horizontal
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    const container = scrollContainerRef.current
    if (element && container) {
      container.scrollTo({
        left: element.offsetLeft,
        behavior: 'smooth'
      })
    }
  }

  // Prevenir scroll vertical e transformar em horizontal usando wheel event
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      // Se não houver scroll horizontal rolando nativamente (ex: touchpad horizontal), converte o vertical para horizontal
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
    // Container Principal: Scroll Horizontal e Snap
    <div 
      ref={scrollContainerRef}
      className="flex w-full h-screen overflow-x-auto overflow-y-hidden snap-x snap-mandatory bg-[#010409] text-slate-100 font-sans hide-scrollbar"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      
      {/* ──────────────────────────────────────────────────────────
          TELA 1: HOME (LOGO + BOXES)
      ────────────────────────────────────────────────────────── */}
      <section id="home" className="min-w-full h-full snap-center flex flex-col items-center justify-center p-6 relative bg-[radial-gradient(circle_at_center,_#020c16_0%,_#010810_50%,_#010409_100%)]">
        
        {/* HEADER DE AUTENTICAÇÃO */}
        <div className="absolute top-6 right-6 md:top-10 md:right-10 flex items-center gap-4 z-20">
          <Link href="/login" className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors px-2">
            Entrar
          </Link>
          <Link href="/register">
            <button className="bg-white/5 hover:bg-white/15 backdrop-blur-md border border-white/10 text-white px-5 py-2.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all">
              Criar conta
            </button>
          </Link>
        </div>

        {/* LOGO AREA E TEXTOS */}
        <div className="animate-in fade-in zoom-in duration-1000 flex flex-col items-center mt-12 md:mt-0">
          <div className="relative w-[280px] md:w-[400px] h-[280px] md:h-[400px] mb-2">
            <img 
              src="/logo-dark.jpg" 
              alt="EA Lumina" 
              className="w-full h-full object-contain mix-blend-screen"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<div class="text-xs text-slate-500 font-light tracking-widest text-center h-full flex flex-col justify-center border border-dashed border-slate-800 rounded-3xl p-6">[ LOGOTIPO ]<br/>Salve a imagem anexa como<br/>"logo-dark.jpg" na pasta "public"</div>';
              }}
            />
          </div>
          
          <div className="text-center max-w-2xl px-4 mt-2 mb-10 md:mb-14">
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white mb-4">
              Conectando você ao Equilíbrio e Luz.
            </h1>
            <p className="text-[11px] md:text-sm text-slate-400 leading-relaxed font-medium">
              O ecossistema premium de terapias integrativas. Escolha como deseja iniciar sua transformação profunda e encontre a paz que você busca.
            </p>
          </div>
        </div>

        {/* 4 BOXES CLICÁVEIS (MODERNOS E CLEAN) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 max-w-4xl w-full animate-in slide-in-from-bottom-8 duration-1000 z-10 pb-8">
          {[
            { id: 'pacientes', label: 'Pacientes', icon: <Heart size={20} className="mb-3 text-white" /> },
            { id: 'terapeutas', label: 'Terapeutas', icon: <Sparkles size={20} className="mb-3 text-white" /> },
            { id: 'empresas', label: 'Empresas', icon: <Brain size={20} className="mb-3 text-white" /> },
            { id: 'cursos', label: 'Cursos', icon: <Compass size={20} className="mb-3 text-white" /> }
          ].map((box) => (
            <button
              key={box.id}
              onClick={() => scrollToSection(box.id)}
              className="group flex flex-col items-center justify-center h-28 md:h-32 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 backdrop-blur-xl transition-all"
            >
              <div className="opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                {box.icon}
              </div>
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-white transition-colors mt-1">
                {box.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          TELA 2: PACIENTES
      ────────────────────────────────────────────────────────── */}
      <section id="pacientes" className="min-w-full h-full snap-center bg-[radial-gradient(circle_at_center,_#020c16_0%,_#010810_50%,_#010409_100%)] relative overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 min-h-full flex flex-col justify-center">
          
          <button onClick={() => scrollToSection('home')} className="absolute top-8 left-6 md:left-10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white flex items-center gap-2">
            <ChevronLeft size={16} /> Voltar
          </button>
          
          <div className="mb-12 mt-8 md:mt-0">
            <h5 className="text-[10px] font-black text-[#0090FF] uppercase tracking-[0.3em] mb-4">Para Pacientes</h5>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white">Sua jornada de <br className="hidden md:block"/><span className="text-[#C5A03F]">Luz e Equilíbrio.</span></h2>
            <p className="mt-6 text-slate-400 max-w-2xl text-xs md:text-sm leading-relaxed">
              Descubra as terapias integrativas disponíveis no EA Lumina. Abordagens profundas que conectam corpo, mente e alma para a sua cura e expansão de consciência.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {TERAPIAS.map((terapia, i) => (
              <div key={i} className="bg-black/50 border border-slate-800 rounded-3xl p-6 hover:border-slate-600 transition-colors flex flex-col">
                <div className="mb-4 bg-slate-900 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                  {terapia.icon}
                </div>
                <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-3">{terapia.nome}</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{terapia.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center md:text-left">
            <Link href="/register?role=PACIENTE">
              <button className="bg-white text-black px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors">
                Começar agora
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          TELA 3: TERAPEUTAS
      ────────────────────────────────────────────────────────── */}
      <section id="terapeutas" className="min-w-full h-full snap-center bg-[radial-gradient(circle_at_center,_#020c16_0%,_#010810_50%,_#010409_100%)] relative flex items-center justify-center p-6">
        <button onClick={() => scrollToSection('home')} className="absolute top-8 left-6 md:left-10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white flex items-center gap-2 z-10">
          <ChevronLeft size={16} /> Início
        </button>

        <div className="max-w-3xl text-center">
          <h5 className="text-[10px] font-black text-[#C5A03F] uppercase tracking-[0.3em] mb-4">Para Terapeutas</h5>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6 md:mb-8">Expanda sua Luz.</h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-10 md:mb-12 px-4">
            Junte-se ao marketplace premium de terapias integrativas. Tenha acesso a ferramentas exclusivas de gestão de agenda, prontuários digitais e um perfil profissional desenhado para conectar você a pacientes que buscam transformação profunda.
          </p>
          <Link href="/register?role=TERAPEUTA">
            <button className="bg-[#C5A03F] text-black px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#d6af4b] transition-transform hover:scale-105 flex items-center gap-3 mx-auto">
              Quero Atender <ArrowRight size={14} />
            </button>
          </Link>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          TELA 4: EMPRESAS
      ────────────────────────────────────────────────────────── */}
      <section id="empresas" className="min-w-full h-full snap-center bg-[radial-gradient(circle_at_center,_#020c16_0%,_#010810_50%,_#010409_100%)] relative flex items-center justify-center p-6">
        <button onClick={() => scrollToSection('home')} className="absolute top-8 left-6 md:left-10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white flex items-center gap-2 z-10">
          <ChevronLeft size={16} /> Início
        </button>

        <div className="max-w-5xl grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="text-center md:text-left mt-12 md:mt-0">
            <h5 className="text-[10px] font-black text-[#0090FF] uppercase tracking-[0.3em] mb-4">Soluções Corporativas</h5>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-6">Bem-estar elevado.</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              Proporcione equilíbrio mental e emocional para sua equipe através de pacotes exclusivos de terapias integrativas. Profissionais focados, saudáveis e resilientes transformam completamente o ambiente de trabalho e os resultados da sua empresa.
            </p>
            <button className="border border-slate-700 text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors">
              Falar com Consultor
            </button>
          </div>
          <div className="hidden md:flex h-80 rounded-3xl border border-slate-800 bg-black/50 items-center justify-center p-12 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-tr from-[#0090FF]/10 to-transparent" />
             <div className="text-center relative z-10">
                <Wind className="w-12 h-12 text-[#0090FF] mx-auto mb-6 opacity-80" />
                <h4 className="text-xl font-black text-white uppercase tracking-widest">Corporativo</h4>
             </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          TELA 5: CURSOS
      ────────────────────────────────────────────────────────── */}
      <section id="cursos" className="min-w-full h-full snap-center bg-[radial-gradient(circle_at_center,_#020c16_0%,_#010810_50%,_#010409_100%)] relative flex items-center justify-center p-6">
        <button onClick={() => scrollToSection('home')} className="absolute top-8 left-6 md:left-10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white flex items-center gap-2 z-10">
          <ChevronLeft size={16} /> Início
        </button>

        <div className="max-w-3xl text-center">
          <h5 className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] mb-4">Educação e Evolução</h5>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6 md:mb-8">Jornada de <br className="hidden md:block"/>Aprendizado.</h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-10 md:mb-12 px-4">
            Aprofunde seus conhecimentos e expanda sua consciência. Cursos ministrados por especialistas renomados em terapias integrativas, pensados para o seu desenvolvimento pessoal e certificação profissional.
          </p>
          <button className="bg-white text-black px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-transform hover:scale-105 flex items-center gap-3 mx-auto">
            Explorar Catálogo <ArrowRight size={14} />
          </button>
        </div>
      </section>

    </div>
  )
}
