'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

interface PendingApprovalsAlertProps {
  initialCount: number
}

export function PendingApprovalsAlert({ initialCount }: PendingApprovalsAlertProps) {
  const [count, setCount] = useState(initialCount)

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch('/api/admin/dashboard')
        const data = await res.json()
        if (data.success && typeof data.data?.pendingApprovals === 'number') {
          setCount(data.data.pendingApprovals)
        }
      } catch (err) {
        console.error('Error fetching pending approvals count:', err)
      }
    }

    // Polling a cada 5 segundos
    const interval = setInterval(fetchCount, 5000)
    return () => clearInterval(interval)
  }, [])

  if (count <= 0) return null

  return (
    <Link href="/dashboard/admin/therapists" className="block">
      <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 hover:bg-amber-100 transition-colors">
        <AlertCircle size={18} className="text-amber-600 flex-shrink-0" />
        <p className="text-sm font-medium">
          {count} terapeuta{count > 1 ? 's' : ''} aguardando aprovação.
          <span className="underline ml-1">Revisar agora →</span>
        </p>
      </div>
    </Link>
  )
}
