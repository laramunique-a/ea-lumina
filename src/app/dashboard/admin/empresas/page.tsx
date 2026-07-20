'use client'

import React, { useState, useEffect } from 'react'
import { Building2, Download, Search, Filter, Mail, Phone, Calendar, Save, CheckCircle2, XCircle, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

interface CorporateLeadItem {
  id: string
  companyName: string
  contactName: string
  email: string
  phone: string | null
  employeeCount: string | null
  industry: string | null
  mainChallenges: string | null
  desiredProgram: string | null
  status: string
  notes: string | null
  createdAt: string
}

export default function AdminCorporateLeadsPage() {
  const [leads, setLeads] = useState<CorporateLeadItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [editingNotes, setEditingNotes] = useState<{ [key: string]: string }>({})

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/admin/corporate-leads')
      const data = await res.json()
      if (data.success && Array.isArray(data.leads)) {
        setLeads(data.leads)
        const initialNotes: { [key: string]: string } = {}
        data.leads.forEach((l: CorporateLeadItem) => {
          initialNotes[l.id] = l.notes || ''
        })
        setEditingNotes(initialNotes)
      }
    } catch (error) {
      console.error('Erro ao buscar leads corporativos:', error)
      toast.error('Erro ao carregar solicitações corporativas.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  const handleUpdateLead = async (id: string, newStatus?: string, newNotes?: string) => {
    setUpdatingId(id)
    try {
      const res = await fetch('/api/admin/corporate-leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus, notes: newNotes })
      })

      const data = await res.json()
      if (data.success) {
        toast.success('Lead corporativo atualizado!')
        fetchLeads()
      } else {
        toast.error(data.error || 'Erro ao atualizar lead.')
      }
    } catch (error) {
      toast.error('Erro de conexão ao salvar alterações.')
    } finally {
      setUpdatingId(null)
    }
  }

  const exportCSV = () => {
    if (leads.length === 0) return

    const headers = ['Data', 'Empresa', 'Contato', 'Email', 'Telefone', 'Colaboradores', 'Setor', 'Status', 'Notas']
    const rows = leads.map(l => [
      new Date(l.createdAt).toLocaleDateString('pt-BR'),
      `"${l.companyName}"`,
      `"${l.contactName}"`,
      `"${l.email}"`,
      `"${l.phone || ''}"`,
      `"${l.employeeCount || ''}"`,
      `"${l.industry || ''}"`,
      `"${l.status}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `leads-corporativos-ea-lumina-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredLeads = leads.filter(l => {
    const matchesSearch = !searchTerm ||
      l.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = !filterStatus || l.status === filterStatus

    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-5 h-5 text-[#0090FF]" />
            <span className="text-xs font-black uppercase tracking-widest text-[#0090FF]">Gestão Comercial</span>
          </div>
          <h1 className="text-2xl font-black text-white">Solicitações de Empresas (Leads Corporativos)</h1>
          <p className="text-xs text-slate-400 mt-1">Gerencie o funil de prospecção corporativa e diagnósticos organizacionais.</p>
        </div>

        <button
          onClick={exportCSV}
          disabled={leads.length === 0}
          className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-colors shrink-0"
        >
          <Download className="w-4 h-4" /> Exportar CSV
        </button>
      </div>

      {/* FILTROS */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por empresa, responsável ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0090FF]"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-[#0090FF]"
        >
          <option value="">Todos os Status</option>
          <option value="NEW">Novos (NEW)</option>
          <option value="CONTACTED">Em Contato (CONTACTED)</option>
          <option value="IN_PROGRESS">Em Negociação (IN_PROGRESS)</option>
          <option value="CLOSED">Fechados (CLOSED)</option>
          <option value="REJECTED">Arquivados (REJECTED)</option>
        </select>
      </div>

      {/* LISTA DE LEADS */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#0090FF] mx-auto mb-4" />
          <p className="text-xs text-slate-500 font-medium">Carregando solicitações corporativas...</p>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-2">
          <p className="text-sm font-bold text-white">Nenhum lead corporativo encontrado.</p>
          <p className="text-xs text-slate-500">Solicitações enviadas pelo formulário corporativo aparecerão aqui.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLeads.map((lead) => (
            <div key={lead.id} className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-bold text-white">{lead.companyName}</h3>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-blue-500/10 border border-blue-500/30 text-blue-400 px-2.5 py-0.5 rounded-full">
                      {lead.employeeCount || 'Tam. não inf.'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Responsável: <strong className="text-white">{lead.contactName}</strong> ({lead.industry || 'Setor não informado'})</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                  </span>

                  <select
                    value={lead.status}
                    disabled={updatingId === lead.id}
                    onChange={(e) => handleUpdateLead(lead.id, e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#0090FF]"
                  >
                    <option value="NEW">Novo (NEW)</option>
                    <option value="CONTACTED">Contatado</option>
                    <option value="IN_PROGRESS">Em Negociação</option>
                    <option value="CLOSED">Contrato Fechado</option>
                    <option value="REJECTED">Arquivado</option>
                  </select>
                </div>
              </div>

              {/* DETALHES DE CONTATO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                  <a href={`mailto:${lead.email}`} className="hover:underline text-blue-400 truncate">{lead.email}</a>
                </div>

                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>{lead.phone || 'Não informado'}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-300">
                  <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Programa: {lead.desiredProgram || 'Integrativo'}</span>
                </div>
              </div>

              {/* DESAFIOS INFORMADOS */}
              {lead.mainChallenges && (
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 text-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Principais Desafios Informados:</span>
                  <p className="text-slate-300 leading-relaxed font-medium">{lead.mainChallenges}</p>
                </div>
              )}

              {/* NOTAS INTERNAS DO ADMIN */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <input
                  type="text"
                  placeholder="Adicionar nota interna do atendimento..."
                  value={editingNotes[lead.id] ?? ''}
                  onChange={(e) => setEditingNotes({ ...editingNotes, [lead.id]: e.target.value })}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#0090FF]"
                />

                <button
                  type="button"
                  disabled={updatingId === lead.id}
                  onClick={() => handleUpdateLead(lead.id, undefined, editingNotes[lead.id])}
                  className="inline-flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors shrink-0"
                >
                  <Save className="w-3.5 h-3.5" /> Salvar Nota
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
