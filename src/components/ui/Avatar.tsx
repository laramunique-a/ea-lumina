'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface AvatarProps {
  src?: string | null
  alt: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeConfig = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
}

export function Avatar({ src, alt, size = 'md', className }: AvatarProps) {
  const [error, setError] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Iniciais para o fallback
  const initials = alt
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Se a URL mudar, reseta o erro
  useEffect(() => {
    setError(false)
  }, [src])

  if (!mounted) {
    return <div className={cn('rounded-full bg-slate-100 animate-pulse', sizeConfig[size], className)} />
  }

  if (!src || error) {
    return (
      <div
        className={cn(
          'rounded-full bg-[#0090FF] flex items-center justify-center text-white font-semibold flex-shrink-0 border border-white/10 shadow-sm',
          sizeConfig[size],
          className
        )}
      >
        {initials}
      </div>
    )
  }

  return (
    <div className={cn('relative flex-shrink-0 overflow-hidden rounded-full border border-slate-100 shadow-sm', sizeConfig[size], className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover"
        onError={() => setError(true)}
        unoptimized={src?.includes('supabase.co')} // Útil se o domínio não estiver no next.config ou se der 404 frequente
      />
    </div>
  )
}
