'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Loader2, ExternalLink } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function StripeDashboardButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleDashboard = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/stripe/dashboard', {
        method: 'POST',
      })
      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erro ao gerar link de acesso à Stripe')
      }

      if (data.url) {
        window.open(data.url, '_blank')
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleDashboard} 
      disabled={isLoading}
      variant="outline"
      className="bg-white hover:bg-teal-50 text-teal-800 border-teal-200 rounded-full px-6 py-2 transition-all shadow-sm"
    >
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ExternalLink className="mr-2 h-4 w-4" />}
      Acessar Painel Stripe Express
    </Button>
  )
}
