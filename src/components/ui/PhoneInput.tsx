'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown, Search } from 'lucide-react'

const COUNTRY_CODES = [
  { code: '+55',  flag: '🇧🇷', name: 'Brasil',         hasDDD: true  },
  { code: '+351', flag: '🇵🇹', name: 'Portugal',        hasDDD: false },
  { code: '+1',   flag: '🇺🇸', name: 'EUA',             hasDDD: false },
  { code: '+1',   flag: '🇨🇦', name: 'Canadá',          hasDDD: false },
  { code: '+44',  flag: '🇬🇧', name: 'Reino Unido',     hasDDD: false },
  { code: '+34',  flag: '🇪🇸', name: 'Espanha',         hasDDD: false },
  { code: '+33',  flag: '🇫🇷', name: 'França',          hasDDD: false },
  { code: '+49',  flag: '🇩🇪', name: 'Alemanha',        hasDDD: false },
  { code: '+39',  flag: '🇮🇹', name: 'Itália',          hasDDD: false },
  { code: '+41',  flag: '🇨🇭', name: 'Suíça',           hasDDD: false },
  { code: '+32',  flag: '🇧🇪', name: 'Bélgica',         hasDDD: false },
  { code: '+31',  flag: '🇳🇱', name: 'Holanda',         hasDDD: false },
  { code: '+43',  flag: '🇦🇹', name: 'Áustria',         hasDDD: false },
  { code: '+353', flag: '🇮🇪', name: 'Irlanda',         hasDDD: false },
  { code: '+46',  flag: '🇸🇪', name: 'Suécia',          hasDDD: false },
  { code: '+47',  flag: '🇳🇴', name: 'Noruega',         hasDDD: false },
  { code: '+45',  flag: '🇩🇰', name: 'Dinamarca',       hasDDD: false },
  { code: '+358', flag: '🇫🇮', name: 'Finlândia',       hasDDD: false },
  { code: '+48',  flag: '🇵🇱', name: 'Polônia',         hasDDD: false },
  { code: '+420', flag: '🇨🇿', name: 'República Tcheca', hasDDD: false },
  { code: '+36',  flag: '🇭🇺', name: 'Hungria',         hasDDD: false },
  { code: '+30',  flag: '🇬🇷', name: 'Grécia',          hasDDD: false },
  { code: '+40',  flag: '🇷🇴', name: 'Romênia',         hasDDD: false },
  { code: '+352', flag: '🇱🇺', name: 'Luxemburgo',      hasDDD: false },
  { code: '+354', flag: '🇮🇸', name: 'Islândia',        hasDDD: false },
  { code: '+356', flag: '🇲🇹', name: 'Malta',           hasDDD: false },
  { code: '+357', flag: '🇨🇾', name: 'Chipre',           hasDDD: false },
  { code: '+380', flag: '🇺🇦', name: 'Ucrânia',         hasDDD: false },
  { code: '+370', flag: '🇱🇹', name: 'Lituânia',        hasDDD: false },
  { code: '+371', flag: '🇱🇻', name: 'Letônia',         hasDDD: false },
  { code: '+372', flag: '🇪🇪', name: 'Estônia',         hasDDD: false },
  { code: '+385', flag: '🇭🇷', name: 'Croácia',         hasDDD: false },
  { code: '+386', flag: '🇸🇮', name: 'Eslovênia',       hasDDD: false },
  { code: '+381', flag: '🇷🇸', name: 'Sérvia',          hasDDD: false },
  { code: '+359', flag: '🇧🇬', name: 'Bulgária',        hasDDD: false },
  { code: '+421', flag: '🇸🇰', name: 'Eslováquia',      hasDDD: false },
  { code: '+90',  flag: '🇹🇷', name: 'Turquia',          hasDDD: false },
  { code: '+54',  flag: '🇦🇷', name: 'Argentina',       hasDDD: false },
  { code: '+598', flag: '🇺🇾', name: 'Uruguai',         hasDDD: false },
  { code: '+595', flag: '🇵🇾', name: 'Paraguai',        hasDDD: false },
  { code: '+591', flag: '🇧🇴', name: 'Bolívia',         hasDDD: false },
  { code: '+56',  flag: '🇨🇱', name: 'Chile',           hasDDD: false },
  { code: '+57',  flag: '🇨🇴', name: 'Colômbia',        hasDDD: false },
  { code: '+51',  flag: '🇵🇪', name: 'Peru',            hasDDD: false },
  { code: '+58',  flag: '🇻🇪', name: 'Venezuela',       hasDDD: false },
  { code: '+593', flag: '🇪🇨', name: 'Equador',         hasDDD: false },
  { code: '+52',  flag: '🇲🇽', name: 'México',          hasDDD: false },
  { code: '+81',  flag: '🇯🇵', name: 'Japão',           hasDDD: false },
  { code: '+82',  flag: '🇰🇷', name: 'Coreia do Sul',   hasDDD: false },
  { code: '+86',  flag: '🇨🇳', name: 'China',           hasDDD: false },
  { code: '+91',  flag: '🇮🇳', name: 'Índia',           hasDDD: false },
  { code: '+61',  flag: '🇦🇺', name: 'Austrália',       hasDDD: false },
  { code: '+64',  flag: '🇳🇿', name: 'Nova Zelândia',   hasDDD: false },
  { code: '+27',  flag: '🇿🇦', name: 'África do Sul',   hasDDD: false },
  { code: '+20',  flag: '🇪🇬', name: 'Egito',           hasDDD: false },
  { code: '+212', flag: '🇲🇦', name: 'Marrocos',        hasDDD: false },
  { code: '+244', flag: '🇦🇴', name: 'Angola',          hasDDD: false },
  { code: '+238', flag: '🇨🇻', name: 'Cabo Verde',      hasDDD: false },
  { code: '+258', flag: '🇲🇿', name: 'Moçambique',      hasDDD: false },
  { code: '+245', flag: '🇬🇼', name: 'Guiné-Bissau',    hasDDD: false },
  { code: '+239', flag: '🇸🇹', name: 'São Tomé e Príncipe', hasDDD: false },
  { code: '+670', flag: '🇹🇱', name: 'Timor-Leste',      hasDDD: false },
  { code: '+971', flag: '🇦🇪', name: 'Emirados Árabes', hasDDD: false },
  { code: '+972', flag: '🇮🇱', name: 'Israel',          hasDDD: false },
]

const SORTED_COUNTRY_CODES = [
  ...COUNTRY_CODES.filter(c => ['Brasil', 'Portugal'].includes(c.name)).sort((a, b) => a.name.localeCompare(b.name)),
  ...COUNTRY_CODES.filter(c => !['Brasil', 'Portugal'].includes(c.name)).sort((a, b) => a.name.localeCompare(b.name))
]

const BR_DDD_LIST = [
  '11','12','13','14','15','16','17','18','19', '21','22','24', '27','28', '31','32','33','34','35','37','38',
  '41','42','43','44','45','46', '47','48','49', '51','53','54','55', '61', '62','64', '63', '65','66', '67',
  '68', '69', '71','73','74','75','77', '79', '81','87', '82', '83', '84', '85','88', '86','89', '91','93','94',
  '92','97', '95', '96', '98','99'
]

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  label?: string
  hint?: string
  className?: string
}

function parsePhone(full: string) {
  if (!full) return { ddi: '+55', ddd: '', number: '' }
  const sorted = [...COUNTRY_CODES].sort((a, b) => b.code.length - a.code.length)
  for (const c of sorted) {
    if (full.startsWith(c.code)) {
      const rest = full.slice(c.code.length)
      if (c.hasDDD && rest.length >= 2) {
        return { ddi: c.code, ddd: rest.slice(0, 2), number: rest.slice(2) }
      }
      return { ddi: c.code, ddd: '', number: rest }
    }
  }
  return { ddi: '+55', ddd: '', number: full }
}

export function PhoneInput({ value, onChange, label, hint, className }: PhoneInputProps) {
  const parsed = parsePhone(value)
  const [ddi, setDdi] = useState(parsed.ddi)
  const [ddd, setDdd] = useState(parsed.ddd)
  const [number, setNumber] = useState(parsed.number)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedCountry = COUNTRY_CODES.find((c) => c.code === ddi) ?? COUNTRY_CODES[0]

  useEffect(() => {
    const assembled = ddi + (selectedCountry.hasDDD ? ddd : '') + number
    if (assembled !== value) onChange(assembled)
  }, [ddi, ddd, number, onChange, selectedCountry.hasDDD, value])

  useEffect(() => {
    if (!value) return
    const p = parsePhone(value)
    setDdi(p.ddi)
    setDdd(p.ddd)
    setNumber(p.number)
  }, [value])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredCountries = useMemo(() => {
    return SORTED_COUNTRY_CODES.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) || 
      c.code.includes(search)
    )
  }, [search])

  const inputClass = 'px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0090FF]/20 focus:border-[#0090FF] bg-white transition-all duration-200 placeholder:text-slate-400 text-slate-900'
  
  // Extraímos as classes de estilo (bg, border, rounded) da className externa
  // para aplicar diretamente nos botões/inputs, garantindo consistência.
  const finalInputClass = cn(inputClass, className)

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="flex gap-2 relative">
        {/* Custom DDI Dropdown */}
        <div className="relative flex-shrink-0" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className={cn(
              finalInputClass, 
              'w-[120px] flex items-center justify-between gap-1 cursor-pointer hover:border-slate-300',
              open && 'ring-2 ring-[#0090FF]/20 border-[#0090FF] bg-white'
            )}
          >
            <span className="flex items-center gap-1.5 truncate">
              <span className="text-base leading-none">{selectedCountry.flag}</span>
              <span className="font-bold text-slate-700">{selectedCountry.code}</span>
            </span>
            <ChevronDown size={14} className={cn('text-slate-400 transition-transform duration-200', open && 'rotate-180')} />
          </button>

          {open && (
            <div className="absolute z-[100] mt-2 w-72 bg-white border border-slate-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,144,255,0.2)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {/* Search */}
              <div className="p-3 border-b border-slate-50 flex items-center gap-2 bg-slate-50/50">
                <Search size={14} className="text-slate-400 ml-1" />
                <input 
                  autoFocus
                  placeholder="Buscar país ou código..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent border-none text-sm focus:ring-0 placeholder:text-slate-400 p-0"
                />
              </div>
              
              {/* List */}
              <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                {filteredCountries.map((c, idx) => (
                  <button
                    key={`${c.code}-${c.name}-${idx}`}
                    type="button"
                    onClick={() => {
                      setDdi(c.code)
                      setDdd('')
                      setNumber('')
                      setOpen(false)
                      setSearch('')
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 text-left text-sm hover:bg-blue-50/50 transition-colors",
                      ddi === c.code && c.name === selectedCountry.name && "bg-blue-50 text-[#0090FF]"
                    )}
                  >
                    <span className="text-xl shrink-0 leading-none">{c.flag}</span>
                    <span className="flex-1 truncate font-medium text-slate-700">{c.name}</span>
                    <span className="text-slate-400 font-bold text-xs">{c.code}</span>
                  </button>
                ))}
                {filteredCountries.length === 0 && (
                  <div className="p-8 text-center text-xs text-slate-400">
                    Nenhum país encontrado
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* DDD — apenas para Brasil */}
        {selectedCountry.hasDDD && (
          <div className="relative flex-shrink-0">
            <select
              value={ddd}
              onChange={(e) => setDdd(e.target.value)}
              className={cn(finalInputClass, 'w-[95px] cursor-pointer appearance-none pr-8 hover:border-slate-300')}
            >
              <option value="">DDD</option>
              {BR_DDD_LIST.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        )}

        {/* Número */}
        <input
          type="tel"
          value={number}
          onChange={(e) => setNumber(e.target.value.replace(/\D/g, ''))}
          placeholder={selectedCountry.hasDDD ? '99999-9999' : 'número'}
          className={cn(finalInputClass, 'flex-1 min-w-0 hover:border-slate-300')}
          maxLength={11}
        />
      </div>
      {hint && <p className="text-[11px] text-slate-400 font-medium pl-1">{hint}</p>}
    </div>
  )
}
