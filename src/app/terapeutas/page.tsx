'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Sparkles, Star, MapPin, Filter, Heart, ArrowRight, ShieldCheck, CheckCircle2, User } from 'lucide-react'
import { TaxonomyRegistry } from '@/constants/therapies'
import { Footer } from '@/components/Footer'

interface TherapistPublicItem {
  id: string
  professionalName: string | null
  bio: string | null
  therapies: string[]
  price: number
  rating: number
  reviewCount: number
  location: string | null
  modality: string
  avatarUrl: string | null
  approved: boolean
}

export default function PublicTherapistsPage() {
  const [therapists, setTherapists] = useState<TherapistPublicItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTherapy, setSelectedTherapy] = useState<string>('')
  const [selectedModality, setSelectedModality] = useState<string>('')

  const activeTherapies = TaxonomyRegistry.getActiveTherapies()

  useEffect(() => {
    fetch('/api/therapists/public')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.therapists)) {
          setTherapists(data.therapists)
        } else if (Array.isArray(data)) {
          setTherapists(data)
        }
      })
      .catch(err => console.error('Erro ao buscar terapeutas:', err))
      .finally(() => setLoading(false))
  }, [])

  const filteredTherapists = therapists.filter(t => {
    const matchesSearch = !searchTerm ||
      (t.professionalName && t.professionalName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.bio && t.bio.toLowerCase().includes(searchTerm.toLowerCase())) ||
      t.therapies.some(th => th.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesTherapy = !selectedTherapy || t.therapies.includes(selectedTherapy)
    const matchesModality = !selectedModality || t.modality === selectedModality || t.modality === 'AMBOS'

    return matchesSearch && matchesTherapy && matchesModality
  })

  return (
    <div className="min-h-screen bg-[#010409] text-slate-100 font-sans flex flex-col justify-between">
      
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#010409]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/logo-dark.jpg"
              alt="EA Lumina"
              className="w-8 h-8 object-contain"
              style={{ WebkitMaskImage: 'radial-gradient(circle at center, black 50%, transparent 80%)', maskImage: 'radial-gradient(circle at center, black 50%, transparent 80%)' }}
            />
            <span className="font-black text-sm uppercase tracking-[0.2em] text-white">EA Lumina</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-xs font-semibold text-slate-400 hover:text-white transition-colors uppercase tracking-wider">
              Início
            </Link>
            <Link href="/terapeutas" className="text-xs font-semibold text-white uppercase tracking-wider">
              Rede Lumina
            </Link>
            <Link href="/empresas" className="text-xs font-semibold text-slate-400 hover:text-white transition-colors uppercase tracking-wider">
              Empresas
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors px-3 py-2">
              Entrar
            </Link>
            <Link href="/register" className="text-xs font-black uppercase tracking-wider bg-[#0090FF] hover:bg-[#007adb] text-white px-4 py-2 rounded-xl transition-colors">
              Criar conta
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-10 space-y-10">

        {/* HERO BUSCA */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#0090FF]/10 border border-[#0090FF]/20 px-4 py-1 rounded-full text-[11px] font-bold text-[#0090FF] uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Rede de Terapeutas Credenciados
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Encontre sua Conexão Terapêutica
          </h1>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Navegue pelos perfis dos profissionais da Rede Lumina. Todos os terapeutas passam por curadoria e aderem ao nosso Manifesto Ético.
          </p>
        </div>

        {/* FILTROS E BARRA DE PESQUISA */}
        <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-4 sm:p-6 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Search Input */}
            <div className="relative md:col-span-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nome, técnica ou objetivo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0090FF] transition-colors"
              />
            </div>

            {/* Therapy Selector */}
            <div>
              <select
                value={selectedTherapy}
                onChange={(e) => setSelectedTherapy(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-300 focus:outline-none focus:border-[#0090FF] transition-colors"
              >
                <option value="">Todas as Abordagens</option>
                {activeTherapies.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Modality Selector */}
            <div>
              <select
                value={selectedModality}
                onChange={(e) => setSelectedModality(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-300 focus:outline-none focus:border-[#0090FF] transition-colors"
              >
                <option value="">Todas as Modalidades</option>
                <option value="ONLINE">Online</option>
                <option value="PRESENCIAL">Presencial</option>
                <option value="AMBOS">Online & Presencial</option>
              </select>
            </div>
          </div>
        </div>

        {/* LISTA DE TERAPEUTAS */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#0090FF] mx-auto mb-4" />
            <p className="text-xs text-slate-500 font-medium">Carregando profissionais da Rede Lumina...</p>
          </div>
        ) : filteredTherapists.length === 0 ? (
          <div className="py-16 text-center bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-4">
            <User className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">Nenhum terapeuta encontrado</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Tente alterar os termos da busca ou selecionar filtros diferentes.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTherapists.map((therapist) => (
              <div
                key={therapist.id}
                className="bg-slate-900/60 border border-white/5 hover:border-slate-700 rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between space-y-5 group"
              >
                <div className="space-y-4">
                  {/* Avatar + Info Header */}
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
                      {therapist.avatarUrl ? (
                        <img src={therapist.avatarUrl} alt={therapist.professionalName || 'Terapeuta'} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-slate-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <h3 className="text-base font-bold text-white truncate group-hover:text-[#0090FF] transition-colors">
                          {therapist.professionalName || 'Terapeuta Lumina'}
                        </h3>
                        <CheckCircle2 className="w-4 h-4 text-[#0090FF] shrink-0" title="Perfil Verificado da Rede Lumina" />
                      </div>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {therapist.location || 'Atendimento Online'}
                      </p>
                    </div>
                  </div>

                  {/* Bio curta */}
                  {therapist.bio && (
                    <p className="text-xs text-slate-400 leading-relaxed font-medium line-clamp-3">
                      {therapist.bio}
                    </p>
                  )}

                  {/* Tags de Terapias */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {therapist.therapies.slice(0, 3).map((therapy) => (
                      <span key={therapy} className="text-[10px] font-bold text-slate-300 bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
                        {therapy}
                      </span>
                    ))}
                    {therapist.therapies.length > 3 && (
                      <span className="text-[10px] text-slate-500 font-bold self-center">
                        +{therapist.therapies.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer do Card / Ação */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Sessão a partir de</span>
                    <span className="text-sm font-black text-white">
                      R$ {Number(therapist.price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <Link
                    href={`/login?redirectTo=/dashboard/paciente/terapeuta/${therapist.id}`}
                    className="inline-flex items-center gap-1.5 bg-[#0090FF] hover:bg-[#007adb] text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-colors"
                  >
                    Agendar <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  )
}
