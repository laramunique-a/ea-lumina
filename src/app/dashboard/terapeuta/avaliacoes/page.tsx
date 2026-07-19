export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Star, MessageSquare, ArrowLeft, Calendar } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { getAvatarUrl, cn } from '@/lib/utils'

async function getReviewsData(userId: string) {
  const therapist = await prisma.therapistProfile.findUnique({
    where: { userId },
    select: { id: true, rating: true, reviewCount: true }
  })

  if (!therapist) return null

  const reviews = await prisma.review.findMany({
    where: { therapistId: therapist.id },
    include: {
      author: {
        select: { name: true, avatarUrl: true }
      },
      appointment: {
        include: { service: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return { therapist, reviews }
}

export default async function TherapistReviewsPage() {
  const headersList = headers()
  const userId = headersList.get('x-user-id')!
  
  const data = await getReviewsData(userId)

  if (!data?.therapist) {
    redirect('/dashboard/terapeuta')
  }

  const { therapist, reviews } = data

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 space-y-8 pb-24">
      <Link href="/dashboard/terapeuta" className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-[#0090FF] transition-colors group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Voltar para o Dashboard
      </Link>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sumário */}
        <div className="w-full md:w-80 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_4px_20px_-4px_rgba(6,81,237,0.08)] text-center space-y-4">
            <div className="w-20 h-20 bg-amber-50 rounded-[2rem] flex items-center justify-center mx-auto text-amber-500 shadow-sm border border-amber-100/50">
              <Star size={40} className="fill-amber-500" />
            </div>
            <div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{therapist.rating.toFixed(1)}</h1>
              <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mt-2">{therapist.reviewCount} AVALIAÇÕES</p>
            </div>
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star 
                  key={s} 
                  size={16} 
                  className={cn(
                    "transition-colors",
                    Math.round(therapist.rating) >= s ? "text-amber-400 fill-amber-400" : "text-slate-200"
                  )} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* Listagem de Reviews */}
        <div className="flex-1 space-y-4 w-full">
          {reviews.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] p-12 border border-dashed border-slate-200 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <MessageSquare size={24} />
              </div>
              <p className="text-slate-500 font-medium tracking-tight">Sua jornada está apenas começando. Em breve você terá suas primeiras avaliações aqui.</p>
            </div>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm transition-all hover:shadow-md group">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-black text-sm border border-slate-200 overflow-hidden">
                       <img 
                        src={getAvatarUrl(rev.author.name, rev.author.avatarUrl)} 
                        alt={rev.author.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 tracking-tight leading-none">{rev.author.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5 flex items-center gap-1.5 leading-none">
                        <Calendar size={10} className="text-[#0090FF]" />
                        {new Date(rev.createdAt).toLocaleDateString('pt-BR')} • {rev.appointment.service?.name || 'Sessão Individual'}
                      </p>
                    </div>
                  </div>
                  <div className="flex bg-amber-50 px-2.5 py-1 rounded-xl items-center gap-1 border border-amber-100/30">
                    <Star size={12} className="text-amber-500 fill-amber-500" />
                    <span className="text-sm font-black text-amber-600">{rev.rating}</span>
                  </div>
                </div>

                <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-100/80 space-y-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={12} className="text-[#0090FF]" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Feedback do Paciente</span>
                  </div>
                  <p className="text-slate-700 text-sm font-medium leading-relaxed italic">
                    "{rev.comment || 'O paciente não deixou um comentário em texto.'}"
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
