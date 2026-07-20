import React from 'react'
import Link from 'next/link'
import { ShieldCheck, Database, Key, Activity, Youtube, Instagram, Mail } from 'lucide-react'

const SECURITY = [
  { title: 'Segurança e Privacidade', desc: 'Seus dados são protegidos com criptografia moderna e controle de acesso rigoroso.', icon: <ShieldCheck className="w-5 h-5 text-[#C5A03F]" /> },
  { title: 'Proteção de Dados', desc: 'Adotamos práticas de privacidade para garantir transparência e respeito às suas informações.', icon: <Database className="w-5 h-5 text-[#0090FF]" /> },
  { title: 'Conexão Segura', desc: 'Todas as comunicações são realizadas por meio de conexões criptografadas.', icon: <Key className="w-5 h-5 text-[#C5A03F]" /> },
  { title: 'Disponibilidade', desc: 'Infraestrutura monitorada continuamente para garantir estabilidade e performance.', icon: <Activity className="w-5 h-5 text-[#0090FF]" /> },
]

export function Footer() {
  return (
    <footer className="w-full bg-[#030712] border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">

        {/* Grid de Segurança */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {SECURITY.map((section) => (
            <div
              key={section.title}
              className="bg-black/40 border border-white/5 p-6 rounded-3xl hover:bg-white/5 hover:border-white/10 transition-all duration-300"
            >
              <div className="mb-4 bg-slate-900/60 w-10 h-10 rounded-xl flex items-center justify-center">
                {section.icon}
              </div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wide mb-2">{section.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{section.desc}</p>
            </div>
          ))}
        </div>

        {/* Aviso legal */}
        <div className="bg-white/3 border border-white/5 rounded-2xl p-5 mb-12 text-center">
          <p className="text-xs text-slate-500 leading-relaxed max-w-3xl mx-auto">
            ⚠️ As práticas terapêuticas oferecidas na plataforma são de natureza complementar e integrativa. Elas não substituem acompanhamento médico, psicológico ou psiquiátrico convencional. Em situações de urgência ou crise, procure imediatamente um serviço de saúde.
          </p>
        </div>

        {/* Linha divisória */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent w-full mb-10" />

        {/* Rodapé */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo + copyright */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <img
                src="/logo-dark.jpg"
                alt="EA Lumina"
                className="w-7 h-7 object-contain opacity-60"
                style={{ WebkitMaskImage: 'radial-gradient(circle at center, black 50%, transparent 80%)', maskImage: 'radial-gradient(circle at center, black 50%, transparent 80%)' }}
              />
              <span className="text-xs font-black uppercase tracking-widest text-slate-500">EA Lumina</span>
            </div>
            <p className="text-[10px] text-slate-700">
              © {new Date().getFullYear()} EA Lumina. Todos os direitos reservados.
            </p>
          </div>

          {/* Links */}
          <nav aria-label="Links do rodapé" className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2">
            <Link href="/termos" className="text-xs text-slate-500 hover:text-white transition-colors">
              Termos de Uso
            </Link>
            <Link href="/privacidade" className="text-xs text-slate-500 hover:text-white transition-colors">
              Privacidade
            </Link>
            <a href="mailto:contato@ealumina.com" className="text-xs text-slate-500 hover:text-white transition-colors flex items-center gap-1">
              <Mail className="w-3 h-3" /> Contato
            </a>
            <a href="https://www.instagram.com/ealumina4444" target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-white transition-colors flex items-center gap-1" aria-label="Instagram EA Lumina">
              <Instagram className="w-3 h-3" /> Instagram
            </a>
            <a href="https://www.youtube.com/@ealumina4444" target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-white transition-colors flex items-center gap-1" aria-label="YouTube EA Lumina">
              <Youtube className="w-3 h-3" /> YouTube
            </a>
          </nav>
        </div>

      </div>
    </footer>
  )
}
