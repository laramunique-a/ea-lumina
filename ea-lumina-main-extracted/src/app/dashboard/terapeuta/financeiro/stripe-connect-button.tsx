'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function StripeConnectButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleConnect = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/stripe/onboard', {
        method: 'POST',
      })
      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erro ao conectar com a Stripe')
      }

      // Redireciona o usuário para o onboarding da Stripe
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleConnect} 
      disabled={isLoading}
      className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 py-6 text-lg transition-all shadow-md hover:shadow-lg"
    >
      {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
      Configurar Recebimentos Seguros
    </Button>
  )
}
