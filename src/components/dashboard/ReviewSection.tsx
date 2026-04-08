'use client'

import { useState } from 'react'
import { Star, MessageSquare, Send, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { cn, getAvatarUrl } from '@/lib/utils'
import Image from 'next/image'

interface PendingReview {
  id: string
  date: string | Date
  therapist: {
    user: {
      name: string
      avatarUrl: string | null
    }
  }
  service: {
    name: string
  } | null
}

interface ReviewSectionProps {
  reviews: PendingReview[]
}

export function ReviewSection({ reviews }: ReviewSectionProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState<string | null>(null)
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [comments, setComments] = useState<Record<string, string>>({})
  const [completed, setCompleted] = useState<Record<string, boolean>>({})

  const handleRating = (id: string, value: number) => {
    setRatings(prev => ({ ...prev, [id]: value }))
  }

  const handleComment = (id: string, value: string) => {
    setComments(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (id: string) => {
    const rating = ratings[id]
    if (!rating) {
      toast.error('Por favor, selecione uma nota')
      return
    }

    setSubmitting(id)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId: id,
          rating,
          comment: comments[id] || '',
        }),
      })

      const data = await res.json()

      if (data.success) {
        toast.success('Avaliação enviada com sucesso!')
        setCompleted(prev => ({ ...prev, [id]: true }))
        router.refresh()
      } else {
        toast.error(data.error || 'Erro ao enviar avaliação')
      }
    } catch (error) {
      toast.error('Erro de conexão')
    } finally {
      setSubmitting(null)
    }
  }

  if (reviews.length === 0) return null

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          Avaliações Pendentes
          <span className="bg-amber-100 text-amber-600 text-[10px] font-black px-2 py-0.5 rounded-full">
            {reviews.length}
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((rev) => {
          if (completed[rev.id]) return null

          const therapistName = rev.therapist.user.name
          const therapistAvatar = getAvatarUrl(therapistName, rev.therapist.user.avatarUrl)
          const dateStr = new Date(rev.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })

          return (
            <div 
              key={rev.id} 
              className="bg-white rounded-[1.5rem] p-4 border border-slate-100 shadow-sm flex flex-col gap-3 relative overflow-hidden group transition-all hover:shadow-md border-b-2 border-b-amber-50"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 flex-shrink-0">
                  <Image
                    src={therapistAvatar}
                    alt={therapistName}
                    fill
                    className="rounded-xl object-cover ring-2 ring-slate-50"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-900 truncate text-sm leading-tight">{therapistName}</p>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight mt-0.5">
                    {rev.service?.name || 'Sessão Individual'} • {dateStr}
                  </p>
                </div>
                <div className="flex bg-amber-50 px-2 py-1 rounded-lg items-center gap-1 border border-amber-100/30">
                  <Star size={10} className="text-amber-500 fill-amber-500" />
                  <span className="text-[10px] font-black text-amber-600">PENDENTE</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between px-3 py-2 bg-slate-50/50 rounded-xl border border-slate-100/50">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sua nota:</p>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRating(rev.id, star)}
                        className="transition-transform hover:scale-125 active:scale-95 duration-200"
                      >
                        <Star 
                          size={18} 
                          className={cn(
                            "transition-colors",
                            (ratings[rev.id] || 0) >= star 
                              ? "text-amber-400 fill-amber-400" 
                              : "text-slate-200"
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    placeholder="Algum comentário? (opcional)"
                    value={comments[rev.id] || ''}
                    onChange={(e) => handleComment(rev.id, e.target.value)}
                    className="w-full bg-slate-50/20 border border-slate-100 rounded-xl p-3 text-xs font-medium placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-100 focus:border-blue-200 transition-all resize-none h-14"
                  />
                </div>

                <Button
                  onClick={() => handleSubmit(rev.id)}
                  disabled={submitting === rev.id || !ratings[rev.id]}
                  className="w-full h-10 rounded-xl font-bold gap-2 text-xs shadow-md shadow-blue-500/5"
                >
                  {submitting === rev.id ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={14} />
                      Enviar Avaliação
                    </>
                  )}
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
