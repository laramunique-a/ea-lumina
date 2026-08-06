'use client'

import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { getStripe } from '@/lib/stripe-client'
import { toast } from 'react-hot-toast'
import { ShieldCheck, CreditCard, AlertCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface ResumePaymentModalProps {
  appointment: {
    id: string
    price: number
    currency?: string
    therapist: { user: { name: string }; professionalName?: string | null }
  }
  onClose: () => void
  onSuccess: () => void
}

function PaymentForm({ onSuccess, amount, currency }: { onSuccess: () => void; amount: number; currency: string }) {
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
    } else if (paymentIntent?.status === 'succeeded') {
      toast.success('Pagamento confirmado com sucesso!')
      onSuccess()
    }
    setIsProcessing(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
        <span className="text-sm font-bold text-slate-600">Total a pagar:</span>
        <span className="text-xl font-black text-[#0090FF]">{formatCurrency(amount, currency)}</span>
      </div>
      <PaymentElement options={{ layout: 'tabs' }} />
      <div className="flex items-center gap-2 px-3 py-2.5 bg-blue-50/50 rounded-xl border border-blue-100 text-[#0090FF]">
        <ShieldCheck size={15} />
        <span className="text-[10px] font-black uppercase tracking-widest leading-none">Pagamento 100% Seguro via Stripe</span>
      </div>
      <Button type="submit" disabled={!stripe || isProcessing} loading={isProcessing} fullWidth size="lg" className="bg-[#0090FF] hover:bg-blue-600 shadow-lg shadow-blue-500/10">
        Confirmar Pagamento
      </Button>
    </form>
  )
}

export function ResumePaymentModal({ appointment, onClose, onSuccess }: ResumePaymentModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const therapistName = appointment.therapist.professionalName || appointment.therapist.user.name

  useEffect(() => {
    const fetchClientSecret = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ appointmentId: appointment.id }),
        })
        const data = await res.json()
        if (data.success && data.clientSecret) {
          setClientSecret(data.clientSecret)
        } else {
          setError(data.error || 'Nao foi possivel carregar o formulario de pagamento.')
        }
      } catch {
        setError('Erro de conexao. Tente novamente.')
      } finally {
        setLoading(false)
      }
    }
    fetchClientSecret()
  }, [appointment.id])

  return (
    <Modal isOpen onClose={onClose} title="Concluir Pagamento" size="md">
      <div className="space-y-5">
        <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <CreditCard size={20} className="text-[#0090FF] shrink-0" />
          <div>
            <p className="text-sm font-bold text-slate-900">{therapistName}</p>
            <p className="text-xs text-slate-500 font-medium">Consulta aguardando pagamento</p>
          </div>
        </div>

        {loading && (
          <div className="text-center py-8 text-slate-400 text-sm font-medium">
            Carregando formulario de pagamento...
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 bg-red-50 p-4 rounded-2xl border border-red-100">
            <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-700">{error}</p>
              <Button size="sm" variant="outline" className="mt-3 text-red-600 border-red-200 hover:bg-red-50" onClick={onClose}>
                Fechar
              </Button>
            </div>
          </div>
        )}

        {clientSecret && !loading && !error && (
          <Elements stripe={getStripe()} options={{ clientSecret, locale: 'pt-BR' }}>
            <PaymentForm amount={appointment.price} currency={appointment.currency || 'BRL'} onSuccess={onSuccess} />
          </Elements>
        )}
      </div>
    </Modal>
  )
}
