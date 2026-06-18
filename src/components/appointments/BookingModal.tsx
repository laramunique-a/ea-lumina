'use client'

import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { formatCurrency, generateTimeSlots, modalityLabels } from '@/lib/utils'
import { effectiveServiceCharge } from '@/lib/therapist-pricing'
import { useEffect, useState } from 'react'
import { format, addDays, startOfDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar, Clock, ChevronLeft, ChevronRight, AlertCircle, Briefcase, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'react-hot-toast'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { getStripe } from '@/lib/stripe-client'
import { CreditCard, ShieldCheck } from 'lucide-react'

interface Availability {
  dayOfWeek?: number | null
  date?: string | null
  startTime: string
  endTime: string
  slotDuration: number
}

interface PatientPackage {
  id: string
  packageName: string
  remainingSessions: number
  therapyId: string | null
  therapistId: string
  isMultiTherapy: boolean
  allowedServices?: string[]
}

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
  currency: string
  modality: string
  packages: TherapyPackage[]
}

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  therapist: {
    id: string
    price: number | string
    user: { name: string }
    professionalName?: string | null
    availability: Availability[]
    services?: TherapistService[]
  }
  onSuccess?: () => void
  initialServiceId?: string
  initialPackageId?: string
  initialUsePackageId?: string   // ID of a PatientPackage to use existing credits
}

function CheckoutForm({ onPaymentSuccess, amount, currency }: { onPaymentSuccess: (id: string) => void, amount: number, currency: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setIsProcessing(true)
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard/paciente/agendamentos?success=true`,
      },
      redirect: 'if_required',
    })

    if (error) {
      toast.error(error.message || 'Ocorreu um erro no pagamento')
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onPaymentSuccess(paymentIntent.id)
    }
    setIsProcessing(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
        <span className="text-sm font-bold text-slate-600">Total a pagar:</span>
        <span className="text-xl font-black text-[#0090FF]">{formatCurrency(amount, currency)}</span>
      </div>
      
      <PaymentElement options={{ layout: 'tabs' }} />
      
      <div className="flex items-center gap-2 px-2 py-3 bg-blue-50/50 rounded-xl border border-blue-100 text-[#0090FF]">
        <ShieldCheck size={16} />
        <span className="text-[10px] font-black uppercase tracking-widest leading-none">Pagamento 100% Seguro via Stripe</span>
      </div>

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        loading={isProcessing}
        fullWidth
        size="lg"
        className="bg-[#0090FF] hover:bg-blue-600 shadow-lg shadow-blue-500/10"
      >
        Pagar e Agendar Agora
      </Button>
    </form>
  )
}

function MockPaymentForm({ onPaymentSuccess, amount, currency }: { onPaymentSuccess: (id: string) => void, amount: number, currency: string }) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setTimeout(() => {
      onPaymentSuccess('mock_pi_' + Math.random().toString(36).substring(7))
      setIsProcessing(false)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex flex-col gap-1">
         <div className="flex items-center gap-2">
           <AlertCircle size={16} className="text-amber-600" />
           <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Modo de Simulação</p>
         </div>
         <p className="text-xs font-bold text-amber-700">As chaves do Stripe não foram configuradas. O pagamento será simulado apenas para testes.</p>
      </div>

      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center justify-between">
        <span className="text-sm font-bold text-slate-600">Confirmação de Valor:</span>
        <span className="text-xl font-black text-[#0090FF]">{formatCurrency(amount, currency)}</span>
      </div>

      <div className="p-8 border-2 border-dashed border-slate-200 rounded-3xl text-center space-y-4">
         <CreditCard size={32} className="mx-auto text-slate-300" />
         <p className="text-sm text-slate-400 font-medium">Os dados do cartão não são necessários neste modo de teste.</p>
      </div>

      <Button
        onClick={handleSubmit}
        loading={isProcessing}
        fullWidth
        size="lg"
        className="bg-[#0090FF] hover:bg-blue-600 shadow-lg shadow-blue-500/10"
      >
        Simular Pagamento e Agendar
      </Button>
    </div>
  )
}

export function BookingModal({ 
  isOpen, 
  onClose, 
  therapist, 
  onSuccess,
  initialServiceId,
  initialPackageId,
  initialUsePackageId,
}: BookingModalProps) {
  const isMockMode = !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 
                     process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === 'pk_test_placeholder' || 
                     process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.includes('...') ||
                     (typeof window !== 'undefined' && window.location.search.includes('mockPayment=true'))

  const hasServices = therapist.services && therapist.services.length > 0
  console.log("BOOKING MODAL: therapist.services =", JSON.stringify(therapist.services))
  

  const [selectedService, setSelectedService] = useState<TherapistService | null>(null)
  const [selectedPackage, setSelectedPackage] = useState<TherapyPackage | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [userPackages, setUserPackages] = useState<PatientPackage[]>([])
  const [usePackageId, setUsePackageId] = useState<string | null>(null)
  const [fetchingPackages, setFetchingPackages] = useState(false)
  const [weekStart, setWeekStart] = useState(() => startOfDay(new Date()))
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  const hasPackages = selectedService && selectedService.packages && selectedService.packages.length > 0
  
  const steps = hasServices 
    ? (hasPackages 
        ? ['service', 'plan', 'date', 'time', 'payment', 'confirm'] 
        : ['service', 'date', 'time', 'payment', 'confirm'])
    : ['date', 'time', 'payment', 'confirm']

  // Modificação: Se estiver usando pacote, não tem passo de pagamento
  const effectiveSteps = usePackageId ? steps.filter(s => s !== 'payment') : steps

  const [step, setStep] = useState<'service' | 'plan' | 'date' | 'time' | 'payment' | 'confirm' | 'done'>(
    hasServices ? 'service' : 'date'
  )

  const daysInView = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  // Lógica de pré-seleção inicial
  useEffect(() => {
    if (isOpen) {
      setFetchingPackages(true)
      fetch('/api/patient/packages')
        .then(r => r.json())
        .then(res => {
          if (res.success) setUserPackages(res.data)
        })
        .finally(() => setFetchingPackages(false))

      // Pré-seleção por crédito de pacote já comprado ("Agendar agora" do dashboard)
      if (initialUsePackageId) {
        setUsePackageId(initialUsePackageId)
        setSelectedPackage(null)
        if (initialServiceId && therapist.services) {
          const svc = therapist.services.find(s => s.id === initialServiceId)
          if (svc) {
            setSelectedService(svc)
            setStep('date')
          } else {
            // multiTherapy: deixa paciente escolher o serviço
            setStep(therapist.services.length > 0 ? 'service' : 'date')
          }
        } else {
          setStep(therapist.services && therapist.services.length > 0 ? 'service' : 'date')
        }
      } else if (initialServiceId && therapist.services) {
        // Pré-seleção de compra de pacote
        const svc = therapist.services.find(s => s.id === initialServiceId)
        if (svc) {
          setSelectedService(svc)
          if (initialPackageId) {
            const pkg = svc.packages.find(p => p.id === initialPackageId)
            if (pkg) {
              setSelectedPackage(pkg)
              setStep('date')
            }
          }
        }
      }
    }
  }, [isOpen, initialServiceId, initialPackageId, initialUsePackageId, therapist.services])

  // Filtrar pacotes válidos para o serviço atual
  const validUserPackage = selectedService ? userPackages.find(p => 
    p.remainingSessions > 0 && 
    p.therapistId === therapist.id && 
    (
      (!p.isMultiTherapy && p.therapyId === selectedService.id) ||
      (p.isMultiTherapy && (
        !p.allowedServices || 
        p.allowedServices.length === 0 || 
        p.allowedServices.includes(selectedService.id)
      ))
    )
  ) : null

  const parsePrice = (p: any): number => {
    if (!p) return 0
    if (typeof p === 'number') return p
    if (typeof p === 'string') return parseFloat(p)
    return parseFloat(p.toString?.() || '0')
  }

  const price = usePackageId 
    ? 0 
    : selectedPackage 
    ? selectedPackage.price 
    : selectedService
    ? effectiveServiceCharge({ price: parsePrice(selectedService.price), promoPrice: parsePrice(selectedService.promoPrice) })
    : parsePrice(therapist.price)
  const durationMinutes = selectedService ? selectedService.durationMinutes : 60
  const currency = selectedService ? selectedService.currency : 'BRL'
  const modality = selectedService ? selectedService.modality : 'AMBOS'

  const getAvailableSlotsForDate = (date: Date): string[] => {
    const isoDate = format(date, 'yyyy-MM-dd')
    const dayOfWeek = date.getDay()

    let allSlots: string[] = []

    const specificAvail = therapist.availability.filter(a => a.date && a.date.split('T')[0] === isoDate)
    
    if (specificAvail.length > 0) {
      specificAvail.forEach(avail => {
        allSlots.push(...generateTimeSlots(avail.startTime, avail.endTime, avail.slotDuration))
      })
    } else {
      const weeklyAvail = therapist.availability.filter(a => a.dayOfWeek === dayOfWeek && !a.date)
      weeklyAvail.forEach(avail => {
        allSlots.push(...generateTimeSlots(avail.startTime, avail.endTime, avail.slotDuration))
      })
    }

    let uniqueSlots = Array.from(new Set(allSlots)).sort()

    // Não mostrar horários que já passaram se for hoje
    const isToday = date.toDateString() === new Date().toDateString()
    if (isToday) {
      const now = new Date()
      const currentHourStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0')
      uniqueSlots = uniqueSlots.filter(slot => slot > currentHourStr)
    }

    return uniqueSlots
  }

  const isDateAvailable = (date: Date): boolean => {
    if (date < startOfDay(new Date())) return false
    return getAvailableSlotsForDate(date).length > 0
  }

  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)

  const handleBook = async () => {
    if (!selectedDate || !selectedTime) return
    setLoading(true)

    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd')
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          therapistProfileId: therapist.id,
          date: dateStr,
          time: selectedTime,
          notes: notes || undefined,
          serviceId: selectedService?.id || undefined,
          buyPackageId: selectedPackage?.id || undefined,
          usePackageId: usePackageId || undefined,
          paymentIntentId: paymentIntentId || undefined,
        }),
      })

      const data = await res.json()
      if (!data.success) throw new Error(data.error)

      setStep('done')
      toast.success('Agendamento solicitado com sucesso!')
      onSuccess?.()
    } catch (err: any) {
      toast.error(err.message || 'Erro ao agendar')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setStep(hasServices ? 'service' : 'date')
    setSelectedService(null)
    setSelectedPackage(null)
    setUsePackageId(null)
    setSelectedDate(null)
    setSelectedTime(null)
    setNotes('')
    onClose()
  }

  const goBack = () => {
    const idx = effectiveSteps.indexOf(step)
    if (idx > 0) setStep(effectiveSteps[idx - 1] as any)
  }

  const goNext = async () => {
    const idx = effectiveSteps.indexOf(step)
    const nextStep = effectiveSteps[idx + 1]

    if (nextStep === 'payment') {
      if (isMockMode) {
        setStep('payment')
        return
      }

      setLoading(true)
      try {
        // 1. Criamos a pré-reserva (PENDENTE) no banco primeiro para ter o ID real
        const dateStr = format(selectedDate!, 'yyyy-MM-dd')
        const createRes = await fetch('/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            therapistProfileId: therapist.id,
            date: dateStr,
            time: selectedTime,
            notes: notes || undefined,
            serviceId: selectedService?.id || undefined,
            buyPackageId: selectedPackage?.id || undefined,
            usePackageId: usePackageId || undefined,
          }),
        })

        const createData = await createRes.json()
        if (!createData.success) {
          toast.error(createData.error || 'Erro ao criar pré-reserva no sistema.')
          setLoading(false)
          return
        }

        const createdAppointmentId = createData.data.id

        // 2. Acionamos o Checkout Server (Novo) referenciando este Appointment ID
        const res = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ appointmentId: createdAppointmentId })
        })
        const data = await res.json()
        if (data.success) {
          setClientSecret(data.clientSecret)
          setPaymentIntentId(data.paymentIntentId || null)
          setStep('payment')
        } else {
          toast.error(data.error || 'Erro interno preparando o cofre de pagamento')
        }
      } catch (err) {
        toast.error('Erro de conexão com nossos servidores')
      } finally {
        setLoading(false)
      }
      return
    }

    if (idx < effectiveSteps.length - 1) {
      setStep(effectiveSteps[idx + 1] as any)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Agendar sessão" size="lg">
      {step === 'done' ? (
        <div className="text-center py-6">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-blue-100 shadow-inner">
            <CheckCircle2 size={36} className="text-[#0090FF]" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Solicitação enviada!</h3>
          <p className="text-slate-500 text-sm mb-8 px-4">
            Aguarde a confirmação de <strong>{therapist.professionalName || therapist.user.name}</strong>. Você receberá uma notificação quando confirmado.
          </p>
          <Button onClick={handleClose} fullWidth size="lg">Fechar</Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Steps indicator */}
          <div className="flex items-center gap-2">
            {effectiveSteps.map((s, i) => (
              <div key={s} className="flex items-center">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300',
                    step === s ? 'bg-[#0090FF] text-white shadow-lg shadow-blue-100' :
                    step === s ? 'bg-[#0090FF] text-white shadow-lg shadow-blue-100' :
                    effectiveSteps.indexOf(step) > i ? 'bg-blue-100 text-[#0090FF]' :
                    'bg-slate-100 text-slate-400'
                  )}
                >
                  {i + 1}
                </div>
                {i < effectiveSteps.length - 1 && (
                  <div className={cn('w-8 h-0.5 mx-1 transition-colors duration-500', effectiveSteps.indexOf(step) > i ? 'bg-blue-300' : 'bg-slate-100')} />
                )}
              </div>
            ))}
          </div>

          {/* STEP: Escolher Serviço */}
          {step === 'service' && hasServices && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-6">

                  {/* Pacotes Promocionais (Destaque Principal no Topo) */}
                  {therapist.services?.some(s => (s.packages || []).length > 0) && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                       <h5 className="text-[10px] font-black text-[#C5A03F] uppercase tracking-widest mb-3 px-1 flex items-center gap-2">
                          <span className="w-2 h-2 bg-[#C5A03F] rounded-full animate-pulse" />
                          Ofertas em Destaque (Pacotes)
                       </h5>
                       <div className="space-y-3">
                          {therapist.services
                            .flatMap(s => (s.packages || []).map(p => ({ ...p, svcName: s.name, svcId: s.id })))
                            .map(pkg => (
                             <button
                                key={pkg.id}
                                onClick={() => {
                                  const anchorSvc = therapist.services?.find(s => s.id === pkg.svcId)
                                  if (anchorSvc) setSelectedService(anchorSvc)
                                  setSelectedPackage(pkg)
                                  setStep('date')
                                }}
                                className="w-full text-left p-5 rounded-2xl border-2 border-[#C5A03F]/30 bg-amber-50/20 hover:bg-amber-100/40 hover:border-[#C5A03F] transition-all group relative overflow-hidden"
                             >
                                <div className="flex justify-between items-center gap-3 relative z-10">
                                   <div>
                                      <div className="flex items-center gap-2 mb-1">
                                         <p className="text-[10px] font-bold text-[#C5A03F] uppercase tracking-tighter">{pkg.svcName}</p>
                                         <span className="text-[9px] bg-[#C5A03F] text-white px-2 py-0.5 rounded-full font-black uppercase">Promo</span>
                                      </div>
                                      <p className="font-bold text-slate-900 group-hover:text-[#C5A03F] transition-colors">{pkg.name}</p>
                                      <p className="text-[10px] text-slate-500 font-medium">
                                        {pkg.isMultiTherapy
                                          ? pkg.allowedServices && pkg.allowedServices.length > 0
                                            ? `Permite: ${pkg.allowedServices.map(id => therapist.services?.find(s => s.id === id)?.name).filter(Boolean).join(', ')}`
                                            : 'Válido para todas as terapias'
                                          : `Combo com ${pkg.sessionCount} sessões`}
                                      </p>
                                   </div>
                                   <div className="text-right">
                                      <p className="font-black text-[#C5A03F] text-xl">{formatCurrency(pkg.price)}</p>
                                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total do Pacote</p>
                                   </div>
                                </div>
                             </button>
                          ))}
                       </div>
                    </div>
                  )}

                  {/* Serviços Individuais (Standard) */}
                  <div className="pt-2 border-t border-slate-100">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Serviços Individuais</h5>
                    <div className="space-y-3">
                      {therapist.services!.map((svc) => (
                        <button
                          key={svc.id}
                          onClick={() => {
                            setSelectedService(svc)
                            const pkgCount = (svc.packages || []).length
                            const hasCredit = userPackages.some(p => 
                              p.remainingSessions > 0 && 
                              p.therapistId === therapist.id && 
                              (
                                (!p.isMultiTherapy && p.therapyId === svc.id) ||
                                (p.isMultiTherapy && (
                                  !p.allowedServices || 
                                  p.allowedServices.length === 0 || 
                                  p.allowedServices.includes(svc.id)
                                ))
                              )
                            )
                            // Só vai para 'plan' por crédito se estiver no fluxo de pacote (initialUsePackageId)
                            const shouldShowCredit = hasCredit && !!initialUsePackageId
                            if (pkgCount > 0 || shouldShowCredit) setStep('plan')
                            else setStep('date')
                          }}
                          className={cn(
                            'w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 group',
                            selectedService?.id === svc.id
                              ? 'border-[#0090FF] bg-blue-50/50 shadow-md shadow-blue-50'
                              : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                          )}
                        >
                          <div className="flex justify-between items-start gap-3">
                            <div className="flex-1">
                              <p className="font-bold text-slate-900 group-hover:text-[#0090FF] transition-colors">{svc.name}</p>
                              <p className="text-xs text-slate-500 mt-1 font-medium">
                                {svc.durationMinutes} min • {modalityLabels[svc.modality] || svc.modality}
                              </p>
                              {(svc.packages || []).length > 0 && (
                                <span className="text-[10px] bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter mt-2 inline-block">
                                  Pacotes Disponíveis (ECONOMIZE)
                                </span>
                              )}
                            </div>
                            <p className="font-extrabold text-[#0090FF] text-lg">
                              {formatCurrency(effectiveServiceCharge({ price: svc.price, promoPrice: svc.promoPrice }), svc.currency)}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
            </div>
          )}

          {/* STEP: Escolher Plano */}
          {step === 'plan' && selectedService && (
             <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <AlertCircle size={18} className="text-[#C5A03F]" />
                  Selecione como deseja pagar
                </h4>
                <div className="space-y-3">
                   {/* OPCÃO: Usar Crédito Existente */}
                   {validUserPackage && initialUsePackageId && (
                     <button
                      onClick={() => {
                        setUsePackageId(validUserPackage.id)
                        setSelectedPackage(null)
                        setStep('date')
                      }}
                      className={cn(
                        'w-full text-left p-4 rounded-2xl border-2 transition-all bg-green-50/30 border-green-100 hover:border-green-300',
                        usePackageId === validUserPackage.id ? 'border-green-500 bg-green-50' : ''
                      )}
                     >
                       <div className="flex justify-between items-center">
                          <div>
                             <div className="flex items-center gap-2">
                               <p className="font-bold text-green-900">Usar Crédito do Pacote</p>
                               <span className="text-[10px] bg-green-600 text-white px-2 py-0.5 rounded-full font-black uppercase">Disponível</span>
                             </div>
                             <p className="text-xs text-green-700 font-medium">Você possui {validUserPackage.remainingSessions} sessões restantes</p>
                          </div>
                          <p className="font-black text-green-600 text-lg uppercase tracking-widest text-right">Grátis</p>
                       </div>
                     </button>
                   )}

                   <button
                    onClick={() => {
                      setSelectedPackage(null)
                      setUsePackageId(null)
                      setStep('date')
                    }}
                    className={cn(
                      'w-full text-left p-4 rounded-2xl border-2 transition-all',
                      !selectedPackage ? 'border-[#0090FF] bg-blue-50/50' : 'border-slate-100 bg-white'
                    )}
                   >
                     <div className="flex justify-between items-center">
                        <div>
                           <p className="font-bold text-slate-900">Sessão Avulsa</p>
                           <p className="text-xs text-slate-500 font-medium">Apenas esta sessão</p>
                        </div>
                        <p className="font-bold text-slate-900 text-lg">
                          {formatCurrency(effectiveServiceCharge({ price: selectedService.price, promoPrice: selectedService.promoPrice }), currency)}
                        </p>
                     </div>
                   </button>

                   {selectedService.packages.map(pkg => (
                     <button
                      key={pkg.id}
                      onClick={() => {
                        setSelectedPackage(pkg)
                        setUsePackageId(null)
                        setStep('date')
                      }}
                      className={cn(
                        'w-full text-left p-4 rounded-2xl border-2 transition-all group',
                        selectedPackage?.id === pkg.id ? 'border-[#0090FF] bg-blue-50/50 shadow-md shadow-blue-50' : 'border-slate-100 bg-white hover:border-blue-200 hover:bg-slate-50'
                      )}
                     >
                       <div className="flex justify-between items-start">
                          <div className="flex-1">
                             <div className="flex items-center gap-2">
                               <p className="font-bold text-slate-900">{pkg.name}</p>
                               <span className="text-[10px] bg-[#C5A03F] text-white px-2 py-0.5 rounded-full font-black uppercase tracking-wider">Economize</span>
                             </div>
                             <p className="text-xs text-slate-500 mt-1 font-medium">Combo com {pkg.sessionCount} sessões</p>
                             <p className="text-[10px] text-blue-600 font-bold mt-1 uppercase tracking-tighter">SAI POR {formatCurrency(pkg.price / pkg.sessionCount, currency)} / SESSÃO</p>
                          </div>
                          <div className="text-right">
                             <p className="font-extrabold text-[#0090FF] text-xl">{formatCurrency(pkg.price, currency)}</p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-right">Total</p>
                          </div>
                       </div>
                     </button>
                   ))}
                </div>
                <div className="mt-8 flex gap-3">
                  <Button variant="outline" onClick={() => setStep('service')} className="flex-1">Voltar</Button>
                </div>
             </div>
          )}

          {/* STEP: Selecionar Data */}
          {step === 'date' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar size={18} className="text-[#0090FF]" />
                Selecione a data
              </h4>
              <div className="flex items-center justify-between mb-4 bg-slate-50 p-2 rounded-xl">
                <button
                  onClick={() => setWeekStart(addDays(weekStart, -7))}
                  disabled={weekStart <= startOfDay(new Date())}
                  className="p-2 rounded-lg hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all font-bold"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="text-sm font-bold text-slate-700">
                  {format(daysInView[0], "d MMM", { locale: ptBR })} — {format(daysInView[6], "d MMM yyyy", { locale: ptBR })}
                </span>
                <button
                  onClick={() => setWeekStart(addDays(weekStart, 7))}
                  className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {daysInView.map((date) => {
                  const available = isDateAvailable(date)
                  const selected = selectedDate?.toDateString() === date.toDateString()
                  return (
                    <button
                      key={date.toISOString()}
                      disabled={!available}
                      onClick={() => setSelectedDate(date)}
                      className={cn(
                        'flex flex-col items-center p-3 rounded-2xl text-xs transition-all duration-300',
                        available ? 'hover:bg-blue-50 cursor-pointer' : 'opacity-20 cursor-not-allowed',
                        selected ? 'bg-[#0090FF] text-white shadow-lg shadow-blue-200' : 'bg-white border border-slate-100'
                      )}
                    >
                      <span className={cn('font-bold mb-1 uppercase tracking-tighter', selected ? 'text-white' : 'text-slate-400')}>
                        {format(date, 'EEE', { locale: ptBR }).slice(0, 3)}
                      </span>
                      <span className={cn('font-extrabold text-base', selected ? 'text-white' : available ? 'text-slate-900' : 'text-slate-300')}>
                        {format(date, 'd')}
                      </span>
                    </button>
                  )
                })}
              </div>
              <div className="mt-8 flex gap-3">
                <Button variant="outline" onClick={goBack} className="flex-1">Voltar</Button>
                <Button disabled={!selectedDate} onClick={goNext} className="flex-1">Continuar</Button>
              </div>
            </div>
          )}

          {/* STEP: Selecionar Horário */}
          {step === 'time' && selectedDate && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                <Clock size={18} className="text-[#0090FF]" />
                Horários disponíveis
              </h4>
              <p className="text-sm text-slate-500 mb-6 font-medium px-1">
                {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
              </p>
              {(() => {
                const slots = getAvailableSlotsForDate(selectedDate)
                return slots.length > 0 ? (
                  <div className="grid grid-cols-4 gap-3">
                    {slots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedTime(slot)}
                        className={cn(
                          'py-3 px-2 rounded-2xl text-sm font-bold border-2 transition-all duration-300',
                          selectedTime === slot
                            ? 'bg-[#0090FF] text-white border-[#0090FF] shadow-lg shadow-blue-100'
                            : 'bg-white border-slate-100 text-slate-700 hover:border-blue-200 hover:bg-blue-50/30'
                        )}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-5 bg-amber-50 rounded-2xl text-amber-800 text-sm font-medium border border-amber-100">
                    <AlertCircle size={20} className="shrink-0" />
                    Nenhum horário disponível para esta data. Selecione outro dia.
                  </div>
                )
              })()}
              <div className="mt-8 flex gap-3">
                <Button variant="outline" onClick={goBack} className="flex-1">Voltar</Button>
                <Button disabled={!selectedTime} onClick={goNext} className="flex-1">Finalizar Reserva</Button>
              </div>
            </div>
          )}

          {step === 'payment' && (isMockMode || clientSecret) && (
             <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <CreditCard size={18} className="text-[#0090FF]" />
                  {isMockMode ? 'Simular Pagamento' : 'Pagamento Seguro'}
                </h4>
                <p className="text-xs text-slate-500 mb-6 font-medium px-1 uppercase tracking-wider">Passo final para garantir sua vaga</p>
                
                {isMockMode ? (
                  <MockPaymentForm 
                    amount={price} 
                    currency={currency} 
                    onPaymentSuccess={(id) => {
                      setPaymentIntentId(id)
                      setStep('done') // Mock bypassa diretamente para pronto
                      toast.success('Agendamento confirmado com sucesso!')
                      onSuccess?.()
                    }} 
                  />
                ) : (
                  clientSecret && (
                    <Elements stripe={getStripe()} options={{ clientSecret, locale: 'pt-BR' }}>
                      <CheckoutForm 
                        amount={price} 
                        currency={currency} 
                        onPaymentSuccess={(id) => {
                          setPaymentIntentId(id)
                          setStep('done') // Pagamento processado na Stripe
                          toast.success('Pagamento efetuado com sucesso!')
                          onSuccess?.()
                        }} 
                      />
                    </Elements>
                  )
                )}

                <Button variant="ghost" onClick={handleClose} className="w-full mt-4 text-slate-400 font-bold hover:text-slate-600">
                   Cancelar Pré-Reserva
                </Button>
             </div>
          )}

          {/* STEP: Confirmar */}
          {step === 'confirm' && selectedDate && selectedTime && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h4 className="font-bold text-slate-900 mb-4 px-1">Tudo pronto! Sua vaga está pré-reservada.</h4>
              
              <div className="bg-slate-50 rounded-[2rem] p-6 space-y-4 mb-6 border border-slate-100">
                {usePackageId ? (
                   <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50 flex flex-col gap-1">
                      <p className="text-[10px] font-black text-[#0090FF] uppercase tracking-widest">Resumo do Pagamento</p>
                      <p className="text-sm font-bold text-slate-700">Utilizando créditos de seu pacote ativo</p>
                   </div>
                ) : (paymentIntentId || clientSecret) ? (
                   <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50 flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                           {paymentIntentId?.startsWith('mock_') ? 'Pagamento Simulado' : 'Pagamento Confirmado'}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-slate-700">
                         {paymentIntentId?.startsWith('mock_') ? 'ID da transação simulada processada' : 'ID da transação processado via Stripe'}
                      </p>
                   </div>
                ) : (
                   <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100/50 flex flex-col gap-1">
                      <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Pagamento Pendente</p>
                      <p className="text-sm font-bold text-slate-700">Aguardando processamento</p>
                   </div>
                )}

                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Terapeuta</span>
                    <span className="font-bold text-slate-900">{therapist.user.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Data e Hora</span>
                    <div className="text-right">
                      <p className="font-bold text-slate-900 leading-none">{format(selectedDate, "d 'de' MMMM", { locale: ptBR })}</p>
                      <p className="text-[11px] text-[#0090FF] font-black mt-1">{selectedTime}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block px-1">Informações importantes (opcional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Alguma informação importante para a primeira sessão?"
                  rows={2}
                  className="w-full px-5 py-4 text-sm border border-slate-100 rounded-2xl focus:outline-none focus:border-blue-200 focus:bg-blue-50/10 transition-all resize-none font-medium"
                />
              </div>

              <div className="flex flex-col gap-3">
                <Button loading={loading} onClick={handleBook} fullWidth size="lg" className="bg-[#0090FF] hover:bg-[#0077EE] shadow-lg shadow-blue-100 rounded-[1.5rem]">
                   Finalizar Agendamento
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}
