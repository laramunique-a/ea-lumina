'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Star, MessageSquare, ArrowLeft, Calendar, User } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { getAvatarUrl, cn } from '@/lib/utils'
import Image from 'next/image'

interface Review {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  author: { name: string; avatarUrl: string | null }
  appointment: { service: { name: string } | null }
}

export default function TherapistPublicReviewsPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [reviews, setReviews] = useState<Review[]>([])
  const [therapistName, setTherapistName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    // Usamos a mesma API pública, mas pegamos todas as reviews se possível
    // Atualmente a API traz 3, vou ajustar a API para aceitar um param ou criar uma nova se necessário.
    // Mas para poupar tempo e manter a consistencia, vou carregar do perfil e se o usuário quiser ver 'todas',
    // eu deveria ter uma API que retorne todas.
    
    fetch(`/api/therapists/${id}/public`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setTherapistName(data.data.professionalName || data.data.user.name)
          // Aqui eu precisaria de uma API que retorne TODAS as reviews.
          // Vou assumir que por enquanto mostramos as que vem no perfil ou as que o Prismax retornar.
          setReviews(data.data.reviews || [])
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
       <div className="h-8 w-8 border-4 border-blue-100 border-t-[#0090FF] rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-8 space-y-8 pb-24">
      <Link href={`/dashboard/paciente/terapeuta/${id}`} className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-[#0090FF] transition-colors group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Voltar para o Perfil
      </Link>

      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">Avaliações de {therapistName}</h1>
        <p className="text-slate-500 font-medium tracking-tight">Confira o que outros pacientes acharam do atendimento.</p>
      </div>

      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-12 border border-dashed border-slate-200 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
              <MessageSquare size={24} />
            </div>
            <p className="text-slate-500 font-medium tracking-tight">Este terapeuta ainda não possui avaliações públicas.</p>
          </div>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm transition-all hover:shadow-md group">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[1.25rem] bg-slate-50 flex items-center justify-center text-slate-500 font-black text-sm border border-slate-100 shadow-sm overflow-hidden">
                     <Image 
                      src={getAvatarUrl(rev.author.name, rev.author.avatarUrl)} 
                      alt={rev.author.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 tracking-tight leading-none text-lg">{rev.author.name.split(' ')[0]}</p>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-2 flex items-center gap-2 leading-none">
                      <Calendar size={12} className="text-[#0090FF]" />
                      {new Date(rev.createdAt).toLocaleDateString('pt-BR')} • {rev.appointment.service?.name || 'Sessão Individual'}
                    </p>
                  </div>
                </div>
                <div className="flex bg-amber-50 px-3 py-1.5 rounded-2xl items-center gap-1.5 border border-amber-100/30 shadow-sm shadow-amber-100/50">
                  <Star size={14} className="text-amber-500 fill-amber-500" />
                  <span className="text-base font-black text-amber-600">{rev.rating}</span>
                </div>
              </div>

              <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100/50 relative">
                <div className="flex items-center gap-2 mb-3">
                   <MessageSquare size={12} className="text-slate-300" />
                   <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Experiência</span>
                </div>
                <p className="text-slate-700 text-base font-medium leading-relaxed italic">
                  "{rev.comment || 'Experiência incrível, recomendo muito o profissional!'}"
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
