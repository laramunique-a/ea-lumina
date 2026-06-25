import React from 'react'
import { ShieldCheck, Database, Key, Activity } from 'lucide-react'

export function Footer() {
  const securitySections = [
    {
      title: 'Segurança e Privacidade',
      desc: 'Seus dados são protegidos com padrões modernos de segurança, criptografia e controle de acesso. Trabalhamos continuamente para garantir a confidencialidade, integridade e disponibilidade das informações armazenadas em nossa plataforma.',
      icon: <ShieldCheck className="w-6 h-6 text-[#C5A03F]" />,
    },
    {
      title: 'Proteção de Dados',
      desc: 'Adotamos práticas de proteção de dados e privacidade para garantir transparência, segurança e respeito às informações de nossos usuários.',
      icon: <Database className="w-6 h-6 text-[#0090FF]" />,
    },
    {
      title: 'Conexão Segura',
      desc: 'Todas as comunicações são realizadas por meio de conexões seguras e criptografadas.',
      icon: <Key className="w-6 h-6 text-[#C5A03F]" />,
    },
    {
      title: 'Disponibilidade e Confiabilidade',
      desc: 'Nossa infraestrutura é monitorada continuamente para garantir estabilidade, desempenho e proteção contra acessos não autorizados.',
      icon: <Activity className="w-6 h-6 text-[#0090FF]" />,
    },
  ]

  return (
    <footer className="w-full bg-[#030712] border-t border-slate-900 selection:bg-[#C5A03F]/20">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        
        {/* Grid de Segurança */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {securitySections.map((section, idx) => (
            <div 
              key={idx}
              className="group bg-black/40 border border-white/5 backdrop-blur-xl p-6 rounded-3xl hover:bg-white/5 hover:border-white/10 transition-all duration-500 hover:-translate-y-1 shadow-2xl flex flex-col justify-start"
            >
              <div className="mb-5 bg-slate-900/60 w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md">
                {section.icon}
              </div>
              <h4 className="text-white font-bold text-sm md:text-base uppercase tracking-wider mb-3 leading-snug">
                {section.title}
              </h4>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-medium">
                {section.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Linha Divisória */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent w-full mb-10" />

        {/* Rodapé de Encerramento */}
        <div className="flex flex-col items-center justify-center text-center gap-4">
          <div className="relative w-12 h-12 opacity-60">
            <img
              src="/logo-dark.jpg"
              alt="EA Lumina"
              className="w-full h-full object-contain"
              style={{
                WebkitMaskImage: 'radial-gradient(circle at center, black 50%, transparent 75%)',
                maskImage: 'radial-gradient(circle at center, black 50%, transparent 75%)'
              }}
            />
          </div>
          <p className="text-xs text-slate-500 font-black uppercase tracking-[0.25em] hover:text-slate-400 transition-colors">
            EA LUMINA • JORNADA DE LUZ
          </p>
          <p className="text-[10px] text-slate-600 font-medium">
            &copy; {new Date().getFullYear()} EA Lumina. Todos os direitos reservados.
          </p>
        </div>
        
      </div>
    </footer>
  )
}
