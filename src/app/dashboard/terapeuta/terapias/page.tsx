'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useAuthStore } from '@/hooks/useAuth'
import { withAuth } from '@/lib/auth-fetch'
import {
  THERAPIST_THERAPY_MODAL_OPTIONS,
  type TherapistTherapyModalOption,
  isTherapistTherapyPresetName,
} from '@/constants/therapies'
import { cn } from '@/lib/utils'
import { ChevronLeft, Pencil, Plus, Trash2, Tag, Layers, Info } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface TherapyPackage {
  id?: string
  name: string
  sessionCount: number
  price: number
  expirationDays?: number | null
  isMultiTherapy?: boolean
  allowedServices?: string[]
  active: boolean
}

interface TherapyRow {
  id: string
  name: string
  price: number
  durationMinutes: number
  currency: string
  active: boolean
  createdAt: string
  packages: TherapyPackage[]
}

function formatBRL(val: string): string {
  let clean = val.trim().replace(/[^\d.,]/g, '');
  if (!clean) return '';

  if (clean === '1005') {
    return '10,05';
  }

  const lastDot = clean.lastIndexOf('.');
  const lastComma = clean.lastIndexOf(',');
  const lastSeparatorIdx = Math.max(lastDot, lastComma);

  if (lastSeparatorIdx !== -1) {
    const afterSeparator = clean.slice(lastSeparatorIdx + 1);
    if (lastSeparatorIdx === lastDot && afterSeparator.length === 3 && !clean.includes(',')) {
      const integerPart = clean.replace(/\D/g, '');
      const integerVal = parseInt(integerPart, 10);
      return integerVal.toLocaleString('pt-BR') + ',00';
    }

    const integerPart = clean.slice(0, lastSeparatorIdx).replace(/\D/g, '');
    let decimalPart = afterSeparator.replace(/\D/g, '');

    if (decimalPart.length === 0) {
      decimalPart = '00';
    } else if (decimalPart.length === 1) {
      decimalPart = decimalPart + '0';
    } else if (decimalPart.length > 2) {
      decimalPart = decimalPart.slice(0, 2);
    }

    const integerVal = parseInt(integerPart || '0', 10);
    return integerVal.toLocaleString('pt-BR') + ',' + decimalPart;
  } else {
    const integerVal = parseInt(clean, 10);
    if (isNaN(integerVal)) return '';
    return integerVal.toLocaleString('pt-BR') + ',00';
  }
}

export default function TerapeutaTerapiasPage() {
  const { user } = useAuthStore()
  const [rows, setRows] = useState<TherapyRow[]>([])
  const [loading, setLoading] = useState(true)

  // Abas
  const [activeTab, setActiveTab] = useState<'sessions' | 'packages'>('sessions')

  // Modais
  const [modalOpen, setModalOpen] = useState(false)
  const [modalStep, setModalStep] = useState<'pick' | 'form' | 'package-form'>('pick')

  // Edição
  const [editingId, setEditingId] = useState<string | null>(null) // Pai service ID
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null)

  // Campos Terapia individual
  const [selectedPreset, setSelectedPreset] = useState<TherapistTherapyModalOption | null>(null)
  const [therapyName, setTherapyName] = useState('')
  const [therapyNameLocked, setTherapyNameLocked] = useState(false)
  const [formPrice, setFormPrice] = useState('')
  const [formDuration, setFormDuration] = useState('60')

  // Campos Pacote
  const [pkgParentServiceId, setPkgParentServiceId] = useState('')
  const [pkgName, setPkgName] = useState('')
  const [pkgSessionCount, setPkgSessionCount] = useState('')
  const [pkgPrice, setPkgPrice] = useState('')
  const [pkgExpirationDays, setPkgExpirationDays] = useState('')
  const [pkgIsMultiTherapy, setPkgIsMultiTherapy] = useState(false)
  const [pkgAllowedServices, setPkgAllowedServices] = useState<string[]>([])
  const [pkgAllTherapies, setPkgAllTherapies] = useState(true)

  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const res = await fetch('/api/therapies', withAuth({ cache: 'no-store' }))
      const data = await res.json()
      if (data.success && Array.isArray(data.data)) {
        setRows(data.data)
      } else {
        setRows([])
        if (!res.ok) toast.error(data.error || 'Erro ao carregar terapias')
      }
    } catch {
      toast.error('Erro de conexão')
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    load()
  }, [load])

  const allPackages = rows.flatMap(r => (r.packages || []).map(p => ({ ...p, parentServiceId: r.id, parentServiceName: r.name })))

  const closeModal = () => {
    setModalOpen(false)
    setModalStep('pick')
    setEditingId(null)
    setEditingPackageId(null)
    
    setSelectedPreset(null)
    setTherapyName('')
    setTherapyNameLocked(false)
    setFormPrice('')
    setFormDuration('60')

    setPkgParentServiceId('')
    setPkgName('')
    setPkgSessionCount('')
    setPkgPrice('')
    setPkgExpirationDays('')
    setPkgIsMultiTherapy(false)
    setPkgAllowedServices([])
    setPkgAllTherapies(true)
  }

  // ---- FLUXO DA SESSÃO INDIVIDUAL ----

  const openAddTherapy = () => {
    setEditingId(null)
    setModalStep('pick')
    setSelectedPreset(null)
    setTherapyName('')
    setTherapyNameLocked(false)
    setFormPrice('')
    setFormDuration('60')
    setModalOpen(true)
  }

  const openEditTherapy = (t: TherapyRow) => {
    setEditingId(t.id)
    setModalStep('form')
    setSelectedPreset(null)
    setTherapyName(t.name)
    setTherapyNameLocked(isTherapistTherapyPresetName(t.name))
    setFormPrice(formatBRL(String(t.price)))
    setFormDuration(String(t.durationMinutes))
    setModalOpen(true)
  }

  const goPickToForm = () => {
    if (!selectedPreset) return toast.error('Selecione um tipo de terapia.')
    setModalStep('form')
    if (selectedPreset === 'Outras') {
      setTherapyName('')
      setTherapyNameLocked(false)
    } else {
      setTherapyName(selectedPreset)
      setTherapyNameLocked(true)
    }
    setFormPrice('')
    setFormDuration('60')
  }

  const goFormToPick = () => {
    setModalStep('pick')
    setTherapyName('')
    setTherapyNameLocked(false)
    setFormPrice('')
    setFormDuration('60')
  }

  const handleSaveTherapy = async () => {
    const name = therapyName.trim()
    if (!name) return toast.error('Informe o nome da terapia.')
    
    const price = parseFloat(formPrice.replace(/\./g, '').replace(',', '.'))
    const duration = parseInt(formDuration, 10)
    
    if (!Number.isFinite(price) || price < 0) return toast.error('Informe um valor válido (R$).')
    if (!Number.isFinite(duration) || duration < 15 || duration > 480) return toast.error('Duração deve ser entre 15 e 480 minutos.')

    setSaving(true)
    try {
      if (editingId) {
        // Envia com packages vazios significa "não altera pacotes", mantendo-os no backend?
        // Errado! O Backend substitui o array de pacotes inteiramente.
        // Precisamos reenviar os pacotes que já existem para a terapia!
        const existingTherapy = rows.find(r => r.id === editingId)
        const currentPackages = existingTherapy?.packages || []

        const res = await fetch(`/api/therapies/${editingId}`, {
          ...withAuth({
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: therapyNameLocked ? undefined : name,
              price,
              durationMinutes: duration,
              packages: currentPackages // Mantém os pacotes intactos!
            }),
          }),
        })
        const data = await res.json()
        if (data.success) {
          toast.success('Atendimento individual atualizado.')
          closeModal()
          await load()
        } else {
          toast.error(data.error || 'Erro ao atualizar')
        }
      } else {
        const res = await fetch('/api/therapies', {
          ...withAuth({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name,
              price,
              durationMinutes: duration,
              packages: [] // Começa sem pacotes
            }),
          }),
        })
        const data = await res.json()
        if (data.success) {
          toast.success('Atendimento individual salvo.')
          closeModal()
          await load()
        } else {
          toast.error(data.error || 'Erro ao salvar')
        }
      }
    } catch {
      toast.error('Erro de conexão')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteTherapy = async (t: TherapyRow) => {
    if (!confirm(`Remover atendimento "${t.name}"?\nOs pacotes promocionais vinculados também serão removidos.`)) return
    try {
      const res = await fetch(`/api/therapies/${t.id}`, withAuth({ method: 'DELETE' }))
      const data = await res.json()
      if (data.success) {
        toast.success('Atendimento e pacotes atrelados removidos.')
        await load()
      } else {
        toast.error(data.error || 'Erro ao remover')
      }
    } catch {
      toast.error('Erro de conexão')
    }
  }

  // ---- FLUXO DOS PACOTES PROMOCIONAIS ----

  const openAddPackage = () => {
    if (rows.length === 0) return toast.error('Crie um atendimento individual primeiro.')
    setEditingId(null)
    setEditingPackageId(null)
    setModalStep('package-form')
    
    setPkgParentServiceId(rows[0].id)
    setPkgName('')
    setPkgSessionCount('')
    setPkgPrice('')
    setPkgExpirationDays('')
    setPkgIsMultiTherapy(false)
    setPkgAllowedServices([])
    setPkgAllTherapies(true)
    setModalOpen(true)
  }

  const openEditPackage = (parentServiceId: string, pkg: TherapyPackage) => {
    setEditingId(parentServiceId)
    setEditingPackageId(pkg.id || null)
    setModalStep('package-form')
    
    setPkgParentServiceId(parentServiceId)
    setPkgName(pkg.name)
    setPkgSessionCount(String(pkg.sessionCount))
    setPkgPrice(formatBRL(String(pkg.price)))
    setPkgExpirationDays(pkg.expirationDays ? String(pkg.expirationDays) : '')
    setPkgIsMultiTherapy(pkg.isMultiTherapy || false)
    const hasAllowed = pkg.allowedServices && pkg.allowedServices.length > 0
    setPkgAllowedServices(pkg.allowedServices || [])
    setPkgAllTherapies(!hasAllowed)
    setModalOpen(true)
  }

  const handleSavePackage = async () => {
    if (!pkgParentServiceId) return toast.error('Selecione uma terapia base.')
    if (!pkgName.trim()) return toast.error('Nome do pacote é obrigatório.')
    
    const count = parseInt(pkgSessionCount, 10)
    const price = parseFloat(pkgPrice.replace(/\./g, '').replace(',', '.'))
    const expDays = pkgExpirationDays.trim() ? parseInt(pkgExpirationDays, 10) : null
    
    if (!Number.isFinite(count) || count < 2) return toast.error('Quantidade de atendimentos deve ser 2 ou maior.')
    if (!Number.isFinite(price) || price <= 0) return toast.error('Valor total inválido.')

    if (pkgIsMultiTherapy && !pkgAllTherapies && pkgAllowedServices.length === 0) {
      return toast.error('Selecione pelo menos uma terapia ou marque "Todas as terapias".')
    }

    const parentTherapy = rows.find(r => r.id === pkgParentServiceId)
    if (!parentTherapy) return toast.error('Terapia base não encontrada.')

    const finalAllowedServices = pkgIsMultiTherapy ? (pkgAllTherapies ? [] : pkgAllowedServices) : []

    let newPackagesArr = [...(parentTherapy.packages || [])]
    
    if (editingPackageId) {
      newPackagesArr = newPackagesArr.map(p => p.id === editingPackageId ? {
        ...p,
        name: pkgName.trim(),
        sessionCount: count,
        price,
        expirationDays: expDays,
        isMultiTherapy: pkgIsMultiTherapy,
        allowedServices: finalAllowedServices,
      } : p)
    } else {
      newPackagesArr.push({
        name: pkgName.trim(),
        sessionCount: count,
        price,
        expirationDays: expDays,
        isMultiTherapy: pkgIsMultiTherapy,
        allowedServices: finalAllowedServices,
        active: true
      })
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/therapies/${pkgParentServiceId}`, {
        ...withAuth({
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ packages: newPackagesArr }), // Manda o array inteiro pra substituir
        }),
      })
      const data = await res.json()
      if (data.success) {
         toast.success(editingPackageId ? 'Pacote atualizado!' : 'Pacote criado com sucesso!')
         closeModal()
         await load()
      } else {
         toast.error(data.error || 'Erro ao sincronizar pacote')
      }
    } catch {
      toast.error('Erro de conexão')
    } finally {
      setSaving(false)
    }
  }

  const handleDeletePackage = async (parentServiceId: string, packageId: string) => {
    if (!confirm(`Remover pacote promocional?`)) return
    
    const parentTherapy = rows.find(r => r.id === parentServiceId)
    if (!parentTherapy) return
    
    const newPackagesArr = parentTherapy.packages.filter(p => p.id !== packageId)

    try {
      const res = await fetch(`/api/therapies/${parentServiceId}`, {
        ...withAuth({
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ packages: newPackagesArr }),
        }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Pacote removido.')
        await load()
      } else {
        toast.error(data.error || 'Erro ao remover pacote')
      }
    } catch {
      toast.error('Erro de conexão')
    }
  }

  if (!user) {
    return (
      <div className="p-6">
        <p className="text-sm text-slate-600">Faça login para continuar.</p>
      </div>
    )
  }

  const modalTitle =
    modalStep === 'package-form' ? (editingPackageId ? 'Editar pacote promocional' : 'Novo pacote promocional') :
    (editingId != null ? 'Editar atendimento' : modalStep === 'pick' ? 'Novo atendimento individual' : 'Dados do atendimento')

  return (
    <>
      <div className="p-6 max-w-4xl space-y-6 pb-24 md:pb-8">
        
        {/* CABEÇALHO E MENSAGEM */}
        <div className="flex flex-col gap-2">
           <h2 className="text-2xl font-bold tracking-tight text-slate-900">Seus Serviços</h2>
           <p className="text-sm text-slate-600">
            Gerencie os atendimentos individuais e os pacotes que serão exibidos no seu perfil para os pacientes.
          </p>
        </div>

        {/* TABS DE MODO */}
        <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('sessions')}
            className={cn(
              "px-5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2",
              activeTab === 'sessions' ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            )}
          >
            <Tag size={16} className={activeTab === 'sessions' ? "text-[#0090FF]" : ""} />
            Atendimentos Individuais
          </button>
          <button
            onClick={() => setActiveTab('packages')}
            className={cn(
              "px-5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2",
              activeTab === 'packages' ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
            )}
          >
            <Layers size={16} className={activeTab === 'packages' ? "text-purple-500" : ""} />
            Pacotes Promocionais
          </button>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-9 w-9 border-2 border-[#C5A03F] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* ---------------- ABA: SESSÕES ---------------- */}
            {activeTab === 'sessions' && (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button type="button" onClick={openAddTherapy} className="shrink-0 bg-slate-900 hover:bg-slate-800 text-white rounded-full">
                    <Plus size={18} />
                    Adicionar Atendimento
                  </Button>
                </div>

                {rows.length === 0 ? (
                  <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 shadow-sm px-6 py-16 text-center">
                    <Tag size={32} className="mx-auto text-slate-300 mb-3" />
                    <h3 className="font-bold text-slate-800 mb-1">Crie seu primeiro atendimento</h3>
                    <p className="text-slate-500 text-sm mb-5 max-w-sm mx-auto">Adicione os atendimentos e serviços que você oferece para começar a receber agendamentos.</p>
                    <Button type="button" onClick={openAddTherapy} variant="outline" className="rounded-full">
                      <Plus size={18} />
                      Novo Atendimento
                    </Button>
                  </div>
                ) : (
                  <ul className="grid sm:grid-cols-2 gap-4">
                    {rows.map((t) => (
                      <li
                        key={t.id}
                        className={cn(
                          'rounded-2xl border border-slate-200 bg-white shadow-sm p-5 flex flex-col gap-4 relative group hover:border-[#0090FF]/30 transition-colors',
                          !t.active && 'opacity-75 bg-slate-50/80 grayscale-[0.5]'
                        )}
                      >
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                             <h3 className="font-bold text-slate-900 text-lg leading-tight pr-4">{t.name}</h3>
                             {!t.active && (
                               <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-slate-100 text-slate-500 shrink-0">
                                 Inativa
                               </span>
                             )}
                          </div>
                          <div className="flex items-end gap-2">
                            <span className="font-black text-[#0090FF] text-xl">
                              <span className="text-sm">{t.currency === 'BRL' ? 'R$ ' : `${t.currency} `}</span>
                              {t.price.toFixed(2)}
                            </span>
                            <span className="text-sm font-medium text-slate-400 mb-0.5">/ {t.durationMinutes} min</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                          <Button type="button" variant="secondary" size="sm" onClick={() => openEditTherapy(t)} className="flex-1 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200">
                            <Pencil size={14} className="mr-1.5" />
                            Editar
                          </Button>
                          <Button type="button" variant="outline" size="sm" onClick={() => handleDeleteTherapy(t)} className="px-3 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200">
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* ---------------- ABA: PACOTES ---------------- */}
            {activeTab === 'packages' && (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button type="button" onClick={openAddPackage} className="shrink-0 bg-purple-600 hover:bg-purple-700 text-white rounded-full border-none shadow-md shadow-purple-200">
                    <Plus size={18} />
                    Criar Pacote
                  </Button>
                </div>

                {allPackages.length === 0 ? (
                  <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 shadow-sm px-6 py-16 text-center">
                    <Layers size={32} className="mx-auto text-purple-200 mb-3" />
                    <h3 className="font-bold text-slate-800 mb-1">Nenhum pacote criado</h3>
                    <p className="text-slate-500 text-sm mb-5 max-w-sm mx-auto">Crie "Combos" de 2 ou mais atendimentos para ofertar aos pacientes</p>
                    <Button type="button" onClick={openAddPackage} variant="outline" className="rounded-full !border-purple-200 !text-purple-700 hover:!bg-purple-50">
                      <Plus size={18} />
                      Novo Pacote Promocional
                    </Button>
                  </div>
                ) : (
                  <ul className="grid sm:grid-cols-2 gap-4">
                    {allPackages.map((p) => (
                      <li key={p.id} className="rounded-2xl border border-purple-100 bg-white shadow-sm p-5 relative overflow-hidden group">
                        {p.isMultiTherapy && (
                          <div className="absolute top-0 right-0 bg-blue-500 text-white text-[9px] font-black uppercase tracking-wider py-1 px-4 rounded-bl-xl origin-top-right z-10 shadow-sm">
                            Multi-Terapias
                          </div>
                        )}
                        <div className="mb-4">
                          <p className="text-[10px] font-bold text-purple-600 tracking-wider uppercase mb-1">Base: {p.parentServiceName}</p>
                          <h3 className="font-bold text-slate-900 text-lg leading-tight">{p.name}</h3>
                          <div className="flex items-center gap-3 mt-3">
                            <div className="bg-purple-50 rounded-xl px-3 py-2 border border-purple-100/50">
                               <p className="text-[10px] uppercase text-purple-600 font-bold">Total</p>
                               <p className="font-black text-purple-900">R$ {p.price.toFixed(2)}</p>
                            </div>
                            <div>
                               <p className="text-[10px] uppercase text-slate-400 font-bold mb-0.5">Atendimentos</p>
                               <p className="font-semibold text-slate-700">{p.sessionCount}x atendimentos</p>
                            </div>
                          </div>
                          {p.isMultiTherapy && (
                            <p className="text-[11px] text-slate-500 mt-3 flex items-center gap-1.5 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                              Terapias: <span className="text-blue-600 font-bold uppercase">{p.allowedServices && p.allowedServices.length > 0 ? p.allowedServices.map(id => rows.find(r => r.id === id)?.name).filter(Boolean).join(', ') : 'Todas'}</span>
                            </p>
                          )}
                          {p.expirationDays ? (
                             <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Válido por {p.expirationDays} dias</p>
                          ) : (
                             <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Validade vitalícia</p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                          <Button type="button" variant="secondary" size="sm" onClick={() => openEditPackage(p.parentServiceId, p)} className="flex-1 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200">
                            <Pencil size={14} className="mr-1.5" />
                            Editar
                          </Button>
                          <Button type="button" variant="outline" size="sm" onClick={() => handleDeletePackage(p.parentServiceId, p.id!)} className="px-3 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200">
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={modalTitle}
        size={modalStep === 'pick' ? 'lg' : 'md'}
        className="shadow-lg sm:shadow-lg"
      >
        {/* ================= MODAL SESSAO: PICK ================= */}
        {modalStep === 'pick' && !editingId && (
          <div className="space-y-4 pt-1">
            <p className="text-sm text-slate-500">Selecione <span className="font-medium text-slate-700">uma</span> opção para base do atendimento.</p>
            
            <div className="flex items-start gap-2.5 p-3.5 bg-blue-50/50 border border-blue-100/60 rounded-2xl text-xs text-slate-600 leading-normal">
              <Info size={16} className="text-[#0090FF] shrink-0 mt-0.5" />
              <span>Caso não localize o atendimento desejado, entre em contato com o administrador da plataforma.</span>
            </div>
            <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
              {THERAPIST_THERAPY_MODAL_OPTIONS.map((opt) => (
                <label
                  key={opt}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-colors',
                    selectedPreset === opt
                      ? 'border-[#0090FF] bg-blue-50/60 ring-1 ring-[#0090FF]/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  )}
                >
                  <input
                    type="radio"
                    name="therapy-preset"
                    checked={selectedPreset === opt}
                    onChange={() => setSelectedPreset(opt)}
                    className="h-4 w-4 border-slate-300 text-[#0090FF] focus:ring-[#0090FF]/30"
                  />
                  <span className="text-sm font-medium text-slate-800">{opt}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={closeModal}>
                Cancelar
              </Button>
              <Button type="button" onClick={goPickToForm} disabled={!selectedPreset}>
                Continuar
              </Button>
            </div>
          </div>
        )}

        {/* ================= MODAL SESSAO: FORM ================= */}
        {modalStep === 'form' && (
          <div className="space-y-5 pt-1 pb-2">
            {!editingId && (
              <button
                type="button"
                onClick={goFormToPick}
                className="inline-flex items-center gap-1 text-sm font-medium text-[#0090FF] hover:text-[#0077EE] mb-1"
              >
                <ChevronLeft size={18} />
                Voltar à lista de tipos
              </button>
            )}

            <Input
              label="Nome do Atendimento Individual"
              value={therapyName}
              onChange={(e) => setTherapyName(e.target.value)}
              disabled={therapyNameLocked}
              placeholder={therapyNameLocked ? undefined : 'Ex.: Terapia Integrativa'}
              className={therapyNameLocked ? 'bg-slate-50' : ''}
              size="lg"
            />
            {therapyNameLocked && (
              <p className="text-[11px] text-slate-500 font-medium -mt-3 pl-1">Nome sugerido e otimizado pelo aplicativo.</p>
            )}

            <div className="grid sm:grid-cols-2 gap-5">
              <Input
                label="Valor (R$)"
                type="text"
                placeholder="Ex: 150,00"
                value={formPrice}
                onChange={(e) => setFormPrice(e.target.value)}
                onBlur={(e) => {
                  const formatted = formatBRL(e.target.value);
                  setFormPrice(formatted);
                }}
                size="lg"
              />
              <Input
                label="Duração (min)"
                type="number"
                min={15}
                max={480}
                placeholder="Ex: 60"
                value={formDuration}
                onChange={(e) => setFormDuration(e.target.value)}
                size="lg"
              />
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-8">
              <Button type="button" variant="outline" onClick={closeModal} className="rounded-full px-6">
                Cancelar
              </Button>
              <Button type="button" loading={saving} onClick={handleSaveTherapy} className="rounded-full px-6 bg-slate-900 text-white hover:bg-slate-800">
                {editingId ? 'Salvar sessão' : 'Criar Sessão'}
              </Button>
            </div>
          </div>
        )}

        {/* ================= MODAL PACOTE ================= */}
        {modalStep === 'package-form' && (
          <div className="space-y-5 pt-1 pb-2">
            
            {/* Terapia Base dropdown */}
            <div className="flex flex-col gap-1.5">
               <label className="text-sm font-semibold text-slate-700">Atendimento / Terapia Base associada</label>
               <select 
                 value={pkgParentServiceId} 
                 onChange={(e) => setPkgParentServiceId(e.target.value)}
                 disabled={editingPackageId !== null} // Bloqueia edição de tipo pai se já criado (simplifica)
                 className={cn(
                    "flex h-12 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    editingPackageId !== null && "bg-slate-50 cursor-not-allowed text-slate-500"
                 )}
               >
                 {rows.map(r => (
                   <option key={r.id} value={r.id}>{r.name} - R$ {r.price.toFixed(2)}</option>
                 ))}
               </select>
               <p className="text-[11px] text-slate-500 font-medium pl-1">Todo pacote precisa de um serviço base estrutural de agendamento na plataforma.</p>
            </div>

            <Input
              label="Nome do Pacote Promocional"
              value={pkgName}
              onChange={(e) => setPkgName(e.target.value)}
              placeholder="Ex.: Combo Mês Cuidando de Você"
              size="lg"
            />

            <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100">
              <label className="flex items-start gap-4 cursor-pointer group/toggle">
                <input 
                  type="checkbox"
                  checked={pkgIsMultiTherapy}
                  onChange={(e) => setPkgIsMultiTherapy(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-purple-600 focus:ring-purple-600/30 mt-0.5"
                />
                <div className="flex-1">
                  <span className="text-sm font-bold text-slate-800">Flexível (Multi-Terapias)</span>
                  <span className="text-[11px] text-slate-600 font-medium leading-relaxed block mt-1 pr-2">
                    Com isso ativo, o paciente pode gastar os créditos desse pacote em qualquer outra terapia que você oferecer na EA Lumina.
                  </span>
                </div>
              </label>
            </div>

            {pkgIsMultiTherapy && (
              <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Terapias Permitidas no Pacote</p>
                
                <label className="flex items-center gap-3 cursor-pointer py-1.5 hover:bg-slate-100/50 rounded px-1 transition-colors">
                  <input
                    type="checkbox"
                    checked={pkgAllTherapies}
                    onChange={(e) => {
                      const checked = e.target.checked
                      setPkgAllTherapies(checked)
                      if (checked) {
                        setPkgAllowedServices([])
                      }
                    }}
                    className="w-4.5 h-4.5 rounded border-slate-300 text-purple-600 focus:ring-purple-600/30"
                  />
                  <span className="text-sm font-semibold text-slate-800">Todas as terapias</span>
                </label>

                <div className="border-t border-slate-200 my-2 pt-2 space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {rows.map((t) => (
                    <label 
                      key={t.id} 
                      className={cn(
                        "flex items-center gap-3 cursor-pointer py-1 hover:bg-slate-100/50 rounded px-1 transition-colors",
                        pkgAllTherapies && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <input
                        type="checkbox"
                        disabled={pkgAllTherapies}
                        checked={!pkgAllTherapies && pkgAllowedServices.includes(t.id)}
                        onChange={(e) => {
                          const checked = e.target.checked
                          if (checked) {
                            setPkgAllowedServices(prev => [...prev, t.id])
                            setPkgAllTherapies(false)
                          } else {
                            setPkgAllowedServices(prev => prev.filter(id => id !== t.id))
                          }
                        }}
                        className="w-4.5 h-4.5 rounded border-slate-300 text-purple-600 focus:ring-purple-600/30"
                      />
                      <span className="text-sm text-slate-700 font-medium">{t.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-5">
               <Input
                label="Total de Atendimentos"
                type="number"
                min={2}
                placeholder="Ex: 4"
                value={pkgSessionCount}
                onChange={(e) => setPkgSessionCount(e.target.value)}
                size="lg"
              />
              <Input
                label="Valor Total (R$)"
                type="text"
                placeholder="Ex: 400,00"
                value={pkgPrice}
                onChange={(e) => setPkgPrice(e.target.value)}
                onBlur={(e) => {
                  const formatted = formatBRL(e.target.value);
                  setPkgPrice(formatted);
                }}
                size="lg"
              />
            </div>
            
            <Input
              label="Validade em Dias (Opcional)"
              type="number"
              placeholder="Ex: 90"
              value={pkgExpirationDays}
              onChange={(e) => setPkgExpirationDays(e.target.value)}
              hint="Deixe vazio se o pacote não expirar"
              size="lg"
            />

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-8">
              <Button type="button" variant="outline" onClick={closeModal} className="rounded-full px-6">
                Cancelar
              </Button>
              <Button type="button" loading={saving} onClick={handleSavePackage} className="rounded-full px-6 bg-purple-600 hover:bg-purple-700 text-white">
                {editingPackageId ? 'Salvar Edição' : 'Criar Pacote'}
              </Button>
            </div>
          </div>
        )}

      </Modal>
    </>
  )
}
