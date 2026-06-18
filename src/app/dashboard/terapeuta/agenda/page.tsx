'use client'

import { Header } from '@/components/dashboard/Header'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { cn, formatCurrency, formatDateTime, appointmentStatusConfig } from '@/lib/utils'
import { withAuth } from '@/lib/auth-fetch'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Check, Clock, Save, Plus, Trash2, CalendarDays } from 'lucide-react'

// ============================================================
// TIPOS
// ============================================================

interface Appointment {
  id: string
  date: string
  status: string
  price: number
  therapistNet: number | null
  notes: string | null
  patientId: string
  patient: {
    id: string
    socialName?: string | null
    user: { name: string; avatarUrl: string | null }
  }
  review: { rating: number } | null
}

interface AvailabilitySlot {
  id?: string
  dayOfWeek?: number | null
  date?: string | null
  startTime: string
  endTime: string
  slotDuration: number
  active: boolean
}

const DAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const DAYS_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const TIME_OPTIONS: string[] = []
for (let h = 6; h <= 22; h++) {
  TIME_OPTIONS.push(`${String(h).padStart(2, '0')}:00`)
  TIME_OPTIONS.push(`${String(h).padStart(2, '0')}:30`)
}

const DURATION_OPTIONS = [
  { value: 30,  label: '30 min' },
  { value: 45,  label: '45 min' },
  { value: 60,  label: '1 hora' },
  { value: 90,  label: '1h30' },
  { value: 120, label: '2 horas' },
]

const TIMEZONE_OPTIONS = [
  { value: 'America/Sao_Paulo',   label: 'Brasília (GMT-3)' },
  { value: 'America/Manaus',     label: 'Manaus (GMT-4)' },
  { value: 'America/Fortaleza',  label: 'Fortaleza (GMT-3)' },
  { value: 'America/Recife',     label: 'Recife (GMT-3)' },
  { value: 'America/Cuiaba',     label: 'Cuiabá (GMT-4)' },
  { value: 'America/Porto_Velho', label: 'Porto Velho (GMT-4)' },
  { value: 'Europe/Lisbon',      label: 'Lisboa (GMT+0/+1)' },
  { value: 'Europe/London',      label: 'Londres (GMT+0/+1)' },
  { value: 'America/New_York',  label: 'Nova York (GMT-5/-4)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (GMT-8/-7)' },
]

function TerapeutaAgendaContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tab, setTab] = useState<'appointments' | 'availability'>(
    (searchParams.get('tab') as 'appointments' | 'availability') || 'appointments'
  )

  // — Agendamentos —
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loadingApts, setLoadingApts] = useState(true)
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '')

  // — Disponibilidade —
  const [slots, setSlots] = useState<AvailabilitySlot[]>([])
  const [timezone, setTimezone] = useState('America/Sao_Paulo')
  const [loadingAvail, setLoadingAvail] = useState(true)
  const [savingAvail, setSavingAvail] = useState(false)

  // Novos campos para Agenda Flexível
  const [availMode, setAvailMode] = useState<'weekly' | 'date'>('weekly')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => { loadAppointments() }, [statusFilter])

  const loadAppointments = async () => {
    setLoadingApts(true)
    try {
      const params = new URLSearchParams({ perPage: '30' })
      if (statusFilter) params.set('status', statusFilter)
      const res = await fetch(`/api/appointments?${params}`, withAuth())
      const data = await res.json()
      if (data.success) setAppointments(data.data.items)
    } catch {
      toast.error('Erro ao carregar agenda')
    } finally {
      setLoadingApts(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(
        `/api/appointments/${id}`,
        withAuth({
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        })
      )
      const data = await res.json()
      if (data.success) {
        toast.success(
          status === 'CONFIRMADO' ? 'Agendamento confirmado' :
          status === 'CONCLUIDO' ? 'Agendamento concluído' : 'Agendamento cancelado'
        )
        loadAppointments()
        router.refresh() // Invalida cache do dashboard (Server Component)
      } else {
        toast.error(data.error)
      }
    } catch {
      toast.error('Erro ao atualizar')
    }
  }

  useEffect(() => {
    if (tab === 'availability') loadAvailability()
  }, [tab])

  const loadAvailability = async () => {
    setLoadingAvail(true)
    try {
      const res = await fetch('/api/availability', withAuth())
      const data = await res.json()
      if (data.success) {
        setSlots(data.data)
        if (data.timezone) setTimezone(data.timezone)
      }
    } catch {
      toast.error('Erro ao carregar disponibilidade')
    } finally {
      setLoadingAvail(false)
    }
  }

  const addSlot = (dayOfWeek?: number, date?: string) => {
    setSlots((prev) => [
      ...prev,
      { dayOfWeek, date, startTime: '09:00', endTime: '18:00', slotDuration: 60, active: true },
    ])
  }

  const removeSlot = (index: number) => {
    setSlots((prev) => prev.filter((_, i) => i !== index))
  }

  const updateSlot = (index: number, field: keyof AvailabilitySlot, value: any) => {
    setSlots((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)))
  }

  const saveAvailability = async () => {
    setSavingAvail(true)
    try {
      // Separar slots baseados no modo atual
      const body = {
        slots: availMode === 'weekly' 
          ? slots.filter(s => !s.date) 
          : slots.filter(s => s.date === selectedDate),
        timezone,
        targetDate: availMode === 'date' ? selectedDate : null
      }

      const res = await fetch(
        '/api/availability',
        withAuth({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      )
      const data = await res.json()
      if (data.success) {
        setSlots(data.data)
        if (data.timezone) setTimezone(data.timezone)
        toast.success(
          availMode === 'weekly' 
            ? 'Escala semanal salva com sucesso!' 
            : `Agenda de ${formatDateTime(selectedDate).split(' ')[0]} salva!`
        )
      } else {
        toast.error(data.error || 'Erro ao salvar')
      }
    } catch {
      toast.error('Erro de conexão')
    } finally {
      setSavingAvail(false)
    }
  }

  const statusVariant: Record<string, any> = {
    PENDENTE: 'warning', CONFIRMADO: 'success', CONCLUIDO: 'info', CANCELADO: 'danger',
  }

  const statusTabs = [
    { value: '', label: 'Todos' },
    { value: 'PENDENTE', label: 'Pendentes' },
    { value: 'CONFIRMADO', label: 'Confirmados' },
    { value: 'CONCLUIDO', label: 'Concluídos' },
    { value: 'CANCELADO', label: 'Cancelados' },
  ]

  return (
    <div className="pb-20">

      {/* Tabs principais */}
      <div className="flex gap-1 px-6 pt-4 border-b border-slate-100">
        <button
          onClick={() => setTab('appointments')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-3 transition-all duration-300 ${
            tab === 'appointments'
              ? 'border-[#0090FF] text-[#0090FF]'
              : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-t-xl'
          }`}
        >
          <CalendarDays size={16} />
          Agendamentos
        </button>
        <button
          onClick={() => setTab('availability')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-3 transition-all duration-300 ${
            tab === 'availability'
              ? 'border-[#C5A03F] text-[#C5A03F]'
              : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-t-xl'
          }`}
        >
          <Clock size={16} />
          Horários de atendimento
        </button>
      </div>

      {/* ===== TAB: AGENDAMENTOS ===== */}
      {tab === 'appointments' && (
        <div className="p-6 space-y-6">
          <div className="flex gap-2 flex-wrap bg-slate-50 p-1.5 rounded-2xl border border-slate-100 inline-flex">
            {statusTabs.map((t) => (
              <button
                key={t.value}
                onClick={() => setStatusFilter(t.value)}
                className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  statusFilter === t.value
                    ? 'bg-white text-[#0090FF] shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {t.label}
                {t.value === 'PENDENTE' && appointments.some(a => a.status === 'PENDENTE') && (
                  <span className="ml-2 bg-amber-500 text-white text-[10px] rounded-full px-1.5 py-0.5 animate-pulse">
                    {appointments.filter((a) => a.status === 'PENDENTE').length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {loadingApts ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <div className="h-10 w-10 border-4 border-blue-100 border-t-[#0090FF] rounded-full animate-spin mb-4" />
                <p className="font-medium">Carregando seus agendamentos...</p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                <CalendarDays size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-500 font-medium tracking-tight">Nenhum agendamento encontrado para este filtro.</p>
              </div>
            ) : (
              appointments.map((apt) => {
                const patientDisplayName = apt.patient.socialName || apt.patient.user.name
                const statusConfig = appointmentStatusConfig[apt.status as keyof typeof appointmentStatusConfig] || { label: apt.status, color: 'bg-slate-100 text-slate-700' }
                const avatarFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(patientDisplayName)}&background=0090FF&color=fff&size=64`

                return (
                  <div key={apt.id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
                    <div className="flex items-center gap-5">
                      <Link href={`/dashboard/terapeuta/paciente/${apt.patientId}`} className="relative shrink-0 group/avatar block transition-transform hover:scale-105 active:scale-95">
                        <Image
                          src={apt.patient.user.avatarUrl || avatarFallback}
                          alt={apt.patient.user.name}
                          width={60}
                          height={60}
                          className="rounded-2xl object-cover ring-4 ring-slate-50 group-hover:ring-blue-50 transition-all border-2 border-white shadow-sm"
                        />
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/avatar:opacity-100 rounded-2xl transition-opacity" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <Link href={`/dashboard/terapeuta/paciente/${apt.patientId}`} className="font-black text-slate-900 text-lg hover:text-[#0090FF] transition-colors">
                            {patientDisplayName}
                          </Link>
                          <Badge variant={statusVariant[apt.status]} size="sm">
                            {statusConfig.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                           <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
                             <CalendarDays size={14} className="text-[#0090FF]" />
                             {formatDateTime(apt.date)}
                           </div>
                        </div>
                        {apt.notes && (
                          <div className="mt-3 p-3 bg-slate-50 rounded-xl border-l-4 border-slate-200">
                            <p className="text-xs text-slate-500 italic font-medium leading-relaxed">"{apt.notes}"</p>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-3 flex-shrink-0">
                        <div className="text-right">
                          <p className="font-black text-slate-900 text-xl tracking-tighter">{formatCurrency(Number(apt.price))}</p>
                          {apt.therapistNet && (
                            <div className="flex items-center gap-1 justify-end mt-0.5">
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Líquido</span>
                              <p className="text-sm text-[#0090FF] font-black">{formatCurrency(Number(apt.therapistNet))}</p>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {apt.status === 'PENDENTE' && (
                            <>
                              <button 
                                onClick={() => updateStatus(apt.id, 'CONFIRMADO')}
                                className="h-9 px-4 rounded-xl bg-[#0090FF] text-white text-xs font-bold hover:bg-[#0077EE] transition-all shadow-sm flex items-center gap-2"
                              >
                                <Check size={14} /> Confirmar
                              </button>
                              <button 
                                onClick={() => updateStatus(apt.id, 'CANCELADO')}
                                className="h-9 px-4 rounded-xl bg-white border-2 border-red-100 text-red-500 text-xs font-bold hover:bg-red-50 transition-all flex items-center gap-2"
                              >
                                <XCircle size={14} /> Recusar
                              </button>
                            </>
                          )}
                          {apt.status === 'CONFIRMADO' && (
                            <button 
                              onClick={() => updateStatus(apt.id, 'CONCLUIDO')}
                              className="h-10 px-6 rounded-xl bg-white border-2 border-[#C5A03F] text-[#C5A03F] text-xs font-bold hover:bg-amber-50 transition-all flex items-center gap-2"
                            >
                              <Check size={16} className="text-[#C5A03F]" /> Concluir Sessão
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}

      {/* ===== TAB: HORÁRIOS DE ATENDIMENTO ===== */}
      {tab === 'availability' && (
        <div className="p-6 max-w-4xl space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Configuração de Horários</h2>
                <p className="text-sm text-slate-500 mt-2 font-medium max-w-md">
                  Defina sua escala padrão ou ajuste dias específicos no calendário.
                </p>
              </div>
              <Button loading={savingAvail} onClick={saveAvailability} className="bg-[#C5A03F] hover:bg-[#B48F2E] shadow-lg shadow-amber-100">
                <Save size={16} />
                Salvar Modo Atual
              </Button>
            </div>

            {/* SELETOR DE MODO */}
            <div className="flex p-1.5 bg-slate-50 rounded-2xl border border-slate-100 mb-8 w-fit">
              <button
                onClick={() => setAvailMode('weekly')}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 uppercase tracking-wider",
                  availMode === 'weekly' ? "bg-white text-[#C5A03F] shadow-sm ring-1 ring-slate-100" : "text-slate-400 hover:text-slate-600"
                )}
              >
                Escala Semanal
              </button>
              <button
                onClick={() => setAvailMode('date')}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 uppercase tracking-wider",
                  availMode === 'date' ? "bg-white text-[#0090FF] shadow-sm ring-1 ring-slate-100" : "text-slate-400 hover:text-slate-600"
                )}
              >
                Datas Específicas
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* COLUNA ESQUERDA: Configurações Gerais / Calendário */}
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest">Fuso horário</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-3 py-2 text-sm border-2 border-white rounded-xl focus:outline-none focus:border-[#0090FF] bg-white font-bold text-slate-700 shadow-sm transition-all"
                  >
                    {TIMEZONE_OPTIONS.map((tz) => (
                      <option key={tz.value} value={tz.value}>{tz.label}</option>
                    ))}
                  </select>
                </div>

                {availMode === 'date' && (
                  <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest text-center">Selecione uma Data</label>
                    <input 
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl font-black text-slate-900 text-center focus:border-[#0090FF] transition-all outline-none"
                    />
                    <div className="mt-4 p-3 bg-white/50 rounded-xl text-[10px] text-slate-400 font-medium leading-relaxed italic text-center">
                      Os horários configurados para esta data substituirão sua escala padrão para este dia.
                    </div>
                  </div>
                )}
              </div>

              {/* COLUNA DIREITA: Listagem de Slots */}
              <div className="md:col-span-2 space-y-4">
                {loadingAvail ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="h-10 w-10 border-4 border-amber-100 border-t-[#C5A03F] rounded-full animate-spin" />
                  </div>
                ) : availMode === 'weekly' ? (
                  // LISTA SEMANAL
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5, 6, 0].map((day) => {
                      const daySlots = slots
                        .map((s, i) => ({ ...s, index: i }))
                        .filter((s) => s.dayOfWeek === day && !s.date)

                      return (
                        <div key={day} className="border border-slate-100 rounded-2xl overflow-hidden bg-white">
                          <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-b border-slate-100">
                            <span className="font-bold text-slate-800 text-sm">{DAYS[day]}</span>
                            <button
                              onClick={() => addSlot(day, undefined)}
                              className="text-[10px] font-black text-[#C5A03F] hover:text-[#B48F2E] flex items-center gap-1 uppercase"
                            >
                              <Plus size={12} /> Adicionar
                            </button>
                          </div>
                          <div className="p-3">
                            {daySlots.length > 0 ? (
                              <div className="space-y-2">
                                {daySlots.map((slot) => (
                                  <SlotItem key={slot.index} slot={slot} onUpdate={updateSlot} onRemove={removeSlot} />
                                ))}
                              </div>
                            ) : (
                              <p className="text-[10px] text-slate-400 italic text-center py-2">Sem horários padrão</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  // LISTA POR DATA
                  <div className="bg-white rounded-3xl border-2 border-dashed border-blue-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                       <h3 className="font-black text-slate-900 tracking-tight">
                         Escala para: <span className="text-[#0090FF]">{formatDateTime(selectedDate).split(' ')[0]}</span>
                       </h3>
                       <button
                         onClick={() => addSlot(undefined, selectedDate)}
                         className="px-4 py-2 bg-[#0090FF] text-white rounded-xl text-xs font-bold hover:bg-blue-600 shadow-md shadow-blue-100 flex items-center gap-2"
                       >
                         <Plus size={14} /> Novo Horário
                       </button>
                    </div>

                    {slots.filter(s => s.date === selectedDate).length > 0 ? (
                      <div className="space-y-3">
                        {slots.map((s, i) => ({ ...s, index: i }))
                              .filter(s => s.date === selectedDate)
                              .map(slot => (
                                 <SlotItem key={slot.index} slot={slot} onUpdate={updateSlot} onRemove={removeSlot} />
                              ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <CalendarDays size={40} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-sm text-slate-400 font-medium">Nenhum horário exclusivo para este dia.</p>
                        <p className="text-[10px] text-slate-300 mt-1 uppercase font-bold tracking-widest">Neste caso, vale a escala semanal padrão.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SlotItem({ slot, onUpdate, onRemove }: { slot: any, onUpdate: any, onRemove: any }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all relative">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1 w-full sm:w-auto">
        <div className="flex flex-col gap-1">
          <label className="sm:hidden text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Início</label>
          <select
            value={slot.startTime}
            onChange={(e) => onUpdate(slot.index, 'startTime', e.target.value)}
            className="w-full px-3 py-2 text-xs border-2 border-white rounded-xl font-bold text-slate-700 bg-white shadow-sm focus:border-[#C5A03F] outline-none transition-all"
          >
            {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="sm:hidden text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Fim</label>
          <select
            value={slot.endTime}
            onChange={(e) => onUpdate(slot.index, 'endTime', e.target.value)}
            className="w-full px-3 py-2 text-xs border-2 border-white rounded-xl font-bold text-slate-700 bg-white shadow-sm focus:border-[#C5A03F] outline-none transition-all"
          >
            {TIME_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
          <label className="sm:hidden text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Duração da Sessão</label>
          <select
            value={slot.slotDuration}
            onChange={(e) => onUpdate(slot.index, 'slotDuration', Number(e.target.value))}
            className="w-full px-3 py-2 text-xs border-2 border-white rounded-xl font-bold text-slate-700 bg-white shadow-sm focus:border-[#C5A03F] outline-none transition-all"
          >
            {DURATION_OPTIONS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </div>
      </div>
      <button
        onClick={() => onRemove(slot.index)}
        className="absolute top-2 right-2 sm:relative sm:top-0 sm:right-0 p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
        title="Remover horário"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}

export default function TerapeutaAgendaPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 font-bold">Carregando Agenda...</div>}>
      <TerapeutaAgendaContent />
    </Suspense>
  )
}
