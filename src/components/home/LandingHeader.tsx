'use client'

import React from 'react'
import Link from 'next/link'
import { Youtube, Instagram } from 'lucide-react'

interface LandingHeaderProps {
  youtubeUrl?: string
  instagramUrl?: string
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({
  youtubeUrl = 'https://www.youtube.com/@ealumina4444',
  instagramUrl = 'https://www.instagram.com/ealumina4444',
}) => {
  return (
    <header className="relative z-30 flex items-center justify-between w-full max-w-[1440px] mx-auto pt-2 px-4 md:px-8">
      {/* Canto Superior Esquerdo: Redes Sociais */}
      <div className="flex items-center gap-4 md:gap-5">
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#AAB4C3] hover:text-[#F5F7FA] transition-colors p-1"
          aria-label="YouTube EA Lumina"
        >
          <Youtube className="w-5 h-5 md:w-6 md:h-6 stroke-[1.8]" />
        </a>
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#AAB4C3] hover:text-[#F5F7FA] transition-colors p-1"
          aria-label="Instagram EA Lumina"
        >
          <Instagram className="w-5 h-5 md:w-6 md:h-6 stroke-[1.8]" />
        </a>
      </div>

      {/* Canto Superior Direito: Entrar & Criar Conta */}
      <div className="flex items-center gap-4 md:gap-6">
        <Link
          href="/login"
          className="text-[#F5F7FA] text-[11px] md:text-xs font-bold uppercase tracking-[0.2em] hover:text-[#D6AA4C] transition-colors px-2 py-1"
        >
          ENTRAR
        </Link>
        <Link
          href="/register"
          className="bg-[#D6AA4C] hover:bg-[#F0CF78] text-[#020812] font-black text-[11px] md:text-xs tracking-[0.15em] px-5 md:px-6 py-2.5 rounded-full transition-all shadow-[0_0_20px_rgba(214,170,76,0.3)] hover:shadow-[0_0_25px_rgba(240,207,120,0.5)] uppercase transform hover:scale-[1.02]"
        >
          CRIAR CONTA
        </Link>
      </div>
    </header>
  )
}
