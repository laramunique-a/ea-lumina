'use client'

import { cn, formatCurrency, getAvatarUrl } from '@/lib/utils'
import { MapPin, Star, Clock, Video, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import Image from 'next/image'

interface TherapistCardProps {
  therapist: {
    id: string
    therapies: string[]
    price: number | string
    currency?: string | null
    modality: string
    location: string | null
    city: string | null
    state: string | null
    rating: number
    reviewCount: number
    bio: string | null
    yearsExp: number | null
    featured?: boolean
    professionalName?: string | null
    addresses?: {
      id: string
      cep: string | null
      street: string
      number: string | null
      complement: string | null
      neighborhood: string | null
      city: string
      state: string
      country: string | null
    }[]
    user: {
      id: string
      name: string
      avatarUrl: string | null
    }
  }
  onBook?: (therapistId: string) => void
  onView?: (therapistId: string) => void
  variant?: 'grid' | 'list'
}

export function TherapistCard({ therapist, onBook, onView, variant = 'grid' }: TherapistCardProps) {
  const displayName = therapist.professionalName || therapist.user.name
  const avatarUrl = getAvatarUrl(displayName, therapist.user.avatarUrl)
  const isOnline = therapist.modality === 'ONLINE' || therapist.modality === 'AMBOS'
  const isPresencial = therapist.modality === 'PRESENCIAL' || therapist.modality === 'AMBOS'

  if (variant === 'list') {
    return (
      <div className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5">
        <div className="flex gap-4 items-center">
          <div className="relative flex-shrink-0">
            <Image
              src={avatarUrl}
              alt={displayName}
              width={56}
              height={56}
              className="rounded-full object-cover w-14 h-14 border-2 border-slate-100"
            />
            {therapist.featured && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C5A03F] rounded-full flex items-center justify-center">
                <Star size={8} className="fill-white text-white" />
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-slate-900 truncate text-sm">{displayName}</h3>
                {isPresencial && therapist.addresses && therapist.addresses.length > 0 ? (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {therapist.addresses.map((addr: any, idx: number) => (
                      <span key={idx} className="inline-flex items-center gap-1 rounded-full bg-slate-50 border border-slate-100/50 px-2 py-0.5 text-[9px] font-semibold text-[#C5A03F]" title={`${addr.street}, ${addr.number || ''} - ${addr.city}/${addr.state}`}>
                        <MapPin size={9} />
                        {addr.city} - {addr.state} ({addr.neighborhood || 'Centro'})
                      </span>
                    ))}
                  </div>
                ) : therapist.city && therapist.city.toLowerCase() !== 'remoto' ? (
                  <p className="text-xs text-[#C5A03F] font-bold mt-0.5 tracking-tight uppercase flex items-center gap-1">
                    <MapPin size={10} />
                    {therapist.city}
                  </p>
                ) : null}
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[10px] text-slate-400 uppercase tracking-wide">A partir de</p>
                <p className="font-semibold text-slate-900 text-sm">{formatCurrency(Number(therapist.price), therapist.currency || 'BRL')}</p>
                <p className="text-[10px] text-slate-400">/ sessão</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <div className="flex items-center gap-1">
                <Star size={11} className="fill-amber-400 text-amber-400" />
                <span className="text-xs font-semibold text-slate-800">{Number(therapist.rating).toFixed(1)}</span>
                <span className="text-xs text-slate-400">({therapist.reviewCount})</span>
              </div>
              <div className="flex gap-1.5 ml-auto">
                {onView && <Button variant="outline" size="sm" onClick={() => onView(therapist.id)}>Ver perfil</Button>}
                {onBook && <Button size="sm" onClick={() => onBook(therapist.id)}>Agendar</Button>}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Grid card
  return (
    <div className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col cursor-pointer h-full min-h-[430px]">

      {/* Topo */}
      <div className="relative bg-slate-50 pt-5 pb-3 px-4 flex flex-col items-center text-center border-b border-slate-100 h-[165px] justify-center flex-shrink-0">
        {therapist.featured && (
          <div className="absolute top-2.5 right-2.5 bg-amber-400 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-lg flex items-center gap-1">
            <Star size={8} className="fill-white" />
            Destaque
          </div>
        )}
        <Image
          src={avatarUrl}
          alt={displayName}
          width={60}
          height={60}
          className="rounded-full object-cover w-[60px] h-[60px] border-2 border-white shadow-sm"
        />
        <h3 className="font-semibold text-slate-900 mt-2 text-sm leading-snug truncate w-full px-2" title={displayName}>{displayName}</h3>
        <div className="text-[11px] text-[#C5A03F] font-bold mt-0.5 uppercase tracking-wider flex items-center justify-center gap-1 w-full px-2">
          <MapPin size={9} className="shrink-0" />
          <span className="truncate max-w-[150px]">
            {isPresencial && therapist.addresses && therapist.addresses.length > 0
              ? Array.from(new Set(therapist.addresses.map((a) => `${a.city}/${a.state}`))).join(' · ')
              : isPresencial && therapist.city && therapist.city.toLowerCase() !== 'remoto'
              ? `${therapist.city}${therapist.state ? `/${therapist.state}` : ''}`
              : isOnline && !isPresencial
              ? 'Atendimento Online'
              : 'Local não informado'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-1.5">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={10}
                className={i < Math.round(therapist.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-slate-700">{Number(therapist.rating).toFixed(1)}</span>
          <span className="text-[10px] text-slate-400">({therapist.reviewCount})</span>
        </div>
      </div>

      {/* Corpo */}
      <div className="p-4 flex-grow flex flex-col justify-between gap-2.5">
        <div className="flex items-center gap-2.5 text-xs text-slate-500 min-h-[16px]">
          {isOnline || isPresencial ? (
            <>
              {isOnline && (
                <span className="flex items-center gap-1">
                  <Video size={11} className="text-[#0090FF]" />
                  Online
                </span>
              )}
              {isPresencial && (
                <span className="flex items-center gap-1">
                  <Users size={11} className="text-[#0090FF]" />
                  Presencial
                </span>
              )}
            </>
          ) : (
            <span className="text-slate-400 italic">Modalidade não informada</span>
          )}
        </div>

        {/* Especialidades com altura e limites fixos e scroll embutido caso tenha muitas */}
        <div className="h-[60px] overflow-y-auto scrollbar-none flex flex-wrap gap-1.5 content-start pr-1">
          {therapist.therapies && therapist.therapies.length > 0 ? (
            therapist.therapies.map((t) => (
              <Badge 
                key={t} 
                variant="default" 
                size="sm" 
                className="text-xs px-2 py-0.5 rounded-lg truncate max-w-[170px] bg-slate-50 border border-slate-100 text-slate-600 font-semibold"
              >
                {t}
              </Badge>
            ))
          ) : (
            <span className="text-[11px] text-slate-400 italic mt-1 w-full">Nenhuma especialidade cadastrada</span>
          )}
        </div>

        {/* Endereços de Atendimento Presencial */}
        {isPresencial && therapist.addresses && therapist.addresses.length > 0 && (
          <div className="space-y-1 mt-1 border-t border-slate-50 pt-2 w-full">
            <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
              <MapPin size={9} className="text-[#C5A03F]" />
              {therapist.modality === 'AMBOS' ? 'Também atende presencialmente em:' : 'Local de atendimento:'}
            </p>
            <div className="max-h-[52px] overflow-y-auto scrollbar-none space-y-1">
              {therapist.addresses.map((addr: any, idx: number) => (
                <div key={idx} className="flex items-start gap-1" title={`${addr.street}${addr.number ? ', ' + addr.number : ''} - ${addr.neighborhood || ''} - ${addr.city}/${addr.state}`}>
                  <span className="text-[#C5A03F] text-[10px] mt-0.5 shrink-0">•</span>
                  <p className="text-[10px] text-slate-600 font-semibold leading-tight">
                    {addr.neighborhood ? `${addr.neighborhood} · ` : ''}{addr.city}/{addr.state}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rodapé com Preço e Botões */}
        <div className="border-t border-slate-100 pt-3 mt-auto">
          <div className="flex items-end justify-between mb-3 min-h-[36px]">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">A partir de</p>
              <p className="text-xl font-semibold text-slate-900 tracking-tight">{formatCurrency(Number(therapist.price || 0), therapist.currency || 'BRL')}</p>
            </div>
            <p className="text-[11px] text-slate-400 mb-0.5">/ sessão</p>
          </div>
          <div className="flex gap-2">
            {onView && (
              <Button variant="outline" size="sm" fullWidth onClick={() => onView(therapist.id)}>
                Ver perfil
              </Button>
            )}
            {onBook && (
              <Button size="sm" fullWidth onClick={() => onBook(therapist.id)}>
                Agendar sessão
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
