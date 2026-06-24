'use client'

import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { BookingModal } from '@/components/appointments/BookingModal'
import { formatCurrency, getAvatarUrl } from '@/lib/utils'
import { MapPin, Star, Clock, Video, Users, ArrowLeft, FileText, ExternalLink, MessageSquare } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface TherapyPackage {
  id: string
  name: string
  sessionCount: number
  price: number
  expirationDays?: number | null
  isMultiTherapy?: boolean
  allowedServices?: string[]
}

interface TherapistService {
  id: string
  name: string
  description: string | null
  durationMinutes: number
  price: number
  promoPrice?: number | null
  displayPrice?: number
  currency: string
  modality: string
  packages: TherapyPackage[]
}

interface TherapistPublic {
  id: string
  bio: string | null
  therapies: string[]
  price: number
  profilePrice?: number
  modality: string
  location: string | null
  city: string | null
  state: string | null
  rating: number
  reviewCount: number
  yearsExp: number | null
  certifications: string[]
  user: { id: string; name: string; avatarUrl: string | null }
  professionalName?: string | null
  availability: { dayOfWeek: number; startTime: string; endTime: string; slotDuration: number }[]
  services?: TherapistService[]
  publicTargetDescription: string | null
  reviews?: {
    id: string
    rating: number
    comment: string | null
    createdAt: string
    author: { name: string; avatarUrl: string | null }
    appointment: { service: { name: string } | null }
  }[]
  certificates: { id: string; name: string; fileUrl: string }[]
  presentationVideoUrl?: string | null
}

import { Suspense } from 'react'

function TerapeutaPerfilContent() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = params.id as string
  const [profile, setProfile] = useState<TherapistPublic | null>(null)
  const [loading, setLoading] = useState(true)
  const [bookingConfig, setBookingConfig] = useState<{
    isOpen: boolean
    serviceId?: string
    packageId?: string
    usePackageId?: string
  }>({ isOpen: false })

  useEffect(() => {
    if (!id) return
    fetch(`/api/therapists/${id}/public`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setProfile(data.data)
        else setProfile(null)
      })
      .catch(() => setProfile(null))
      .finally(() => setLoading(false))
  }, [id])

  // Auto-abrir modal quando vem do dashboard com pacote comprado
  useEffect(() => {
    if (!profile) return
    const usePackageId = searchParams.get('usePackage')
    const serviceId = searchParams.get('serviceId')
    const multiTherapy = searchParams.get('multiTherapy') === 'true'
    
    if (usePackageId) {
      setBookingConfig({
        isOpen: true,
        usePackageId,
        // Se NOT multiTherapy, pré-seleciona o serviço; se multiTherapy, deixa escolher
        serviceId: !multiTherapy && serviceId ? serviceId : undefined,
      })
    }
  }, [searchParams, profile])

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="h-64 bg-white rounded-2xl border border-surface-200 animate-pulse" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center">
        <p className="text-slate-600 mb-4">O perfil que você buscou não existe ou não está aprovado.</p>
        <Link href="/dashboard/paciente/buscar">
          <Button variant="secondary">Voltar à busca</Button>
        </Link>
      </div>
    )
  }

  const displayName = profile.professionalName || profile.user.name
  const avatarUrl = getAvatarUrl(displayName, profile.user.avatarUrl)
  const isOnline = profile.modality === 'ONLINE' || profile.modality === 'AMBOS'
  const isPresencial = profile.modality === 'PRESENCIAL' || profile.modality === 'AMBOS'

  const therapistForBooking = {
    id: profile.id,
    price: profile.price,
    user: { name: displayName },
    availability: profile.availability || [],
    services: (profile.services || []).map(s => ({
      ...s,
      packages: s.packages || []
    }))
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <Link
        href="/dashboard/paciente/buscar"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-2"
      >
        <ArrowLeft size={16} />
        Voltar à busca
      </Link>

      {/* Card principal */}
      <div className="bg-white rounded-2xl border border-surface-200 shadow-card overflow-hidden">
        <div className="bg-gradient-to-b from-sand-100 to-sand-50 p-6 flex flex-col sm:flex-row gap-6 items-start">
          <div className="flex-shrink-0">
            <Image
              src={avatarUrl}
              alt={displayName}
              width={120}
              height={120}
              className="rounded-full object-cover border-4 border-white shadow-card w-[120px] h-[120px] shrink-0"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-slate-900">{displayName}</h1>
            {profile.therapies[0] && (
              <p className="text-brand-600 font-medium mt-0.5">{profile.therapies[0]}</p>
            )}
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Star size={16} className="fill-amber-400 text-amber-400" />
                <span className="font-semibold text-slate-800">{profile.rating.toFixed(1)}</span>
                <span className="text-slate-500 text-sm">({profile.reviewCount} avaliações)</span>
              </div>
              {profile.yearsExp != null && (
                <span className="flex items-center gap-1 text-sm text-slate-500">
                  <Clock size={14} />
                  {profile.yearsExp} anos de experiência
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-2 text-sm text-slate-600">
              {isOnline && (
                <span className="flex items-center gap-1">
                  <Video size={14} className="text-brand-500" />
                  Online
                </span>
              )}
              {isPresencial && (
                <span className="flex items-center gap-1">
                  <Users size={14} className="text-brand-500" />
                  Presencial
                </span>
              )}
              {(profile.city || profile.state) && (
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {[profile.city, profile.state].filter(Boolean).join(', ')}
                </span>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="lg" onClick={() => setBookingConfig({ isOpen: true })}>
                Agendar sessão
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 border-t border-surface-100">
          {profile.bio && (
            <section>
              <h2 className="font-semibold text-slate-900 mb-2">Sobre</h2>
              <p className="text-slate-600 whitespace-pre-wrap">{profile.bio}</p>
            </section>
          )}

          {profile.publicTargetDescription && (
            <section>
              <h2 className="font-semibold text-slate-900 mb-2">Público alvo</h2>
              <p className="text-slate-600 whitespace-pre-wrap">{profile.publicTargetDescription}</p>
            </section>
          )}

          {profile.presentationVideoUrl && (
            <section>
              <h2 className="font-semibold text-slate-900 mb-4">Apresentação</h2>
              <div className="rounded-xl overflow-hidden bg-slate-900 max-w-sm mx-auto sm:mx-0 shadow-sm border border-slate-200">
                <video 
                  src={profile.presentationVideoUrl} 
                  controls 
                  preload="metadata" 
                  className="w-full aspect-[9/16] object-cover"
                />
              </div>
            </section>
          )}

          {profile.therapies.length > 0 && (
            <section>
              <h2 className="font-semibold text-slate-900 mb-2 tracking-tight">Especialidades</h2>
              <div className="flex flex-wrap gap-2">
                {profile.therapies.map((t) => (
                  <Badge key={t} variant="default" size="sm">
                    {t}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {profile.certificates?.length > 0 && (
            <section>
              <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText size={18} className="text-[#0090FF]" />
                Certificações e documentos
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profile.certificates.map((cert) => {
                  const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(cert.fileUrl)
                  return (
                    <a
                      key={cert.id}
                      href={cert.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md hover:border-blue-100 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                        {isImage ? (
                          <img src={cert.fileUrl} alt={cert.name} className="w-full h-full object-cover" />
                        ) : (
                          <FileText size={20} className="text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-[#0090FF] transition-colors" title={cert.name}>
                          {cert.name}
                        </p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 flex items-center gap-1">
                          Ver documento <ExternalLink size={8} />
                        </p>
                      </div>
                    </a>
                  )
                })}
              </div>
            </section>
          )}

          {/* Avaliações do Terapeuta */}
          {profile.reviews && profile.reviews.length > 0 && (
            <section className="pt-4">
               <div className="flex items-center justify-between mb-5 px-1">
                  <h2 className="font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <Star size={18} className="fill-amber-400 text-amber-400" />
                    O que os pacientes dizem
                  </h2>
                  <Link href={`/dashboard/paciente/terapeuta/${id}/avaliacoes`}>
                    <Button variant="ghost" size="sm" className="text-[#0090FF] font-bold text-xs uppercase tracking-widest -mr-4 hover:bg-blue-50">
                      Ver todas →
                    </Button>
                  </Link>
               </div>
               
               <div className="space-y-4">
                  {profile.reviews.map((rev) => (
                    <div key={rev.id} className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:bg-white transition-all">
                       <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-2.5">
                             <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-slate-400 font-bold text-[10px] border border-slate-100 shadow-sm overflow-hidden">
                                <Image src={getAvatarUrl(rev.author.name, rev.author.avatarUrl)} alt={rev.author.name} width={32} height={32} className="w-full h-full object-cover" />
                             </div>
                             <div>
                                <p className="font-bold text-slate-900 text-xs leading-none">{rev.author.name.split(' ')[0]}</p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight mt-1">{rev.appointment.service?.name || 'Sessão Individual'}</p>
                             </div>
                          </div>
                          <div className="flex gap-0.5">
                             {[1, 2, 3, 4, 5].map((s) => (
                               <Star key={s} size={10} className={rev.rating >= s ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
                             ))}
                          </div>
                       </div>
                       <p className="text-slate-600 text-sm font-medium leading-relaxed italic line-clamp-3">
                          "{rev.comment || 'Experiência incrível!'}"
                       </p>
                    </div>
                  ))}
               </div>
            </section>
          )}

          {/* Vitrine de Pacotes !!! */}
          {profile.services && profile.services.some(s => s.packages?.length > 0) && (
            <section className="bg-blue-50/30 p-6 rounded-3xl border border-blue-100/50">
               <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-slate-900 flex items-center gap-2">
                     <span className="w-1.5 h-6 bg-[#C5A03F] rounded-full" />
                     Pacotes Promocionais
                  </h2>
                  <span className="text-[10px] bg-[#C5A03F] text-white px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Ofertas</span>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.services.flatMap(svc => svc.packages.map(pkg => ({ ...pkg, svcName: svc.name, svcId: svc.id }))).map(pkg => (
                    <div key={pkg.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
                       <div>
                          <p className="text-xs font-bold text-[#C5A03F] uppercase tracking-tighter mb-1">{pkg.svcName}</p>
                          <h3 className="font-bold text-slate-900 mb-1">{pkg.name}</h3>
                          <p className="text-xs text-slate-500 font-medium">
                            {pkg.isMultiTherapy
                              ? pkg.allowedServices && pkg.allowedServices.length > 0
                                ? `Flexível: ${pkg.allowedServices.map(id => profile.services?.find(s => s.id === id)?.name).filter(Boolean).join(', ')}`
                                : 'Flexível: Qualquer Terapia'
                              : `Combo com ${pkg.sessionCount} sessões`}
                          </p>
                          <div className="mt-4 flex items-baseline gap-1">
                             <p className="text-xl font-black text-[#0090FF]">{formatCurrency(pkg.price)}</p>
                             <span className="text-[10px] text-slate-400 font-bold uppercase">Total</span>
                          </div>
                          <p className="text-[10px] text-brand-600 font-bold mt-1 uppercase tracking-tight">
                             SAI POR {formatCurrency(pkg.price / pkg.sessionCount)} / SESSÃO
                          </p>
                       </div>
                       <Button 
                          className="mt-4 w-full bg-slate-50 text-slate-700 hover:bg-blue-50 hover:text-blue-700 border-slate-100" 
                          size="sm"
                          variant="secondary"
                          onClick={() => setBookingConfig({ isOpen: true, serviceId: pkg.svcId, packageId: pkg.id })}
                       >
                          Garantir este Pacote
                       </Button>
                    </div>
                  ))}
               </div>
            </section>
          )}

          {profile.services && profile.services.length > 0 && (
            <section>
              <h2 className="font-semibold text-slate-900 mb-2">Serviços oferecidos</h2>
              <div className="space-y-3">
                {profile.services.map((svc) => (
                  <div
                    key={svc.id}
                    className="p-4 rounded-xl border border-surface-200 bg-surface-50"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <p className="font-medium text-slate-900">{svc.name}</p>
                        <p className="text-sm text-slate-500 mt-0.5">
                          {svc.durationMinutes} min • {svc.modality === 'ONLINE' ? 'Online' : svc.modality === 'PRESENCIAL' ? 'Presencial' : 'Online e Presencial'}
                        </p>
                        {svc.description && (
                          <p className="text-sm text-slate-600 mt-2">{svc.description}</p>
                        )}
                      </div>
                      <p className="font-bold text-slate-900 flex-shrink-0">
                        {formatCurrency(svc.displayPrice ?? svc.price, svc.currency)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}


          <section className="pt-4 border-t border-surface-100 flex justify-between items-center">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">A partir de</p>
              <p className="text-2xl font-black text-slate-900 tracking-tighter">
                {profile.services && profile.services.length > 0
                  ? formatCurrency(Math.min(profile.price, ...profile.services.map((s) => s.price)))
                  : formatCurrency(profile.price)}
              </p>
            </div>
            <Button size="lg" onClick={() => setBookingConfig({ isOpen: true })}>
              Agendar sessão
            </Button>
          </section>
        </div>
      </div>

      {bookingConfig.isOpen && (
        <BookingModal
          isOpen={true}
          onClose={() => setBookingConfig({ isOpen: false })}
          therapist={therapistForBooking}
          initialServiceId={bookingConfig.serviceId}
          initialPackageId={bookingConfig.packageId}
          initialUsePackageId={bookingConfig.usePackageId}
          onSuccess={() => {
            setBookingConfig({ isOpen: false })
            toast.success('Agendamento realizado! Aguarde a confirmação.')
            router.push('/dashboard/paciente/agendamentos')
          }}
        />
      )}
    </div>
  )
}

export default function TerapeutaPerfilPublicoPage() {
  return (
    <Suspense fallback={<div className="p-6 max-w-3xl mx-auto"><div className="h-64 bg-white rounded-2xl border border-surface-200 animate-pulse" /></div>}>
      <TerapeutaPerfilContent />
    </Suspense>
  )
}

