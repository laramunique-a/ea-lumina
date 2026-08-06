'use client'

import React from 'react'
import { ArrowRight, Heart, Sparkles, Users, Compass } from 'lucide-react'

interface ObjectiveItem {
  id: string
  label: string
  icon: React.ReactNode
}

interface ObjectiveMenuProps {
  onSelectObjective: (id: string) => void
}

const OBJECTIVES: ObjectiveItem[] = [
  {
    id: 'pacientes',
    label: 'SOU PACIENTE',
    icon: <Heart className="w-4 h-4 md:w-5 md:h-5 text-[#377DF4]" />,
  },
  {
    id: 'terapeutas',
    label: 'SOU TERAPEUTA',
    icon: <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-[#377DF4]" />,
  },
  {
    id: 'empresas',
    label: 'PARA EMPRESAS',
    icon: <Users className="w-4 h-4 md:w-5 md:h-5 text-[#377DF4]" />,
  },
  {
    id: 'cursos',
    label: 'VER CURSOS',
    icon: <Compass className="w-4 h-4 md:w-5 md:h-5 text-[#377DF4]" />,
  },
]

export const ObjectiveMenu: React.FC<ObjectiveMenuProps> = ({ onSelectObjective }) => {
  return (
    <div className="w-full max-w-[380px] flex flex-col gap-3 mx-auto lg:mx-0">
      {/* Texto de cabeçalho do menu */}
      <h3 className="text-[#AAB4C3] font-bold uppercase tracking-[0.2em] text-[10px] md:text-[11px] mb-0.5 text-center lg:text-left pl-1">
        QUAL É O SEU OBJETIVO HOJE?
      </h3>

      {/* Botões Empilhados */}
      {OBJECTIVES.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelectObjective(item.id)}
          className="group flex items-center justify-between w-full bg-[rgba(7,16,29,0.86)] backdrop-blur-md border border-[rgba(120,145,178,0.25)] hover:border-[#377DF4]/60 hover:bg-[#0c1a32] text-[#F5F7FA] rounded-2xl px-5 py-3.5 transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(55,125,244,0.2)] transform hover:-translate-y-0.5 cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-1 group-hover:scale-110 transition-transform">
              {item.icon}
            </div>
            <span className="text-xs md:text-xs font-black tracking-[0.18em] uppercase text-[#F5F7FA]">
              {item.label}
            </span>
          </div>
          <ArrowRight className="w-4 h-4 text-[#AAB4C3] group-hover:text-[#377DF4] group-hover:translate-x-1.5 transition-all" />
        </button>
      ))}
    </div>
  )
}
