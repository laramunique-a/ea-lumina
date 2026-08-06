'use client'

import { cn } from '@/lib/utils'

import Link from 'next/link'

interface StatCardProps {
  title: string
  value: React.ReactNode
  description?: string
  icon: React.ReactNode
  trend?: { value: number; positive: boolean }
  color?: 'teal' | 'purple' | 'blue' | 'gold'
  href?: string
}

const colorStyles = {
  teal:   { bg: 'bg-blue-50',   icon: 'text-[#0090FF]',  accent: 'text-[#0090FF]' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600', accent: 'text-purple-600' },
  blue:   { bg: 'bg-blue-100',  icon: 'text-[#0090FF]',  accent: 'text-[#0090FF]' },
  gold:   { bg: 'bg-amber-50',  icon: 'text-[#C5A03F]',  accent: 'text-[#C5A03F]' },
}

export function StatCard({ title, value, description, icon, trend, color = 'teal', href }: StatCardProps) {
  const styles = colorStyles[color]

  const Content = (
    <div className={cn(
      "bg-white rounded-[2rem] border border-slate-100 p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.04)] hover:shadow-md transition-all duration-300 group h-full flex flex-col justify-between",
      href && "cursor-pointer hover:border-[#0090FF]/30"
    )}>
      <div>
        <div className="flex items-start justify-between mb-3">
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest leading-snug">
            {title}
          </p>
          <div className={cn("p-2 rounded-xl transition-transform group-hover:scale-105 duration-500", styles.bg)}>
            <span className={styles.icon}>{icon}</span>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <div className="text-xl font-semibold text-slate-800 tracking-tight">{value}</div>
          {trend && (
              <span className={cn("text-[9px] font-semibold px-2 py-0.5 rounded-full", trend.positive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600")}>
                  {trend.positive ? '+' : ''}{trend.value}%
              </span>
          )}
        </div>
      </div>
      {description && <p className="text-[10px] text-slate-400 mt-3 font-normal">{description}</p>}
    </div>
  )

  if (href) {
    return <Link href={href} className="block h-full">{Content}</Link>
  }

  return Content
}
