'use client'

import React from 'react'

export const HeroContent: React.FC = () => {
  return (
    <div className="flex flex-col items-center lg:items-start text-center lg:text-left pr-0 lg:pr-6 max-w-xl mx-auto lg:mx-0">
      {/* Logo Oficial EA Lumina */}
      <div className="flex flex-col items-center lg:items-start mb-2 md:mb-4">
        <div className="w-48 sm:w-56 md:w-72 lg:w-80 h-auto">
          <img
            src="/img/logo-official.png"
            alt="EA Lumina"
            className="w-full h-auto object-contain mix-blend-screen filter drop-shadow-[0_0_25px_rgba(214,170,76,0.45)]"
          />
        </div>
      </div>

      {/* Headline com Destaque na Transformação */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[36px] font-black leading-[1.25] tracking-tight mb-3 md:mb-4">
        <span className="text-[#D6AA4C]">Conectar quem busca </span>
        <span className="text-[#377DF4]">transformar </span>
        <br className="hidden sm:inline" />
        <span className="text-[#D6AA4C]">sua vida com quem já percorreu </span>
        <br className="hidden sm:inline" />
        <span className="text-[#D6AA4C]">esse </span>
        <span className="text-[#377DF4]">caminho.</span>
      </h1>

      {/* Texto Institucional */}
      <p className="text-[#AAB4C3] text-xs sm:text-sm leading-relaxed font-normal max-w-lg">
        A EALUMINA é o encontro entre quem precisa e quem já transformou.<br className="hidden sm:inline" />
        Um ecossistema de terapias, conhecimento e propósito para uma vida mais equilibrada, consciente e com sentido.
      </p>
    </div>
  )
}
