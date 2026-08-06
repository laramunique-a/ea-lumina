'use client'

import React from 'react'

export const LandingFooterStatement: React.FC = () => {
  return (
    <footer className="relative z-30 w-full max-w-[1440px] mx-auto pb-2 px-4 md:px-8 mt-2">
      <div className="relative flex items-center justify-center mb-1.5">
        {/* Linha decorativa à esquerda e à direita */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#D6AA4C]/40 to-transparent" />
        <div className="absolute bg-[#020812] px-3 flex items-center justify-center">
          {/* Ponto de luz central */}
          <div className="w-1.5 h-1.5 rotate-45 bg-[#D6AA4C] shadow-[0_0_8px_#D6AA4C]" />
        </div>
      </div>

      {/* Frase Institucional Final */}
      <p className="text-center text-[9px] md:text-[10px] tracking-[0.3em] text-[#D6AA4C] font-bold uppercase">
        MAIS QUE UMA PLATAFORMA, UMA JORNADA COLETIVA.
      </p>
    </footer>
  )
}
