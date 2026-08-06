'use client'

import React from 'react'
import { Heart, Sparkles, Users, TrendingUp } from 'lucide-react'
import { BenefitCard, BenefitCardData } from './BenefitCard'

const BENEFITS: BenefitCardData[] = [
  {
    id: 'propositos',
    title: 'CONECTAMOS PROPÓSITOS',
    description:
      'A plataforma que aproxima quem busca transformação com profissionais que já trilharam esse caminho.',
    icon: <Heart className="w-4 h-4 md:w-5 md:h-5 text-[#D6AA4C]" />,
    colorTheme: 'gold',
  },
  {
    id: 'transformacao',
    title: 'TRANSFORMAÇÃO REAL',
    description:
      'Terapias, ferramentas e profissionais preparados para cuidar do corpo, da mente e das emoções.',
    icon: <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-[#377DF4]" />,
    colorTheme: 'blue',
  },
  {
    id: 'comunidade',
    title: 'COMUNIDADE QUE FORTALECE',
    description:
      'Um espaço de apoio, troca e evolução coletiva para terapeutas e pessoas em busca de equilíbrio.',
    icon: <Users className="w-4 h-4 md:w-5 md:h-5 text-[#D6AA4C]" />,
    colorTheme: 'gold',
  },
  {
    id: 'impacto',
    title: 'IMPACTO QUE SE MULTIPLICA',
    description:
      'Empresas e profissionais conectados para um mundo mais saudável e consciente.',
    icon: <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-[#377DF4]" />,
    colorTheme: 'blue',
  },
]

export const BenefitsSection: React.FC = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto pb-1 px-4 md:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 items-stretch">
        {BENEFITS.map((benefit) => (
          <BenefitCard key={benefit.id} data={benefit} />
        ))}
      </div>
    </div>
  )
}
