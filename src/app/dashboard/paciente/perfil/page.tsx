'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/hooks/useAuth'
import { withAuth } from '@/lib/auth-fetch'
import { getAvatarUrl } from '@/lib/utils'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Save, Lock, CheckCircle2, AlertCircle, Camera } from 'lucide-react'

const emptyAnamnesis = {
  objetivo: '',
  historicoEmocional: '',
  medicamentos: '',
  alergias: '',
  expectativas: '',
}

type FormData = {
  name: string
  socialName: string
  email: string
  phone: string
  birthDate: string
  gender: 'MASCULINO' | 'FEMININO' | 'NAO_BINARIO' | 'PREFIRO_NAO_INFORMAR' | ''
  maritalStatus: string
  profession: string
  zipCode: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  anamnesis: typeof emptyAnamnesis
}

const initialForm: FormData = {
  name: '',
  socialName: '',
  email: '',
  phone: '',
  birthDate: '',
  gender: '',
  maritalStatus: '',
  profession: '',
  zipCode: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  anamnesis: { ...emptyAnamnesis },
}

function formatDateFromIso(iso: string | null) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toISOString().split('T')[0].split('-').reverse().join('/')
}

function parseDateToIso(ptBrDate: string) {
  if (!ptBrDate || ptBrDate.length !== 10) return null
  const [d, m, y] = ptBrDate.split('/')
  if (!d || !m || !y) return null
  return `${y}-${m}-${d}T00:00:00.000Z`
}

function calculateAge(ptBrDate: string) {
  if (!ptBrDate || ptBrDate.length !== 10) return '--'
  const [d, m, y] = ptBrDate.split('/')
  if (!d || !m || !y || isNaN(Number(y))) return '--'
  const birth = new Date(Number(y), Number(m) - 1, Number(d))
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const mDiff = today.getMonth() - birth.getMonth()
  if (mDiff < 0 || (mDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return isNaN(age) || age < 0 ? '--' : String(age)
}

function cepMask(val: string) {
  return val
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 9)
}

function dateMask(val: string) {
  return val
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .slice(0, 10)
}

function phoneMask(val: string) {
  let v = val.replace(/\D/g, '')
  if (v.length > 2) v = `(${v.substring(0, 2)}) ` + v.substring(2)
  if (v.length > 10) v = v.substring(0, 10) + '-' + v.substring(10, 14)
  return v
}

export default function PacientePerfilPage() {
  const { user, setUser } = useAuthStore()
  const [formData, setFormData] = useState<FormData>(initialForm)
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [savingBox, setSavingBox] = useState<'pessoais' | 'anamnese' | 'seguranca' | null>(null)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const [showSuccess, setShowSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current)
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current)
    }
  }, [])

  const loadProfile = useCallback(async () => {
    setLoadState('loading')
    try {
      const res = await fetch('/api/profile', withAuth())
      const data = await res.json()
      if (!data.success) {
        setFormData(initialForm)
        setLoadState('error')
        return
      }
      const d = data.data
      setFormData({
        name: d.name ?? '',
        socialName: d.socialName ?? '',
        email: d.email ?? '',
        phone: d.phone ? phoneMask(d.phone) : '',
        birthDate: formatDateFromIso(d.birthDate),
        gender: d.gender ?? '',
        maritalStatus: d.maritalStatus ?? '',
        profession: d.profession ?? '',
        zipCode: d.zipCode ? cepMask(d.zipCode) : '',
        street: d.street ?? '',
        number: d.number ?? '',
        complement: d.complement ?? '',
        neighborhood: d.neighborhood ?? '',
        city: d.city ?? '',
        state: d.state ?? '',
        anamnesis: {
          objetivo: d.anamnesis?.objetivo ?? '',
          historicoEmocional: d.anamnesis?.historicoEmocional ?? '',
          medicamentos: d.anamnesis?.medicamentos ?? '',
          alergias: d.anamnesis?.alergias ?? '',
          expectativas: d.anamnesis?.expectativas ?? '',
        },
      })
      setLoadState('ready')
    } catch (e) {
      setFormData(initialForm)
      setLoadState('error')
    }
  }, [])

  useEffect(() => {
    if (!user) return
    loadProfile()
  }, [user, loadProfile])

  const handleCepBlur = async () => {
    const raw = formData.zipCode.replace(/\D/g, '')
    if (raw.length !== 8) return
    try {
      const res = await fetch(`https://viacep.com.br/ws/${raw}/json/`)
      const d = await res.json()
      if (!d.erro) {
        setFormData(p => ({
          ...p,
          street: d.logradouro || p.street,
          neighborhood: d.bairro || p.neighborhood,
          city: d.localidade || p.city,
          state: d.uf || p.state
        }))
      }
    } catch(e) {}
  }

  const setAnamnesisField = (field: keyof typeof emptyAnamnesis, value: string) => {
    setFormData((prev) => ({
      ...prev,
      anamnesis: { ...prev.anamnesis, [field]: value },
    }))
  }

  const handleSave = async (box: 'pessoais' | 'anamnese' | 'seguranca') => {
    if (!user) return
    setSavingBox(box)
    try {
      const body: Record<string, unknown> = {
        name: formData.name,
        socialName: formData.socialName,
        phone: formData.phone.replace(/\D/g, ''),
        birthDate: parseDateToIso(formData.birthDate),
        gender: formData.gender || null,
        maritalStatus: formData.maritalStatus,
        profession: formData.profession,
        zipCode: formData.zipCode.replace(/\D/g, ''),
        street: formData.street,
        number: formData.number,
        complement: formData.complement,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
        anamnesis: formData.anamnesis,
      }
      if (currentPassword && newPassword && box === 'seguranca') {
        body.currentPassword = currentPassword
        body.newPassword = newPassword
      }

      const res = await fetch(
        '/api/profile',
        withAuth({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      )
      const data = await res.json()
      if (data.success) {
        const d = data.data
        setFormData({
          name: d.name ?? '',
          socialName: d.socialName ?? '',
          email: d.email ?? '',
          phone: d.phone ? phoneMask(d.phone) : '',
          birthDate: formatDateFromIso(d.birthDate),
          gender: d.gender ?? '',
          maritalStatus: d.maritalStatus ?? '',
          profession: d.profession ?? '',
          zipCode: d.zipCode ? cepMask(d.zipCode) : '',
          street: d.street ?? '',
          number: d.number ?? '',
          complement: d.complement ?? '',
          neighborhood: d.neighborhood ?? '',
          city: d.city ?? '',
          state: d.state ?? '',
          anamnesis: {
            objetivo: d.anamnesis?.objetivo ?? '',
            historicoEmocional: d.anamnesis?.historicoEmocional ?? '',
            medicamentos: d.anamnesis?.medicamentos ?? '',
            alergias: d.anamnesis?.alergias ?? '',
            expectativas: d.anamnesis?.expectativas ?? '',
          },
        })
        setUser({
          ...user,
          name: d.name ?? user.name,
          socialName: d.socialName ?? null,
        })
        if (box === 'seguranca') {
          setCurrentPassword('')
          setNewPassword('')
        }
        setErrorMessage(null)
        setShowSuccess(true)
        if (successTimerRef.current) clearTimeout(successTimerRef.current)
        successTimerRef.current = setTimeout(() => setShowSuccess(false), 3000)
      } else {
        setShowSuccess(false)
        setErrorMessage(data.error || 'Erro ao salvar informações. Tente novamente.')
        if (errorTimerRef.current) clearTimeout(errorTimerRef.current)
        errorTimerRef.current = setTimeout(() => setErrorMessage(null), 4000)
      }
    } catch (e) {
      setShowSuccess(false)
      setErrorMessage(e instanceof Error ? e.message : 'Erro inesperado ao salvar')
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current)
      errorTimerRef.current = setTimeout(() => setErrorMessage(null), 4000)
    } finally {
      setSavingBox(null)
    }
  }

  const handlePhotoUpload = () => {
    alert('Upload de foto estará disponível em breve.')
  }

  if (!user) return null

  if (loadState === 'loading' || loadState === 'idle') {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-56px)]">
        <div className="w-8 h-8 rounded-full border-2 border-[#0090FF] border-t-transparent animate-spin" />
      </div>
    )
  }

  if (loadState === 'error') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-56px)] gap-4">
        <AlertCircle size={48} className="text-red-400" />
        <h2 className="text-xl font-semibold text-slate-800">Não foi possível carregar seu perfil.</h2>
        <Button onClick={() => loadProfile()}>Tentar novamente</Button>
      </div>
    )
  }

  const avatarUrl = getAvatarUrl(formData.name || user.name, null)

  return (
    <div className="min-h-full pb-20">
      {showSuccess && (
        <div role="status" aria-live="polite" className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-[#0090FF] px-5 py-3 text-sm font-bold tracking-wide text-white shadow-xl shadow-[#0090FF]/20 animate-slide-up">
          <CheckCircle2 size={18} className="shrink-0" aria-hidden />
          Informações salvas com sucesso!
        </div>
      )}
      {errorMessage && (
        <div role="alert" aria-live="assertive" className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex max-w-[90vw] md:max-w-md items-center gap-2 rounded-full bg-red-500 px-5 py-3 text-sm font-bold text-white shadow-xl shadow-red-500/20 animate-slide-up">
          <AlertCircle size={18} className="shrink-0" aria-hidden />
          <span className="truncate">{errorMessage}</span>
        </div>
      )}
      
      {/* ── Hero Profile ───────────────────── */}
       <div className="px-6 sm:px-8 lg:px-12 py-8 border-b border-slate-100 bg-white flex items-center gap-5">
        <div className="relative group flex-shrink-0">
          <Image
            src={avatarUrl}
            alt={formData.name || user.name}
            width={72}
            height={72}
            className="w-[72px] h-[72px] rounded-full border-2 border-slate-50 shadow-sm object-cover"
          />
          <button 
            onClick={handlePhotoUpload}
            className="absolute bottom-0 right-0 w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm hover:bg-slate-700 transition-colors"
          >
            <Camera size={12} />
          </button>
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Meu Perfil</h1>
          <p className="text-slate-500 text-sm mt-1">Gerencie suas informações pessoais e ficha de anamnese.</p>
        </div>
      </div>

      <div className="px-6 sm:px-8 lg:px-12 pt-8 max-w-4xl mx-auto space-y-8">
        
        {/* — Box: Dados Pessoais — */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] overflow-hidden">
          <div className="p-6 sm:p-8 space-y-6">
            <h2 className="font-bold text-slate-900 text-lg">Dados Pessoais</h2>
            
            {/* Identificação Básica */}
            <div>
              <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">Identificação Básica</h3>
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <Input
                  label="Nome completo *"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  className="bg-slate-50 border-slate-100/50 rounded-xl"
                  required
                />
                <Input
                  label="Nome social"
                  value={formData.socialName}
                  onChange={(e) => setFormData((p) => ({ ...p, socialName: e.target.value }))}
                  className="bg-slate-50 border-slate-100/50 rounded-xl"
                  placeholder="Como gostaria de ser chamado"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Nascimento *"
                    value={formData.birthDate}
                    onChange={(e) => setFormData((p) => ({ ...p, birthDate: dateMask(e.target.value) }))}
                    className="bg-slate-50 border-slate-100/50 rounded-xl"
                    placeholder="DD/MM/AAAA"
                    required
                  />
                  <Input
                    label="Idade"
                    value={calculateAge(formData.birthDate)}
                    onChange={() => {}}
                    disabled
                    className="bg-slate-50 border-slate-100/50 rounded-xl text-center"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-2">Gênero</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData(p => ({ ...p, gender: e.target.value as any }))}
                    className="w-full h-11 px-4 text-sm font-medium border border-slate-100/50 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0090FF]/15 transition-all text-slate-900"
                  >
                    <option value="">Selecione...</option>
                    <option value="FEMININO">Feminino</option>
                    <option value="MASCULINO">Masculino</option>
                    <option value="NAO_BINARIO">Não Binário</option>
                    <option value="PREFIRO_NAO_INFORMAR">Prefiro não informar</option>
                  </select>
                </div>

                <Input
                  label="Estado Civil"
                  value={formData.maritalStatus}
                  onChange={(e) => setFormData((p) => ({ ...p, maritalStatus: e.target.value }))}
                  className="bg-slate-50 border-slate-100/50 rounded-xl"
                  placeholder="Ex: Solteiro(a), Casado(a)"
                />
                <Input
                  label="Profissão / Ocupação"
                  value={formData.profession}
                  onChange={(e) => setFormData((p) => ({ ...p, profession: e.target.value }))}
                  className="bg-slate-50 border-slate-100/50 rounded-xl"
                />
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Contato e Endereço */}
            <div>
              <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">Contato e Endereço</h3>
              <div className="grid sm:grid-cols-12 gap-4 sm:gap-6">
                <div className="sm:col-span-6">
                  <Input
                    label="Telefone (WhatsApp) *"
                    value={formData.phone}
                    onChange={(e) => setFormData((p) => ({ ...p, phone: phoneMask(e.target.value) }))}
                    className="bg-slate-50 border-slate-100/50 rounded-xl"
                    placeholder="(00) 00000-0000"
                    required
                  />
                </div>
                <div className="sm:col-span-6">
                  <Input
                    label="E-mail *"
                    value={formData.email}
                    onChange={() => {}}
                    disabled
                    hint="O e-mail padrão do seu cadastro"
                    className="bg-slate-50 border-slate-100/50 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-3 mt-2 sm:mt-0">
                  <Input
                    label="CEP"
                    value={formData.zipCode}
                    onChange={(e) => setFormData((p) => ({ ...p, zipCode: cepMask(e.target.value) }))}
                    onBlur={handleCepBlur}
                    className="bg-slate-50 border-slate-100/50 rounded-xl"
                    placeholder="00000-000"
                  />
                </div>
                <div className="sm:col-span-7 mt-2 sm:mt-0">
                  <Input
                    label="Logradouro (Rua, Av.)"
                    value={formData.street}
                    onChange={(e) => setFormData((p) => ({ ...p, street: e.target.value }))}
                    className="bg-slate-50 border-slate-100/50 rounded-xl"
                  />
                </div>
                <div className="sm:col-span-2 mt-2 sm:mt-0">
                  <Input
                    label="Número"
                    value={formData.number}
                    onChange={(e) => setFormData((p) => ({ ...p, number: e.target.value }))}
                    className="bg-slate-50 border-slate-100/50 rounded-xl"
                  />
                </div>
                
                <div className="sm:col-span-4">
                  <Input
                    label="Complemento"
                    value={formData.complement}
                    onChange={(e) => setFormData((p) => ({ ...p, complement: e.target.value }))}
                    className="bg-slate-50 border-slate-100/50 rounded-xl"
                  />
                </div>
                <div className="sm:col-span-3">
                  <Input
                    label="Bairro"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData((p) => ({ ...p, neighborhood: e.target.value }))}
                    className="bg-slate-50 border-slate-100/50 rounded-xl"
                  />
                </div>
                <div className="sm:col-span-3">
                  <Input
                    label="Cidade"
                    value={formData.city}
                    onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))}
                    className="bg-slate-50 border-slate-100/50 rounded-xl"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Input
                    label="UF"
                    value={formData.state}
                    onChange={(e) => setFormData((p) => ({ ...p, state: e.target.value.toUpperCase().slice(0,2) }))}
                    className="bg-slate-50 border-slate-100/50 rounded-xl uppercase"
                  />
                </div>
              </div>
            </div>

          </div>
          <div className="bg-slate-50 px-6 py-4 flex justify-end border-t border-slate-100/60">
            <Button loading={savingBox === 'pessoais'} disabled={savingBox !== null && savingBox !== 'pessoais'} onClick={() => handleSave('pessoais')}>
              Salvar Dados
            </Button>
          </div>
        </div>

        {/* — Box: Ficha de Anamnese — */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] overflow-hidden">
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="font-bold text-slate-900 text-lg tracking-tight mb-1">Ficha de Anamnese</h2>
              <p className="text-sm font-medium text-slate-500">Estas informações são compartilhadas com seus terapeutas para personalizar seu atendimento.</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-2">Qual seu principal objetivo terapêutico hoje?</label>
                <textarea
                  value={formData.anamnesis.objetivo}
                  onChange={(e) => setAnamnesisField('objetivo', e.target.value)}
                  rows={2}
                  placeholder="Ex: Reduzir ansiedade, criar resiliência, curar um trauma..."
                  className="w-full px-4 py-3 text-sm font-medium border border-slate-100/80 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0090FF]/15 focus:border-[#0090FF]/40 resize-none transition-all placeholder:font-normal"
                />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-2">Breve histórico emocional</label>
                <textarea
                  value={formData.anamnesis.historicoEmocional}
                  onChange={(e) => setAnamnesisField('historicoEmocional', e.target.value)}
                  rows={2}
                  placeholder="Traços marcantes da sua jornada até aqui..."
                  className="w-full px-4 py-3 text-sm font-medium border border-slate-100/80 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0090FF]/15 focus:border-[#0090FF]/40 resize-none transition-all placeholder:font-normal"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-2">Uso de medicamentos</label>
                  <input
                    value={formData.anamnesis.medicamentos}
                    onChange={(e) => setAnamnesisField('medicamentos', e.target.value)}
                    placeholder="Se nenhum, deixe em branco"
                    className="w-full px-4 py-3 text-sm font-medium border border-slate-100/80 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0090FF]/15 focus:border-[#0090FF]/40 transition-all placeholder:font-normal"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-2">Alergias / Restrições físicas</label>
                  <input
                    value={formData.anamnesis.alergias}
                    onChange={(e) => setAnamnesisField('alergias', e.target.value)}
                    placeholder="Ex: Óleos essenciais, massagem profunda..."
                    className="w-full px-4 py-3 text-sm font-medium border border-slate-100/80 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0090FF]/15 focus:border-[#0090FF]/40 transition-all placeholder:font-normal"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-slate-700 mb-2">Expectativas gerais do tratamento</label>
                <textarea
                  value={formData.anamnesis.expectativas}
                  onChange={(e) => setAnamnesisField('expectativas', e.target.value)}
                  rows={2}
                  placeholder="Como você gostaria de se sentir ao final das sessões?"
                  className="w-full px-4 py-3 text-sm font-medium border border-slate-100/80 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0090FF]/15 focus:border-[#0090FF]/40 resize-none transition-all placeholder:font-normal"
                />
              </div>
            </div>
          </div>
          <div className="bg-slate-50 px-6 py-4 flex justify-end border-t border-slate-100/60">
            <Button loading={savingBox === 'anamnese'} disabled={savingBox !== null && savingBox !== 'anamnese'} onClick={() => handleSave('anamnese')}>
              Salvar Anamnese
            </Button>
          </div>
        </div>

        {/* — Box: Segurança (Senha) — */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] overflow-hidden">
          <div className="p-6 sm:p-8 space-y-6">
            <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Lock size={16} className="text-slate-400" />
              Segurança
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <Input
                label="Senha atual"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-slate-50 border-slate-100/50 rounded-xl"
              />
              <Input
                label="Nova senha"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mín. 8 caracteres"
                hint="Deixe em branco se não quiser alterar"
                className="bg-slate-50 border-slate-100/50 rounded-xl"
              />
            </div>
          </div>
          <div className="bg-slate-50 px-6 py-4 flex justify-end border-t border-slate-100/60">
            <Button loading={savingBox === 'seguranca'} disabled={savingBox !== null && savingBox !== 'seguranca'} onClick={() => handleSave('seguranca')} variant="outline">
              Atualizar Senha
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}
