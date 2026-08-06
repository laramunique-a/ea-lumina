'use client'

import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { StarRating } from '@/components/ui/StarRating'
import { formatCurrency, formatDateTime, appointmentStatusConfig } from '@/lib/utils'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { MessageSquare, Calendar, Clock, CreditCard, AlertTriangle } from 'lucide-react'
import { RescheduleModal } from '@/components/appointments/RescheduleModal'
import { ResumePaymentModal } from '@/components/appointments/ResumePaymentModal'

interface Appointment {
  id: string
  date: string
  status: string
  price: number
  currency?: string
  durationMinutes?: number
  notes: string | null
  therapistId: string
  stripePaymentIntentId?: string | null
  expiresAt?: string | null
  therapist: {
    id: string
    therapies: string[]
    professionalName?: string | null
    user: { name: string; avatarUrl: string | null }
    availability?: any[]
    services?: any[]
    appointments?: any[]
  }
  review: { rating: number; comment: string | null } | null
}

export default function AgendamentosPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [reviewModal, setReviewModal] = useState<{ appointmentId: string; therapistName: string } | null>(null)
  const [rescheduleModal, setRescheduleModal] = useState<Appointment | null>(null)
  const [resumePaymentApt, setResumePaymentApt] = useState<Appointment | null>(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    loadAppointments()
    const interval = setInterval(() => {
      loadAppointments(true)
    }, 5000)
    // Atualiza contador de expiração a cada 30s
    const clockInterval = setInterval(() => setNow(new Date()), 30000)
    return () => {
      clearInterval(interval)
      clearInterval(clockInterval)
    }
  }, [statusFilter])

  const loadAppointments = async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const params = new URLSearchParams({ perPage: '20' })
      if (statusFilter) params.set('status', statusFilter)
      const res = await fetch(`/api/appointments?${params}`)
      const data = await res.json()
      if (data.success) setAppointments(data.data.items)
    } catch {
      if (!silent) toast.error('Erro ao carregar agendamentos')
    } finally {
      if (!silent) setLoading(false)
    }
  }

  const handleCancelAppointment = async (id: string) => {
    if (!confirm('Deseja cancelar este agendamento?')) return
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELADO', cancelReason: 'Cancelado pelo paciente' }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Agendamento cancelado')
        loadAppointments()
      } else {
        toast.error(data.error)
      }
    } catch {
      toast.error('Erro ao cancelar')
    }
  }

  const handleSubmitReview = async () => {
    if (!reviewModal) return
    setSubmittingReview(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId: reviewModal.appointmentId, rating, comment }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Avaliação enviada! Obrigado.')
        setReviewModal(null)
        setRating(5)
        setComment('')
        loadAppointments()
      } else {
        toast.error(data.error)
      }
    } catch {
      toast.error('Erro ao enviar avaliação')
    } finally {
      setSubmittingReview(false)
    }
  }

  const statusTabs = [
    { value: '', label: 'Todos' },
    { value: 'AGUARDANDO_PAGAMENTO', label: 'Aguardando Pagamento' },
    { value: 'PENDENTE', label: 'Pendentes' },
    { value: 'CONFIRMADO', label: 'Confirmados' },
    { value: 'CONCLUIDO', label: 'Concluídos' },
    { value: 'CANCELADO', label: 'Cancelados' },
  ]

  const statusVariant: Record<string, any> = {
    AGUARDANDO_PAGAMENTO: 'warning',
    PENDENTE: 'warning', CONFIRMADO: 'success', CONCLUIDO: 'info', CANCELADO: 'danger',
  }

  const getPaymentCountdown = (expiresAt: string): string => {
    const diffMs = new Date(expiresAt).getTime() - now.getTime()
    if (diffMs <= 0) return 'Expirado'
    const totalMin = Math.floor(diffMs / 60000)
    const hours = Math.floor(totalMin / 60)
    const mins = totalMin % 60
    if (hours > 0) return `Expira em ${hours}h ${mins}min`
    return `Expira em ${mins}min`
  }

  return (
    <div className="p-6 space-y-4">
      {/* Tabs de status (Pills) */}
      <div className="flex gap-2 flex-wrap mb-6">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              statusFilter === tab.value
                ? 'bg-[#0090FF]/10 text-[#0090FF]'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-slate-400">Carregando...</div>
        ) : appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-5">
               <Calendar size={32} className="text-slate-300" />
            </div>
            <h3 className="font-semibold text-slate-700 text-lg mb-1 tracking-tight">Nada por aqui</h3>
            <p className="text-sm text-slate-400">Nenhum agendamento encontrado.</p>
          </div>
        ) : (
          appointments.map((apt) => {
            const therapistDisplayName = apt.therapist.professionalName || apt.therapist.user.name
            const statusConfig = appointmentStatusConfig[apt.status as keyof typeof appointmentStatusConfig] || { label: apt.status, color: 'bg-slate-100 text-slate-700' }
            const avatarFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(therapistDisplayName)}&background=14b8a6&color=fff&size=64`
            
            const dateObj = new Date(apt.date)
            // Extraindo componentes para o bloco de calendário (usando timezone local assumido, ou ajusta)
            const month = dateObj.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')
            const day = dateObj.getDate().toString().padStart(2, '0')
            const time = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

            return (
              <div key={apt.id} className="bg-white rounded-[1.5rem] border border-slate-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  
                  {/* Coluna 1: Bloco de Data */}
                  <div className="flex flex-col items-center justify-center bg-slate-50 rounded-2xl w-24 h-24 flex-shrink-0 border border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">{month}</span>
                    <span className="text-3xl font-black text-slate-800 tracking-tighter leading-none">{day}</span>
                    <span className="text-xs font-semibold text-[#0090FF] mt-1.5">{time}</span>
                  </div>

                  {/* Coluna 2: Terapeuta e Info */}
                  <div className="flex-1 min-w-0 flex items-center gap-4 w-full">
                    <Image
                      src={apt.therapist.user.avatarUrl || avatarFallback}
                      alt={apt.therapist.user.name}
                      width={64}
                      height={64}
                      className="rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-900 text-lg tracking-tight">{therapistDisplayName}</h3>
                        <Badge variant={statusVariant[apt.status]} size="sm" className="shadow-sm">
                          {statusConfig.label}
                        </Badge>
                      </div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{apt.therapist.therapies[0]}</p>
                      {apt.notes && <p className="text-sm text-slate-500 mt-2 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100 break-words">"{apt.notes}"</p>}
                    </div>
                  </div>

                  {/* Coluna 3: Ações e Valor */}
                  <div className="flex flex-col items-end justify-center gap-3 flex-shrink-0 w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                    {apt.status === 'AGUARDANDO_PAGAMENTO' ? (
                      <div className="flex flex-col items-end gap-2 w-full">
                        <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
                          <AlertTriangle size={13} />
                          <span className="text-[11px] font-bold">
                            {apt.expiresAt ? getPaymentCountdown(apt.expiresAt) : 'Aguardando pagamento'}
                          </span>
                        </div>
                        <span className="font-bold text-slate-800 text-lg tracking-tight">{formatCurrency(Number(apt.price), apt.currency)}</span>
                        <div className="flex gap-2 w-full">
                          <Button
                            size="sm"
                            className="flex-1 rounded-xl bg-[#0090FF] hover:bg-blue-600 text-white shadow-md shadow-blue-100 font-bold"
                            onClick={() => setResumePaymentApt(apt)}
                          >
                            <CreditCard size={14} />
                            Concluir Pagamento
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl font-semibold px-3"
                            onClick={() => handleCancelAppointment(apt.id)}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {apt.status !== 'CONCLUIDO' && (
                          <span className="font-bold text-slate-800 text-lg tracking-tight">{formatCurrency(Number(apt.price), apt.currency)}</span>
                        )}
                    
                        <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
                          {apt.status === 'CONCLUIDO' && (
                            apt.review ? (
                              <div className="flex flex-col items-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled
                                  className="rounded-xl w-full md:w-auto font-bold opacity-60 border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                                >
                                  Avaliação realizada
                                </Button>
                                <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100/50">
                                  <StarRating value={apt.review.rating} size="sm" />
                                  {apt.review.comment && (
                                    <span className="text-[11px] font-semibold text-amber-700/60 truncate max-w-[120px]">
                                      "{apt.review.comment}"
                                    </span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                className="rounded-xl w-full md:w-auto shadow-sm"
                                onClick={() => setReviewModal({ appointmentId: apt.id, therapistName: therapistDisplayName })}
                              >
                                <MessageSquare size={16} />
                                Avaliar
                              </Button>
                            )
                          )}
                          {(apt.status === 'PENDENTE' || apt.status === 'CONFIRMADO') && (
                            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                              {apt.status === 'PENDENTE' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-[#0090FF] border-[#0090FF]/20 hover:bg-blue-50 rounded-xl font-bold px-4"
                                  onClick={() => setRescheduleModal(apt)}
                                >
                                  <Clock size={15} />
                                  Alterar horário
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl font-semibold px-4"
                                onClick={() => handleCancelAppointment(apt.id)}
                              >
                                Cancelar
                              </Button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Modal de avaliação */}
      <Modal
        isOpen={!!reviewModal}
        onClose={() => setReviewModal(null)}
        title="Avaliar sessão"
        size="sm"
      >
        {reviewModal && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Como foi sua sessão com <strong>{reviewModal.therapistName}</strong>?
            </p>
            <div className="flex justify-center">
              <StarRating
                value={rating}
                size="lg"
                readOnly={false}
                onChange={setRating}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Comentário (opcional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Compartilhe sua experiência..."
                rows={3}
                className="w-full px-4 py-3 text-sm border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>
            <Button fullWidth loading={submittingReview} onClick={handleSubmitReview}>
              Enviar avaliação
            </Button>
          </div>
        )}
      </Modal>

      {/* Modal de Reagendamento */}
      {rescheduleModal && (
        <RescheduleModal
          isOpen={!!rescheduleModal}
          onClose={() => setRescheduleModal(null)}
          appointment={rescheduleModal}
          onSuccess={loadAppointments}
        />
      )}

      {/* Modal de Retomada de Pagamento */}
      {resumePaymentApt && (
        <ResumePaymentModal
          appointment={resumePaymentApt}
          onClose={() => setResumePaymentApt(null)}
          onSuccess={() => {
            setResumePaymentApt(null)
            loadAppointments()
          }}
        />
      )}
    </div>
  )
}
