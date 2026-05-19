'use client'

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, Sparkles, Brain, Heart, Zap, Compass, Wind, Moon, Sun } from 'lucide-react'

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
      <section id="home" className="min-w-full h-full snap-center flex flex-col items-center justify-center relative bg-[radial-gradient(circle_at_center,_#020c16_0%,_#010810_50%,_#010409_100%)] overflow-hidden">
        
        {/* HEADER DE AUTENTICAÇÃO */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8 flex items-center gap-3 md:gap-4 z-30">
          <Link href="/login" className="text-[10px] md:text-xs lg:text-sm font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors px-2">
            Entrar
          </Link>
          <Link href="/register">
            <button className="bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-white px-4 py-2 md:px-5 md:py-2.5 rounded-full text-[10px] md:text-xs lg:text-sm font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 backdrop-blur-md">
              Criar conta
            </button>
          </Link>
        </div>

        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between p-6 md:p-12 lg:p-20 relative z-10 h-full mt-10 md:mt-0">
          
          {/* LADO ESQUERDO: LOGO E TEXTO */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center h-1/2 md:h-full md:-mt-8">
            <div className="relative w-[260px] h-[260px] md:w-[55vh] md:h-[55vh] max-w-[600px] max-h-[600px] mb-0 md:mb-1">
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
            
            <div className="text-center max-w-[480px] px-2 md:px-0">
              <h1 
                className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tight mb-3 md:mb-5 leading-tight bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(90deg, rgba(196, 135, 35, 1) 11%, rgba(37, 102, 148, 1) 74%, rgba(29, 13, 255, 1) 100%, rgba(47, 18, 179, 1) 100%, rgba(34, 83, 135, 1) 100%)' }}
              >
                Conectando você ao <br className="hidden md:block" />Equilíbrio e Luz.
              </h1>
              <p className="text-[10px] md:text-sm lg:text-base text-slate-300 leading-relaxed font-medium md:max-w-[400px] mx-auto">
                O ecossistema premium de terapias integrativas. Escolha como deseja iniciar sua transformação profunda e encontre a paz que você busca.
              </p>
            </div>
          </div>

          {/* LADO DIREITO: BOXES */}
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-end justify-center h-1/2 md:h-full">
            <div className="flex flex-col gap-3 md:gap-5 w-full max-w-[380px] animate-in slide-in-from-right-8 duration-1000">
              <h3 className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[11px] md:text-[13px] mb-1 md:mb-2 text-center md:text-left pl-2 opacity-80">
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
                  className="group flex items-center justify-between px-6 py-4 md:py-6 rounded-2xl md:rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all shadow-lg hover:shadow-2xl hover:-translate-y-1 backdrop-blur-md"
                >
                  <div className="flex items-center gap-4 md:gap-5">
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
      <section id="pacientes" className="min-w-full h-full snap-center bg-[radial-gradient(circle_at_center,_#020c16_0%,_#010810_50%,_#010409_100%)] relative flex items-center justify-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 w-full flex flex-col justify-center h-full pt-8 pb-4">
          
          <button onClick={() => scrollToSection('home')} className="absolute top-4 left-4 md:top-8 md:left-8 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white flex items-center gap-2">
            <ChevronLeft size={14} /> Voltar
          </button>
          
          <div className="mb-4 md:mb-8 flex-shrink-0">
            <h5 className="text-[9px] md:text-[10px] font-black text-[#0090FF] uppercase tracking-[0.3em] mb-2 md:mb-3">Para Pacientes</h5>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tighter text-white">Sua jornada de <br className="hidden md:block"/><span className="text-[#C5A03F]">Luz e Equilíbrio.</span></h2>
            <p className="mt-2 md:mt-3 text-slate-400 max-w-2xl text-[10px] md:text-xs leading-relaxed hidden md:block">
              Descubra as terapias integrativas disponíveis no EA Lumina. Abordagens profundas que conectam corpo, mente e alma para a sua cura.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 flex-1 max-h-[60vh] md:max-h-none overflow-y-auto hide-scrollbar">
            {TERAPIAS.map((terapia, i) => (
              <div key={i} className="bg-black/50 border border-slate-800 rounded-2xl md:rounded-3xl p-3 md:p-5 hover:border-slate-600 transition-colors flex flex-col justify-start">
                <div className="mb-2 md:mb-3 bg-slate-900 w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center shrink-0 [&>svg]:w-4 [&>svg]:h-4 md:[&>svg]:w-5 md:[&>svg]:h-5">
                  {terapia.icon}
                </div>
                <h3 className="text-[9px] md:text-[11px] font-bold text-white uppercase tracking-widest mb-1.5 line-clamp-1">{terapia.nome}</h3>
                <p className="text-[9px] md:text-[10px] text-slate-400 leading-relaxed font-medium line-clamp-2 md:line-clamp-3">{terapia.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 md:mt-8 text-center md:text-left flex-shrink-0">
            <Link href="/register?role=PACIENTE">
              <button className="bg-white text-black px-6 py-2.5 md:px-8 md:py-3.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors">
                Começar agora
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          TELA 3: TERAPEUTAS
      ────────────────────────────────────────────────────────── */}
      <section id="terapeutas" className="min-w-full h-full snap-center bg-[radial-gradient(circle_at_center,_#020c16_0%,_#010810_50%,_#010409_100%)] relative flex items-center justify-center p-4 md:p-6 overflow-hidden">
        <button onClick={() => scrollToSection('home')} className="absolute top-4 left-4 md:top-8 md:left-8 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white flex items-center gap-2 z-10">
          <ChevronLeft size={14} /> Início
        </button>

        <div className="max-w-3xl text-center">
          <h5 className="text-[9px] md:text-[10px] font-black text-[#C5A03F] uppercase tracking-[0.3em] mb-3 md:mb-4">Para Terapeutas</h5>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white mb-4 md:mb-6">Expanda sua Luz.</h2>
          <p className="text-slate-400 text-[11px] md:text-sm leading-relaxed mb-8 md:mb-10 px-2 md:px-4">
            Junte-se ao marketplace premium de terapias integrativas. Tenha acesso a ferramentas exclusivas de gestão de agenda, prontuários digitais e um perfil profissional desenhado para conectar você a pacientes que buscam transformação profunda.
          </p>
          <Link href="/register?role=TERAPEUTA">
            <button className="bg-[#C5A03F] text-black px-8 py-3.5 md:px-10 md:py-4 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-[#d6af4b] transition-transform hover:scale-105 flex items-center gap-3 mx-auto">
              Quero Atender <ArrowRight size={14} />
            </button>
          </Link>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          TELA 4: EMPRESAS
      ────────────────────────────────────────────────────────── */}
      <section id="empresas" className="min-w-full h-full snap-center bg-[radial-gradient(circle_at_center,_#020c16_0%,_#010810_50%,_#010409_100%)] relative flex items-center justify-center p-4 md:p-6 overflow-hidden">
        <button onClick={() => scrollToSection('home')} className="absolute top-4 left-4 md:top-8 md:left-8 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white flex items-center gap-2 z-10">
          <ChevronLeft size={14} /> Início
        </button>

        <div className="max-w-5xl grid md:grid-cols-2 gap-6 md:gap-12 items-center">
          <div className="text-center md:text-left mt-8 md:mt-0 px-2 md:px-0">
            <h5 className="text-[9px] md:text-[10px] font-black text-[#0090FF] uppercase tracking-[0.3em] mb-3 md:mb-4">Soluções Corporativas</h5>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-white mb-4 md:mb-6">Bem-estar elevado.</h2>
            <p className="text-slate-400 text-[11px] md:text-xs leading-relaxed mb-6 md:mb-8">
              Proporcione equilíbrio mental e emocional para sua equipe através de pacotes exclusivos de terapias integrativas. Profissionais focados, saudáveis e resilientes transformam completamente o ambiente de trabalho e os resultados da sua empresa.
            </p>
            <button className="border border-slate-700 text-white px-6 py-3.5 md:px-8 md:py-4 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors">
              Falar com Consultor
            </button>
          </div>
          <div className="hidden md:flex h-48 lg:h-64 rounded-3xl border border-slate-800 bg-black/50 items-center justify-center p-8 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-tr from-[#0090FF]/10 to-transparent" />
             <div className="text-center relative z-10">
                <Wind className="w-10 h-10 lg:w-12 lg:h-12 text-[#0090FF] mx-auto mb-4 opacity-80" />
                <h4 className="text-lg lg:text-xl font-black text-white uppercase tracking-widest">Corporativo</h4>
             </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          TELA 5: CURSOS
      ────────────────────────────────────────────────────────── */}
      <section id="cursos" className="min-w-full h-full snap-center bg-[radial-gradient(circle_at_center,_#020c16_0%,_#010810_50%,_#010409_100%)] relative flex items-center justify-center p-4 md:p-6 overflow-hidden">
        <button onClick={() => scrollToSection('home')} className="absolute top-4 left-4 md:top-8 md:left-8 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white flex items-center gap-2 z-10">
          <ChevronLeft size={14} /> Início
        </button>

        <div className="max-w-3xl text-center">
          <h5 className="text-[9px] md:text-[10px] font-black text-white/50 uppercase tracking-[0.3em] mb-3 md:mb-4">Educação e Evolução</h5>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white mb-4 md:mb-6">Jornada de <br className="hidden md:block"/>Aprendizado.</h2>
          <p className="text-slate-400 text-[11px] md:text-sm leading-relaxed mb-8 md:mb-10 px-2 md:px-4">
            Aprofunde seus conhecimentos e expanda sua consciência. Cursos ministrados por especialistas renomados em terapias integrativas, pensados para o seu desenvolvimento pessoal e certificação profissional.
          </p>
          <button className="bg-white text-black px-8 py-3.5 md:px-10 md:py-4 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-transform hover:scale-105 flex items-center gap-3 mx-auto">
            Explorar Catálogo <ArrowRight size={14} />
          </button>
        </div>
      </section>

    </div>
  )
}
