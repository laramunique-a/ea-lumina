'use client'

import { Bell } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/Avatar'

interface HeaderProps {
  title?: string
  description?: string
  userName?: string
  userRole?: string
  avatarUrl?: string | null
}

const roleConfig: Record<string, { label: string; dot: string }> = {
  ADMIN:     { label: 'Admin',     dot: 'bg-indigo-500' },
  TERAPEUTA: { label: 'Terapeuta', dot: 'bg-[#C5A03F]' },
  PACIENTE:  { label: 'Paciente',  dot: 'bg-blue-500' },
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

export function Header({ userName, userRole = 'PACIENTE', avatarUrl }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Bem-vinda ao EA Lumina!', message: 'Seu perfil foi configurado com sucesso.', time: 'Agora' },
    { id: '2', title: 'Dica de Hoje', message: 'Lembre-se de beber água e meditar por 5 minutos.', time: '2h atrás' },
  ])
  const notifRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotifications])

  const clearNotifications = () => {
    setNotifications([])
    setShowNotifications(false)
  }

  const role = roleConfig[userRole] || roleConfig.PACIENTE

  return (
    <header className="h-16 shrink-0 bg-white/95 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-40 transition-all">
      <div className="flex items-center gap-4 flex-1">
        {/* Saudação do Usuário (Canto Esquerdo) */}
        {userName && (
          <div className="flex items-center gap-3">
            <Avatar src={avatarUrl} alt={userName} size="md" className="border-2 border-slate-50 ring-2 ring-white shadow-sm" />
            <div className="text-left">
              <p suppressHydrationWarning className="text-[15px] font-semibold text-slate-900 leading-tight tracking-tight">
                {getGreeting()}, {userName}!
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Notificações */}
        <div className="relative" ref={notifRef}>
          <button
            aria-label="Notificações"
            onClick={() => setShowNotifications(!showNotifications)}
            className={cn(
              "relative p-2 rounded-xl transition-all duration-300",
              showNotifications ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <Bell size={18} />
            {notifications.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#0090FF] rounded-full ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100 z-20 overflow-hidden animate-in fade-in zoom-in duration-300 origin-top-right">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">Notificações</span>
                 <span className="text-[10px] bg-blue-50 text-[#0090FF] px-2 py-0.5 rounded-full font-bold">
                   {notifications.length} Novas
                 </span>
              </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-5 py-10 text-center text-slate-400">
                      <Bell size={24} className="mx-auto mb-2 opacity-10" />
                      <p className="text-sm font-medium">Tudo limpo por aqui</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="px-5 py-4 border-b border-slate-50 hover:bg-slate-50 transition-all cursor-pointer group">
                        <p className="text-xs font-bold text-slate-900 group-hover:text-[#0090FF] transition-colors">{n.title}</p>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{n.message}</p>
                        <p className="text-[10px] text-slate-400 mt-2 font-medium">{n.time}</p>
                      </div>
                    ))
                  )}
                </div>
                {notifications.length > 0 && (
                  <button 
                    onClick={clearNotifications}
                    className="w-full py-3 text-[11px] font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all border-t border-slate-100 bg-white uppercase tracking-widest"
                  >
                    Limpar notificações
                  </button>
                )}
              </div>
          )}
        </div>
      </div>
    </header>
  )
}
