export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Star, MessageSquare, ArrowLeft, Calendar, User } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { getAvatarUrl, cn } from '@/lib/utils'
import Image from 'next/image'

async function getPatientReviews(userId: string) {
  const reviews = await prisma.review.findMany({
    where: { authorId: userId },
    include: {
      therapist: {
        include: {
          user: { select: { name: true, avatarUrl: true } }
        }
      },
      appointment: {
        include: { service: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return reviews
}

export default async function PatientReviewsPage() {
  const headersList = headers()
  const userId = headersList.get('x-user-id')!
  
  const reviews = await getPatientReviews(userId)

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 space-y-8 pb-24">
      <Link href="/dashboard/paciente" className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-[#0090FF] transition-colors group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Voltar para o Dashboard
      </Link>

      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">Minhas Avaliações</h1>
        <p className="text-slate-500 font-medium tracking-tight">Histórico de feedbacks que você enviou para seus terapeutas.</p>
      </div>

      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-12 border border-dashed border-slate-200 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
              <MessageSquare size={24} />
            </div>
            <p className="text-slate-500 font-medium tracking-tight">Você ainda não realizou nenhuma avaliação.</p>
            <Link href="/dashboard/paciente/buscar">
              <Button className="rounded-xl px-10 h-12 shadow-lg shadow-blue-500/10">Buscar Terapeutas</Button>
            </Link>
          </div>
        ) : (
          reviews.map((rev) => {
            const therapistName = rev.therapist.user.name
            const therapistAvatar = getAvatarUrl(therapistName, rev.therapist.user.avatarUrl)

            return (
              <div key={rev.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm transition-all hover:shadow-md group">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-500 font-black text-sm border border-slate-100 shadow-sm overflow-hidden">
                       <Image 
                        src={therapistAvatar} 
                        alt={therapistName}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 tracking-tight text-lg leading-tight">{therapistName}</p>
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-2 flex flex-wrap items-center gap-2 leading-none">
                        <Calendar size={12} className="text-[#0090FF]" />
                        {new Date(rev.createdAt).toLocaleDateString('pt-BR')} • {rev.appointment.service?.name || 'Sessão Individual'}
                      </p>
                    </div>
                  </div>
                  <div className="flex bg-amber-50 px-4 py-2 rounded-2xl items-center gap-2 border border-amber-100/30 shadow-sm shadow-amber-100/50">
                    <Star size={16} className="text-amber-500 fill-amber-500" />
                    <span className="text-lg font-black text-amber-600">{rev.rating}</span>
                  </div>
                </div>

                <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100/50 relative group-hover:bg-amber-50/30 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                     <MessageSquare size={14} className="text-[#0090FF]/40" />
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Seu Comentário</span>
                  </div>
                  <p className="text-slate-700 text-base font-medium leading-relaxed italic">
                    "{rev.comment || 'Você não deixou um comentário para esta avaliação.'}"
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
