'use client'

import React from 'react'
import Link from 'next/link'
import { 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  Users, 
  Heart, 
  Brain, 
  Zap, 
  Compass, 
  ArrowRight,
  Sun,
  Moon,
  Wind
} from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-[#C5A03F]/20 font-sans">
      
      {/* ──────────────────────────────────────────────────────────
          NAVIGATION (COMPACT & SLEEK)
      ────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100/50 h-16">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Logo className="scale-75 origin-left" iconOnly />
            <span className="hidden sm:block text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 group-hover:text-[#0090FF] transition-colors">EA Lumina</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <Link href="#como-funciona" className="hover:text-slate-900 transition-colors">A Jornada</Link>
            <Link href="#especialidades" className="hover:text-slate-900 transition-colors">Universo</Link>
            <Link href="#para-quem" className="hover:text-slate-900 transition-colors">Vantagens</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[11px] font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 transition-colors px-4">
              Entrar
            </Link>
            <Link href="/register">
              <button className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-full hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                Começar
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ──────────────────────────────────────────────────────────
          HERO (IMPACTO E EQUILÍBRIO)
      ────────────────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-16 flex flex-col items-center text-center px-6">
        <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-white via-slate-50 to-white -z-10" />
        
        {/* Logo Monumental HD - Espaçamento ajustado (mb-2) */}
        <div className="animate-in fade-in zoom-in duration-1000 mb-2">
           <Logo iconOnly monumental />
        </div>

        <div className="max-w-4xl animate-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-8 text-slate-900">
            Sua jornada de <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5A03F] via-slate-900 to-[#0090FF]">Luz e Equilíbrio.</span>
          </h1>
          
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium tracking-tight">
            Descubra o EA Lumina: o ecossistema premium que conecta você aos melhores especialistas em terapias holísticas do Brasil. Um ambiente digital de paz, segurança e transformação profunda para corpo, mente e alma.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="xl" className="h-14 px-10 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-200">
                Agende sua Sessão
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link href="#como-funciona" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 p-4 transition-colors">
              Explorar a Jornada
            </Link>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          COMO FUNCIONA A JORNADA (DETALHADO)
      ────────────────────────────────────────────────────────── */}
      <section id="como-funciona" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h5 className="text-[10px] font-black text-[#0090FF] uppercase tracking-[0.3em] mb-4">O Caminho</h5>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900">Como a luz te encontra</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: <Compass className="text-[#C5A03F]" />, title: "Exploração", desc: "Conte-nos suas necessidades. Nosso sistema ajuda a definir o melhor caminho para sua cura pessoal." },
              { icon: <ShieldCheck className="text-[#0090FF]" />, title: "Curadoria", desc: "Escolha entre especialistas certificados por uma análise rigorosa de formação, ética e experiência." },
              { icon: <Calendar className="text-[#C5A03F]" />, title: "Agendamento", desc: "Reserve sessões individuais ou pacotes promocionais com total facilidade e segurança total." },
              { icon: <Zap className="text-[#0090FF]" />, title: "Transformação", desc: "Sessões seguras via vídeo ou chat. Acompanhe sua evolução emocional e espiritual em tempo real." }
            ].map((step, i) => (
              <div key={i} className="group p-8 rounded-[2.5rem] bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 transition-all shadow-sm">
                <div className="mb-6 w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <h4 className="text-[11px] font-black uppercase tracking-widest mb-3 text-slate-900">{step.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          UNIVERSO DE ESPECIALIDADES (DETALHADO)
      ────────────────────────────────────────────────────────── */}
      <section id="especialidades" className="py-20 bg-[#f5f5f7]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h5 className="text-[10px] font-black text-[#C5A03F] uppercase tracking-[0.3em] mb-4">Seu Momento</h5>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mb-8 leading-tight">
                Um universo de cura <br />ao seu alcance.
              </h2>
              <p className="text-lg text-slate-500 mb-10 leading-relaxed font-medium tracking-tight">
                No EA Lumina, você encontra as técnicas mais poderosas para o reequilíbrio energético e expansão da consciência. Tudo integrado em uma plataforma fluida.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "Reiki & Energia", icon: <Sun size={14} /> },
                  { name: "Yoga & Corpo", icon: <Wind size={14} /> },
                  { name: "Meditação Guiada", icon: <Moon size={14} /> },
                  { name: "Tarot Terapêutico", icon: <Zap size={14} /> },
                  { name: "Barras de Access", icon: <Heart size={14} /> },
                  { name: "Aromaterapia", icon: <Sparkles size={14} /> }
                ].map((spec, i) => (
                  <div key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-600 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <span className="text-[#C5A03F]">{spec.icon}</span>
                    {spec.name}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-white shadow-2xl shadow-slate-200 flex items-center justify-center p-12">
               <div className="absolute inset-0 bg-gradient-to-tr from-[#0090FF]/5 via-transparent to-[#C5A03F]/5" />
               <Logo monumental iconOnly className="opacity-40 grayscale scale-75" />
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          PARA QUEM É O EA LUMINA (DIFERENCIAIS)
      ────────────────────────────────────────────────────────── */}
      <section id="para-quem" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Para o Paciente */}
            <div className="p-10 rounded-[3rem] bg-slate-900 text-white shadow-2xl shadow-slate-200">
              <h5 className="text-[10px] font-black text-[#0090FF] uppercase tracking-[0.2em] mb-4">Para Pacientes</h5>
              <h3 className="text-3xl font-black mb-6 tracking-tighter">Inicie sua Cura</h3>
              <ul className="space-y-4 text-sm text-slate-400 font-medium tracking-tight mb-10">
                <li className="flex gap-3 items-center"><ShieldCheck size={16} className="text-[#0090FF]" /> Curadoria exclusiva de terapeutas certificados e avaliados.</li>
                <li className="flex gap-3 items-center"><Calendar size={16} className="text-[#0090FF]" /> Histórico completo de sessões e evolução personalizada.</li>
                <li className="flex gap-3 items-center"><Zap size={16} className="text-[#0090FF]" /> Pagamento seguro e agendamento inteligente em um clique.</li>
              </ul>
              <Link href="/register?role=PACIENTE" className="block">
                <button className="w-full h-14 rounded-2xl bg-white text-slate-900 font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 transition-all">Quero me tratar</button>
              </Link>
            </div>

            {/* Para o Terapeuta */}
            <div className="p-10 rounded-[3rem] bg-[#C5A03F]/5 border-2 border-[#C5A03F]/20 text-slate-900 shadow-xl shadow-amber-50">
              <h5 className="text-[10px] font-black text-[#C5A03F] uppercase tracking-[0.2em] mb-4">Para Terapeutas</h5>
              <h3 className="text-3xl font-black mb-6 tracking-tighter">Expanda sua Luz</h3>
              <ul className="space-y-4 text-sm text-slate-500 font-medium tracking-tight mb-10">
                <li className="flex gap-3 items-center"><Sparkles size={16} className="text-[#C5A03F]" /> Gestão completa de agenda e prontuário digital.</li>
                <li className="flex gap-3 items-center"><Users size={16} className="text-[#C5A03F]" /> Perfil profissional premium com avaliações de impacto.</li>
                <li className="flex gap-3 items-center"><Brain size={16} className="text-[#C5A03F]" /> Ferramentas integradas para atendimento online seguro.</li>
              </ul>
              <Link href="/register?role=TERAPEUTA" className="block">
                <button className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest hover:bg-slate-800 transition-all">Quero atender</button>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          FOOTER (HARMONIOSO E COMPACTO)
      ────────────────────────────────────────────────────────── */}
      <footer className="py-16 border-t border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
            <Logo iconOnly className="opacity-30 hover:opacity-100 transition-opacity mb-8 scale-75" />
            <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">
                <Link href="#" className="hover:text-slate-900 transition-colors">Privacidade</Link>
                <Link href="#" className="hover:text-slate-900 transition-colors">Termos de Uso</Link>
                <Link href="#" className="hover:text-slate-900 transition-colors">Suporte</Link>
                <Link href="#" className="hover:text-slate-900 transition-colors">Trabalhe Conosco</Link>
            </div>
            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em] text-center">
              © 2025 EA LUMINA • A ARTE DO EQUILÍBRIO E DA LUZ • CONECTANDO ALMAS.
            </p>
        </div>
      </footer>

    </div>
  )
}
