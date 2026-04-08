'use client'

import { cn } from '@/lib/utils'
import { LANGUAGE_OPTIONS } from '@/constants/languages'
import { ChevronDown, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface LanguageMultiSelectProps {
  label: string
  value: string[]
  onChange: (next: string[]) => void
  disabled?: boolean
  className?: string
}

export function LanguageMultiSelect({
  label,
  value,
  onChange,
  disabled,
  className,
}: LanguageMultiSelectProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  const toggle = (lang: string) => {
    if (disabled) return
    if (value.includes(lang)) {
      const next = value.filter((l) => l !== lang)
      onChange(next.length ? next : ['Português'])
    } else {
      onChange([...value, lang])
    }
  }

  const remove = (lang: string) => {
    if (disabled) return
    const next = value.filter((l) => l !== lang)
    onChange(next.length ? next : ['Português'])
  }

  return (
    <div ref={rootRef} className={cn('w-full space-y-1.5 relative', className)}>
      <span className="block text-xs font-semibold text-slate-700">{label}</span>

      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          'w-full min-h-[44px] flex items-center justify-between gap-2 px-3 py-2 rounded-xl border bg-white text-left text-sm transition-all duration-300',
          'border-slate-200 hover:border-[#0090FF] shadow-sm',
          'focus:outline-none focus:ring-4 focus:ring-[#0090FF]/10 focus:border-[#0090FF]',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
          {value.length === 0 ? (
            <span className="text-slate-400">Selecione os idiomas…</span>
          ) : (
            value.map((lang) => (
              <span
                key={lang}
                className="inline-flex items-center gap-1.5 max-w-full bg-blue-50 text-[#0090FF] text-[11px] font-bold px-2.5 py-1 rounded-lg border border-blue-100 shadow-sm"
              >
                <span className="truncate">{lang}</span>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation()
                    remove(lang)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      e.stopPropagation()
                      remove(lang)
                    }
                  }}
                  className="p-0.5 rounded-md hover:bg-[#0090FF] hover:text-white transition-colors text-[#0090FF]/60 shrink-0"
                  aria-label={`Remover ${lang}`}
                >
                  <X size={10} />
                </span>
              </span>
            ))
          )}
        </div>
        <ChevronDown
          size={16}
          className={cn('text-slate-400 shrink-0 transition-transform duration-300', open && 'rotate-180 text-[#0090FF]')}
        />
      </button>

      {open && (
        <div
          className="absolute z-50 left-0 right-0 mt-2 py-2 max-h-64 overflow-y-auto rounded-2xl border border-slate-100 bg-white shadow-2xl shadow-slate-200/50 animate-in fade-in zoom-in-95 duration-200"
          role="listbox"
          aria-multiselectable
        >
          {LANGUAGE_OPTIONS.map((lang) => {
            const checked = value.includes(lang)
            return (
              <label
                key={lang}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 cursor-pointer text-sm font-medium transition-all duration-200',
                  checked ? 'bg-blue-50 text-[#0090FF]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-[#0090FF] focus:ring-[#0090FF]/30 transition-all duration-200"
                  checked={checked}
                  onChange={() => toggle(lang)}
                />
                <span>{lang}</span>
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}
