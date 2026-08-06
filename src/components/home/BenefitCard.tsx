'use client'

import React from 'react'

export interface BenefitCardData {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  colorTheme: 'gold' | 'blue'
}

interface BenefitCardProps {
  data: BenefitCardData
}

export const BenefitCard: React.FC<BenefitCardProps> = ({ data }) => {
  const isGold = data.colorTheme === 'gold'

  return (
    <div className="bg-[rgba(7,16,29,0.86)] backdrop-blur-md border border-[rgba(120,145,178,0.25)] rounded-2xl p-4 md:p-5 flex flex-col items-center text-center transition-all duration-300 hover:border-opacity-60 hover:transform hover:-translate-y-1 hover:shadow-lg h-full justify-between group">
      <div className="flex flex-col items-center">
        {/* Ícone */}
        <div
          className={`w-9 h-9 md:w-10 md:h-10 rounded-full border flex items-center justify-center mb-2.5 transition-transform group-hover:scale-110 ${
            isGold
              ? 'border-[#D6AA4C]/40 bg-[#D6AA4C]/10 text-[#D6AA4C]'
              : 'border-[#377DF4]/40 bg-[#377DF4]/10 text-[#377DF4]'
          }`}
        >
          {data.icon}
        </div>

        {/* Título */}
        <h4
          className={`font-bold text-[11px] md:text-xs tracking-[0.15em] uppercase mb-2 ${
            isGold ? 'text-[#D6AA4C]' : 'text-[#377DF4]'
          }`}
        >
          {data.title}
        </h4>

        {/* Descrição */}
        <p className="text-[#AAB4C3] text-[10px] md:text-[11px] leading-relaxed font-normal">
          {data.description}
        </p>
      </div>
    </div>
  )
}
