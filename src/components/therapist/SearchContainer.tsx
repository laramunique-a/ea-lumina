'use client'

import { Header } from '@/components/dashboard/Header'
import { TherapistCard } from '@/components/therapist/TherapistCard'
import { SearchFilters, SearchFiltersValues } from '@/components/therapist/SearchFilters'
import { BookingModal } from '@/components/appointments/BookingModal'
import { Input } from '@/components/ui/Input'
import { SkeletonCard } from '@/components/ui/LoadingSpinner'
import { Search, LayoutGrid, List, SlidersHorizontal, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

const DEFAULT_FILTERS: SearchFiltersValues = {
  therapies: [],
  modality: '',
}

interface TherapyPackage {
  id: string
  name: string
  sessionCount: number
  price: number
  expirationDays?: number | null
  isMultiTherapy?: boolean
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

interface Therapist {
  id: string
  therapies: string[]
  price: number
  profilePrice?: number
  modality: string
  location: string | null
  city: string | null
  state: string | null
  rating: number
  reviewCount: number
  bio: string | null
  yearsExp: number | null
  featured: boolean
  approved: boolean
  availability: any[]
  services?: TherapistService[]
  user: { id: string; name: string; avatarUrl: string | null }
}

interface SearchContainerProps {
  initialTherapyOptions: string[]
}

export function SearchContainer({ initialTherapyOptions }: SearchContainerProps) {
  const [therapists, setTherapists] = useState<Therapist[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<SearchFiltersValues>(DEFAULT_FILTERS)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [filterOpen, setFilterOpen] = useState(false)
  const [bookingTherapist, setBookingTherapist] = useState<Therapist | null>(null)
  const router = useRouter()

  const activeFilterCount = [
    filters.therapies.length > 0,
    filters.modality !== '',
    filters.minPrice !== undefined || filters.maxPrice !== undefined,
    filters.minRating !== undefined,
    !!filters.city,
  ].filter(Boolean).length

  const fetchTherapists = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), perPage: '12' })
      if (search) params.set('search', search)
      if (filters.modality) params.set('modality', filters.modality)
      if (filters.therapies.length === 1) params.set('therapy', filters.therapies[0])
      if (filters.minPrice) params.set('minPrice', String(filters.minPrice))
      if (filters.maxPrice) params.set('maxPrice', String(filters.maxPrice))
      if (filters.minRating) params.set('minRating', String(filters.minRating))
      if (filters.city) params.set('city', filters.city)

      const res = await fetch(`/api/therapists?${params}`)
      const data = await res.json()
      if (data.success) {
        setTherapists(data.data.items)
        setTotal(data.data.total)
      }
    } catch {
      toast.error('Erro ao buscar terapeutas')
    } finally {
      setLoading(false)
    }
  }, [search, filters, page])

  useEffect(() => {
    const debounce = setTimeout(fetchTherapists, 300)
    return () => clearTimeout(debounce)
  }, [fetchTherapists])

  const handleBook = (therapistId: string) => {
    const t = therapists.find((t) => t.id === therapistId)
    if (t) setBookingTherapist(t)
  }

  const handleViewProfile = (therapistId: string) => {
    router.push(`/dashboard/paciente/terapeuta/${therapistId}`)
  }

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS)
    setPage(1)
  }

  return (
    <div className="flex flex-col min-h-full pb-12">
      
      {/* ── Hero Search (Topo abrangendo tudo) ───────────────────── */}
      <div className="px-6 sm:px-8 lg:px-12 pt-6 pb-4 border-b border-slate-100 bg-white">
         <h1 className="text-2xl font-bold text-slate-800 tracking-tight mb-1">Encontre seu Caminho</h1>
         <p className="text-slate-500 font-medium mb-5 text-[13px]">Descubra o profissional ideal para sua jornada de bem-estar.</p>
         
         <div className="relative max-w-full lg:max-w-2xl flex gap-3">
           <div className="relative flex-1">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
               <Search size={18} className="text-slate-400" />
             </div>
             <input
               type="text"
               placeholder="Busque pelo nome do profissional..."
               className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100/50 rounded-xl shadow-sm text-[15px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0090FF]/10 focus:border-[#0090FF]/30 focus:bg-white placeholder:text-slate-400 transition-all font-semibold"
               value={search}
               onChange={(e) => { setSearch(e.target.value); setPage(1) }}
             />
           </div>

           <button
             onClick={() => setFilterOpen(true)}
             className={cn(
               'md:hidden flex-shrink-0 flex items-center justify-center gap-1.5 px-4 rounded-xl border transition-all text-sm font-semibold',
               activeFilterCount > 0 ? 'border-[#0090FF] bg-blue-50 text-[#0090FF]' : 'border-slate-200 bg-white text-slate-600 shadow-sm'
             )}
           >
             <SlidersHorizontal size={18} />
             {activeFilterCount > 0 && <span className="w-5 h-5 bg-[#C5A03F] text-white text-[10px] rounded-full flex items-center justify-center font-bold">{activeFilterCount}</span>}
           </button>
         </div>
      </div>

      {/* ── Drawer de filtros para mobile ───────────────── */}
      {filterOpen && (
        <>
          <div className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setFilterOpen(false)} />
          <div className="md:hidden fixed inset-y-0 right-0 z-50 w-[85vw] max-w-sm bg-white shadow-2xl animate-slide-left flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100">
              <span className="font-bold text-slate-900">Filtros</span>
              <button onClick={() => setFilterOpen(false)} className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 pb-safe">
              <SearchFilters
                values={filters}
                onChange={(v) => { setFilters(v); setPage(1) }}
                onReset={handleResetFilters}
                therapyOptions={initialTherapyOptions}
              />
            </div>
            <div className="px-4 py-4 border-t border-slate-100 pb-safe">
              <button onClick={() => setFilterOpen(false)} className="w-full h-12 bg-[#0090FF] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#0090FF]/25 hover:bg-[#0077EE] transition-colors">
                Ver resultados
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Corpo Principal (Esquerda: Resultados | Direita: Filtros) ──────────────── */}
      <div className="flex flex-col-reverse md:flex-row flex-1 px-6 sm:px-8 lg:px-12 pt-8 gap-8">
        
        {/* Resultados */}
        <div className="flex-1 min-w-0">
          
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm font-semibold text-slate-400 tracking-wide uppercase">
              {loading ? 'Buscando...' : `${total} terapeuta${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`}
            </p>

            <div className="flex gap-1 border border-slate-100 bg-white shadow-sm rounded-xl p-1 flex-shrink-0">
               <button onClick={() => setViewMode('grid')} className={cn('p-2 h-9 w-9 rounded-lg transition-all', viewMode === 'grid' ? 'bg-blue-50/80 text-[#0090FF] shadow-sm' : 'text-slate-400 hover:text-slate-600')}><LayoutGrid size={16} /></button>
               <button onClick={() => setViewMode('list')} className={cn('p-2 h-9 w-9 rounded-lg transition-all', viewMode === 'list' ? 'bg-blue-50/80 text-[#0090FF] shadow-sm' : 'text-slate-400 hover:text-slate-600')}><List size={16} /></button>
            </div>
          </div>

          {loading ? (
            <div className={cn('grid gap-6', viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1')}>
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : therapists.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white/50 rounded-[3rem] border border-slate-100 shadow-sm mt-4">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-sm"><Search size={32} className="text-slate-300" /></div>
              <h3 className="font-bold text-slate-800 text-xl tracking-tight mb-2">Sem resultados</h3>
              <p className="text-sm text-slate-400 font-medium">Tente buscar por outro nome ou remover alguns filtros laterais.</p>
            </div>
          ) : (
            <div className={cn('grid gap-6', viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1')}>
              {therapists.map((therapist) => (
                <TherapistCard key={therapist.id} therapist={therapist} variant={viewMode} onBook={handleBook} onView={handleViewProfile} />
              ))}
            </div>
          )}

          {total > 12 && !loading && (
            <div className="flex justify-center gap-2 mt-12 mb-8">
              <button 
                onClick={() => setPage((p) => Math.max(1, p - 1))} 
                disabled={page === 1} 
                className="px-5 h-12 rounded-xl border border-slate-200 text-sm font-bold bg-white disabled:opacity-40 hover:bg-slate-50 transition-colors shadow-sm"
              >
                Anterior
              </button>
              <span className="px-4 h-12 flex items-center text-sm font-semibold text-slate-600 bg-slate-50 rounded-xl">
                {page} / {Math.ceil(total / 12)}
              </span>
              <button 
                onClick={() => setPage((p) => p + 1)} 
                disabled={page >= Math.ceil(total / 12)} 
                className="px-5 h-12 rounded-xl border border-slate-200 text-sm font-bold bg-white disabled:opacity-40 hover:bg-slate-50 transition-colors shadow-sm"
              >
                Próxima
              </button>
            </div>
          )}
        </div>

        {/* Filtros Modalidade Desktop (LADO DIREITO) */}
        <div className="hidden md:block w-72 flex-shrink-0">
          <div className="sticky top-24">
            <SearchFilters
              values={filters}
              onChange={setFilters}
              onReset={handleResetFilters}
              therapyOptions={initialTherapyOptions}
            />
          </div>
        </div>

      </div>

      {bookingTherapist && (
        <BookingModal isOpen={!!bookingTherapist} onClose={() => setBookingTherapist(null)} therapist={bookingTherapist as any} onSuccess={() => { setBookingTherapist(null); toast.success('Agendamento realizado!') }} />
      )}
    </div>
  )
}
