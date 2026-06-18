'use client'

import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { generateTimeSlots } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { format, addDays, startOfDay, isSameDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'react-hot-toast'

interface Availability {
  dayOfWeek?: number | null
  date?: string | null
  startTime: string
  endTime: string
  slotDuration: number
}

interface RescheduleModalProps {
  isOpen: boolean
  onClose: () => void
  appointment: {
    id: string
    therapistId: string
    date: string
    therapist: {
        professionalName?: string | null
        user: { name: string }
    }
  }
  onSuccess: () => void
}

export function RescheduleModal({ 
  isOpen, 
  onClose, 
  appointment, 
  onSuccess 
}: RescheduleModalProps) {
  const [loading, setLoading] = useState(false)
  const [therapistData, setTherapistData] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [weekStart, setWeekStart] = useState(() => startOfDay(new Date()))
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen && appointment.therapistId) {
      setLoading(true)
      fetch(`/api/therapists/${appointment.therapistId}/public`)
        .then(r => r.json())
        .then(res => {
          if (res.success) {
            setTherapistData(res.data)
          } else {
            toast.error('Erro ao carregar agenda do terapeuta')
          }
        })
        .finally(() => setLoading(false))
    }
  }, [isOpen, appointment.therapistId])

  const daysInView = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const getAvailableSlotsForDate = (date: Date): string[] => {
    if (!therapistData) return []
    const isoDate = format(date, 'yyyy-MM-dd')
    const dayOfWeek = date.getDay()

    const specificAvail = therapistData.availability.filter((a: any) => a.date && a.date.split('T')[0] === isoDate)
    
    if (specificAvail.length > 0) {
      const allSlots: string[] = []
      specificAvail.forEach((avail: any) => {
        allSlots.push(...generateTimeSlots(avail.startTime, avail.endTime, avail.slotDuration))
      })
      return Array.from(new Set(allSlots)).sort()
    }

    const weeklyAvail = therapistData.availability.filter((a: any) => a.dayOfWeek === dayOfWeek && !a.date)
    const allSlots: string[] = []
    weeklyAvail.forEach((avail: any) => {
      allSlots.push(...generateTimeSlots(avail.startTime, avail.endTime, avail.slotDuration))
    })
    return Array.from(new Set(allSlots)).sort()
  }

  const isDateAvailable = (date: Date): boolean => {
    if (date < startOfDay(new Date())) return false
    if (!therapistData) return false
    const isoDate = format(date, 'yyyy-MM-dd')
    const dayOfWeek = date.getDay()
    return therapistData.availability.some((a: any) => 
      (a.date && a.date.split('T')[0] === isoDate) || 
      (a.dayOfWeek === dayOfWeek && !a.date)
    )
  }

  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime) return
    setSubmitting(true)

    try {
      const [hours, minutes] = selectedTime.split(':')
      const newDate = new Date(selectedDate)
      newDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)

      const res = await fetch(`/api/appointments/${appointment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: newDate.toISOString()
        }),
      })

      const data = await res.json()
      if (data.success) {
        toast.success('Horário alterado com sucesso!')
        onSuccess()
        onClose()
      } else {
        toast.error(data.error || 'Erro ao alterar horário')
      }
    } catch (err) {
      toast.error('Erro de conexão')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Alterar Horário"
      size="md"
    >
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-start gap-3">
          <AlertCircle className="text-[#0090FF] shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm font-bold text-slate-800">Reagendamento de Sessão</p>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Escolha uma nova data e horário para sua sessão com <strong>{appointment.therapist.professionalName || appointment.therapist.user.name}</strong>.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 font-medium">Carregando agenda...</div>
        ) : (
          <div className="space-y-6">
            {/* Calendário Horizontal */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <CalendarIcon size={14} className="text-[#0090FF]" />
                  Selecione o dia
                </h4>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => setWeekStart(addDays(weekStart, -7))} className="h-8 w-8 p-0 rounded-lg">
                    <ChevronLeft size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setWeekStart(addDays(weekStart, 7))} className="h-8 w-8 p-0 rounded-lg">
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {daysInView.map((date) => {
                  const available = isDateAvailable(date)
                  const selected = selectedDate && isSameDay(selectedDate, date)
                  
                  return (
                    <button
                      key={date.toISOString()}
                      disabled={!available}
                      onClick={() => {
                        setSelectedDate(date)
                        setSelectedTime(null)
                      }}
                      className={cn(
                        "flex flex-col items-center p-2 rounded-2xl transition-all border-2",
                        !available && "opacity-20 cursor-not-allowed border-transparent",
                        available && !selected && "bg-white border-slate-100 hover:border-blue-200 hover:bg-blue-50/30",
                        selected && "bg-[#0090FF] border-[#0090FF] shadow-lg shadow-blue-500/20"
                      )}
                    >
                      <span className={cn("text-[10px] font-black uppercase tracking-tighter mb-0.5", selected ? "text-blue-100" : "text-slate-400")}>
                        {format(date, 'eee', { locale: ptBR })}
                      </span>
                      <span className={cn("text-lg font-black leading-none", selected ? "text-white" : "text-slate-800")}>
                        {format(date, 'dd')}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Horários */}
            {selectedDate && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 px-1">
                  <Clock size={14} className="text-[#0090FF]" />
                  Horários disponíveis
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {getAvailableSlotsForDate(selectedDate).length > 0 ? (
                    getAvailableSlotsForDate(selectedDate).map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={cn(
                          "py-2.5 rounded-xl text-sm font-bold transition-all border-2",
                          selectedTime === time
                            ? "bg-[#0090FF] border-[#0090FF] text-white shadow-md shadow-blue-500/10"
                            : "bg-white border-slate-100 text-slate-600 hover:border-blue-200 hover:bg-blue-50/50"
                        )}
                      >
                        {time}
                      </button>
                    ))
                  ) : (
                    <div className="col-span-4 py-4 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                       Nenhum horário disponível
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="pt-4 flex gap-3">
              <Button variant="ghost" onClick={onClose} fullWidth className="font-bold text-slate-400">
                Cancelar
              </Button>
              <Button 
                onClick={handleReschedule} 
                disabled={!selectedDate || !selectedTime} 
                loading={submitting}
                fullWidth
                className="bg-[#0090FF] hover:bg-[#0077EE] shadow-lg shadow-blue-100 font-bold"
              >
                Confirmar Alteração
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
