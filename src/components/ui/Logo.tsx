'use client'

import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  iconOnly?: boolean
  light?: boolean
  monumental?: boolean
}

export function Logo({ className, iconOnly = false, light = false, monumental = false }: LogoProps) {
  const goldColor = '#C5A03F'
  const blueColor = '#0090FF'

  return (
    <div className={cn("flex flex-col items-center gap-2 group", className)}>
      <div className={cn(
        "relative flex items-center justify-center transition-all duration-500",
        monumental ? "w-80 h-80 md:w-[480px] md:h-[480px]" : 
        iconOnly ? "w-10 h-10 md:w-12 md:h-12" : "w-16 h-16"
      )}>
        <div className="relative z-10 w-full h-full animate-in fade-in zoom-in duration-700">
           <Image
             src="/img/logo.png"
             alt="EA Lumina"
             width={monumental ? 1000 : 200}
             height={monumental ? 1000 : 200}
             className="w-full h-full object-contain"
             priority
             onError={(e) => (e.currentTarget.style.display = 'none')}
           />
        </div>
      </div>
      
      {!iconOnly && (
        <div className="text-center">
          <span className={cn(
            "font-extrabold tracking-tight transition-colors duration-300 uppercase",
            iconOnly ? "text-3xl" : "text-xl",
            light ? "text-white" : "text-slate-900"
          )}>
            EA <span style={{ color: light ? 'white' : blueColor }}>Lumina</span>
          </span>
          <p className={cn(
            "text-[10px] font-bold uppercase tracking-[0.2em] mt-0.5 opacity-60",
            light ? "text-white" : "text-slate-500"
          )}>
            Bem-Estar Holístico
          </p>
        </div>
      )}
    </div>
  )
}
