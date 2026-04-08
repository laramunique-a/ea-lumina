'use client'

import { cn } from '@/lib/utils'
import { SlidersHorizontal, X, ChevronDown, Star } from 'lucide-react'
import { useEffect, useState } from 'react'

const RATING_OPTIONS = [
  { label: '4.5+', value: 4.5 },
  { label: '4.0+', value: 4.0 },
  { label: '3.5+', value: 3.5 },
]

export interface SearchFiltersValues {
  therapies: string[]
  modality: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  city?: string
}

interface SearchFiltersProps {
  values: SearchFiltersValues
  onChange: (values: SearchFiltersValues) => void
  onReset: () => void
  therapyOptions?: string[]
  className?: string
}

export function SearchFilters({ values, onChange, onReset, therapyOptions = [], className }: SearchFiltersProps) {
  const [openSection, setOpenSection] = useState<string | null>('therapies')

  const toggleSection = (section: string) =>
    setOpenSection(openSection === section ? null : section)

  const toggleTherapy = (therapy: string) => {
    const updated = values.therapies.includes(therapy)
      ? values.therapies.filter((t) => t !== therapy)
      : [...values.therapies, therapy]
    onChange({ ...values, therapies: updated })
  }

  const activeCount = [
    values.therapies.length > 0,
    values.modality !== '',
    values.minPrice !== undefined || values.maxPrice !== undefined,
    values.minRating !== undefined,
    !!values.city,
  ].filter(Boolean).length

  return (
    <aside className={cn('bg-white rounded-[2rem] border border-slate-100/60 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-[#0090FF]" />
          <span className="font-bold text-slate-800 text-sm tracking-wide">Filtros</span>
          {activeCount > 0 && (
            <span className="w-5 h-5 bg-[#C5A03F] text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-sm">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors font-medium"
          >
            <X size={12} />
            Limpar
          </button>
        )}
      </div>

      {/* Tipo de terapia */}
      <FilterSection
        title="Tipo de terapia"
        isOpen={openSection === 'therapies'}
        onToggle={() => toggleSection('therapies')}
        count={values.therapies.length > 0 ? values.therapies.length : undefined}
      >
        <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
          {therapyOptions.length === 0 && (
            <p className="text-xs text-slate-400 py-1">Carregando terapias…</p>
          )}
          {therapyOptions.map((therapy) => {
            const checked = values.therapies.includes(therapy)
            return (
              <label key={therapy} className="flex items-center gap-3 cursor-pointer group py-0.5">
                <div className={cn(
                  'w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all duration-150',
                  checked ? 'bg-[#0090FF] border-[#0090FF]' : 'border-slate-300 group-hover:border-[#0090FF]'
                )}>
                  {checked && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggleTherapy(therapy)} />
                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors select-none">
                  {therapy}
                </span>
              </label>
            )
          })}
        </div>
      </FilterSection>

      {/* Modalidade */}
      <FilterSection
        title="Modalidade"
        isOpen={openSection === 'modality'}
        onToggle={() => toggleSection('modality')}
      >
        <div className="flex flex-col gap-1.5">
          {[
            { label: 'Todas', value: '' },
            { label: 'Online', value: 'ONLINE' },
            { label: 'Presencial', value: 'PRESENCIAL' },
          ].map((opt) => {
            const selected = values.modality === opt.value
            return (
              <label key={opt.value} className="flex items-center gap-3 cursor-pointer group py-0.5">
                <div className={cn(
                  'w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-150',
                  selected ? 'border-[#0090FF]' : 'border-slate-300 group-hover:border-[#0090FF]/50'
                )}>
                  {selected && <div className="w-2 h-2 rounded-full bg-[#0090FF]" />}
                </div>
                <input
                  type="radio"
                  className="sr-only"
                  name="modality"
                  value={opt.value}
                  checked={selected}
                  onChange={() => onChange({ ...values, modality: opt.value })}
                />
                <span className="text-sm text-slate-600 group-hover:text-slate-900 select-none">{opt.label}</span>
              </label>
            )
          })}
        </div>
      </FilterSection>

      {/* Faixa de preço */}
      <FilterSection
        title="Faixa de preço"
        isOpen={openSection === 'price'}
        onToggle={() => toggleSection('price')}
      >
        <div className="flex gap-3">
          <div className="flex-1">
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1.5">Mínimo</p>
            <input
              type="number"
              placeholder="R$ 0"
              value={values.minPrice || ''}
              onChange={(e) => onChange({ ...values, minPrice: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0090FF]/10 focus:border-[#0090FF] bg-slate-50"
            />
          </div>
          <div className="flex-1">
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1.5">Máximo</p>
            <input
              type="number"
              placeholder="R$ 500"
              value={values.maxPrice || ''}
              onChange={(e) => onChange({ ...values, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0090FF]/10 focus:border-[#0090FF] bg-slate-50"
            />
          </div>
        </div>
      </FilterSection>

      {/* Avaliação */}
      <FilterSection
        title="Avaliação mínima"
        isOpen={openSection === 'rating'}
        onToggle={() => toggleSection('rating')}
      >
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-3 cursor-pointer group py-0.5">
            <div className={cn(
              'w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
              values.minRating === undefined ? 'border-[#0090FF]' : 'border-slate-300 group-hover:border-[#0090FF]/50'
            )}>
              {values.minRating === undefined && <div className="w-2 h-2 rounded-full bg-[#0090FF]" />}
            </div>
            <input type="radio" className="sr-only" checked={values.minRating === undefined} onChange={() => onChange({ ...values, minRating: undefined })} />
            <span className="text-sm text-slate-600 select-none">Todas</span>
          </label>
          {RATING_OPTIONS.map((opt) => {
            const selected = values.minRating === opt.value
            return (
              <label key={opt.value} className="flex items-center gap-3 cursor-pointer group py-0.5">
                <div className={cn(
                  'w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
                  selected ? 'border-[#0090FF]' : 'border-slate-300 group-hover:border-[#0090FF]/50'
                )}>
                  {selected && <div className="w-2 h-2 rounded-full bg-[#0090FF]" />}
                </div>
                <input type="radio" className="sr-only" checked={selected} onChange={() => onChange({ ...values, minRating: opt.value })} />
                <span className="text-sm text-slate-600 select-none flex items-center gap-1">
                  {Array.from({ length: Math.floor(opt.value) }).map((_, i) => (
                    <Star key={i} size={10} className="fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-1 text-slate-400">{opt.label}</span>
                </span>
              </label>
            )
          })}
        </div>
      </FilterSection>

      {/* Cidade */}
      <FilterSection
        title="Cidade"
        isOpen={openSection === 'city'}
        onToggle={() => toggleSection('city')}
      >
        <input
          type="text"
          placeholder="Ex: São Paulo"
          value={values.city || ''}
          onChange={(e) => onChange({ ...values, city: e.target.value || undefined })}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0090FF]/10 focus:border-[#0090FF] bg-slate-50"
        />
      </FilterSection>
    </aside>
  )
}

function FilterSection({
  title, isOpen, onToggle, children, count,
}: {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
  count?: number
}) {
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full px-6 py-4 text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-slate-700">{title}</span>
          {count !== undefined && (
            <span className="w-5 h-5 bg-[#C5A03F] text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-sm">
              {count}
            </span>
          )}
        </div>
        <ChevronDown
          size={13}
          className={cn('text-slate-400 transition-transform duration-200', isOpen && 'rotate-180')}
        />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  )
}
