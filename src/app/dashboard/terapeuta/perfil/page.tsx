'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { Badge } from '@/components/ui/Badge'
import { useAuthStore } from '@/hooks/useAuth'
import toast from 'react-hot-toast'
import { useCallback, useEffect, useState, useRef } from 'react'
import { withAuth } from '@/lib/auth-fetch'
import { useTherapistUnifiedUpload } from '@/hooks/useTherapistUnifiedUpload'
import { X, Plus, Save, Upload, FileText, ExternalLink, Trash2, User, Camera, Phone, CreditCard, Eye, Download, CheckCircle2, Clock, Video } from 'lucide-react'
import Link from 'next/link'
import { Modal } from '@/components/ui/Modal'
import { normalizeLanguagesFromServer } from '@/constants/languages'
import { LanguageMultiSelect } from '@/components/therapist/LanguageMultiSelect'

/** Dados mínimos do usuário após GET /api/users/:id (upload só após carregar). */
interface LoadedTherapistProfile {
  id: string
  therapistProfileId: string | null
}

export default function TerapeutaPerfilPage() {
  const { user, setUser } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<LoadedTherapistProfile | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [profileLoadError, setProfileLoadError] = useState<string | null>(null)
  const [profileId, setProfileId] = useState<string | null>(null)
  const [openingCertId, setOpeningCertId] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [professionalName, setProfessionalName] = useState('')
  const [country, setCountry] = useState('')
  const [nationality, setNationality] = useState('')
  const [documentId, setDocumentId] = useState('')
  const [languages, setLanguages] = useState<string[]>(['Português'])
  const [bio, setBio] = useState('')
  const [price, setPrice] = useState('')
  const [modality, setModality] = useState('AMBOS')
  const [location, setLocation] = useState('')
  const [cep, setCep] = useState('')
  const [street, setStreet] = useState('')
  const [number, setNumber] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [professionalEmail, setProfessionalEmail] = useState('')
  const [instagram, setInstagram] = useState('')
  const [facebook, setFacebook] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [yearsExp, setYearsExp] = useState('')
  const [certifications, setCertifications] = useState<string[]>([])
  const [newCert, setNewCert] = useState('')
  const [publicTargetDescription, setPublicTargetDescription] = useState('')
  const [certificateFiles, setCertificateFiles] = useState<{ id: string; name: string; fileUrl: string }[]>([])
  const [newCertificateTitle, setNewCertificateTitle] = useState('')
  const [documentUploadLabel, setDocumentUploadLabel] = useState<string | null>(null)
  const [documentFileName, setDocumentFileName] = useState<string | null>(null)
  const [documentExists, setDocumentExists] = useState(false)
  const [documentLoading, setDocumentLoading] = useState(false)
  
  const [presentationVideoUrl, setPresentationVideoUrl] = useState<string | null>(null)
  const [videoUploading, setVideoUploading] = useState(false)
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const profileLoaded = !loadingProfile && !!profile

  const { fileInputRef, pickFile, handleFileChange, defaultAccept, isUploading } = useTherapistUnifiedUpload({
    userId: user?.id,
    profileId,
    profileLoaded,
    certificationName: newCertificateTitle,
    onProfileImageSuccess: (url) => {
      setAvatarUrl(url)
      toast.success('Foto profissional atualizada!')
    },
    onCertificationSuccess: (row) => {
      setCertificateFiles((prev) => [...prev, row])
      setNewCertificateTitle('')
      toast.success('Certificado enviado!')
    },
    onDocumentSuccess: (fileName) => {
      setDocumentUploadLabel(fileName)
      setDocumentFileName(fileName)
      setDocumentExists(true)
      toast.success('Documento enviado com sucesso!')
    },
    onError: (msg) => toast.error(msg),
  })

  const cepMask = (val: string) => {
    const raw = val.replace(/\D/g, '')
    if (raw.length <= 5) return raw
    return `${raw.slice(0, 5)}-${raw.slice(5, 8)}`
  }

  const handleCepBlur = async () => {
    const raw = cep.replace(/\D/g, '')
    if (raw.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${raw}/json/`)
        const data = await res.json()
        if (!data.erro) {
          setStreet(data.logradouro || '')
          setNeighborhood(data.bairro || '')
          setCity(data.localidade || '')
          setState(data.uf || '')
          setCountry('Brasil')
        }
      } catch (err) {
        console.error('Erro ao buscar CEP:', err)
      }
    }
  }


  /** Refetch user + therapist profile from API and sync form state (also used after save). */
  const loadProfile = useCallback(async (opts?: { silent?: boolean }) => {
    const silent = opts?.silent ?? false
    if (!user) {
      setProfile(null)
      setProfileId(null)
      setProfileLoadError(null)
      setLoadingProfile(false)
      return
    }
    if (!silent) {
      setLoadingProfile(true)
      setProfileLoadError(null)
    }
    try {
      const r = await fetch('/api/profile', withAuth({ cache: 'no-store' }))
      let data: { success?: boolean; error?: string; data?: Record<string, unknown> }
      try {
        data = await r.json()
      } catch {
        data = { success: false, error: 'Resposta inválida do servidor' }
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('[TerapeutaPerfil] GET /api/profile', { status: r.status, ok: r.ok })
        console.log('Perfil carregado:', data)
      }

      if (!r.ok || !data.success || !data.data) {
        const msg = [data.error, !r.ok && `HTTP ${r.status}`].filter(Boolean).join(' · ') || 'Falha ao carregar perfil'
        console.error('Erro ao carregar perfil:', { status: r.status, body: data })
        setProfileLoadError(msg)
        toast.error(data.error || 'Não foi possível carregar o perfil')
        setProfile(null)
        setProfileId(null)
        return
      }

      const row = data.data as {
        id: string
        role?: string
        name?: string
        email?: string
        therapistProfile?: Record<string, unknown> | null
      }

      if (row.role !== 'TERAPEUTA') {
        const msg = 'Esta área é exclusiva para terapeutas.'
        setProfileLoadError(msg)
        toast.error(msg)
        setProfile(null)
        setProfileId(null)
        return
      }

      const tp = row.therapistProfile as typeof row.therapistProfile & {
        id?: string
        professionalName?: string | null
        country?: string | null
        nationality?: string | null
        documentId?: string | null
        languages?: string[]
        bio?: string | null
        price?: unknown
        modality?: string
        location?: string | null
        city?: string | null
        state?: string | null
        yearsExp?: number | null
        certifications?: string[]
        targetAudience?: { specialNeeds?: string | null } | null
        sessionsPerMonthGoal?: number | null
        wantCampaigns?: boolean
        allowAutoScheduling?: boolean
        whatsapp?: string | null
        professionalEmail?: string | null
        instagram?: string | null
        facebook?: string | null
        websiteUrl?: string | null
        documentUrl?: string | null
        documentFileName?: string | null
        presentationVideoUrl?: string | null
      } | null

      const snapshot: LoadedTherapistProfile = {
        id: row.id,
        therapistProfileId: tp?.id ?? null,
      }
      setProfile(snapshot)
      setProfileLoadError(null)
      if (process.env.NODE_ENV === 'development') {
        console.log('Profile (snapshot):', snapshot)
      }

      setName(row.name || '')
      setBirthDate(
        (row as { birthDate?: string | null }).birthDate
          ? String((row as { birthDate?: string }).birthDate).slice(0, 10)
          : ''
      )
      setAvatarUrl((row as { avatarUrl?: string | null }).avatarUrl || null)
      if (tp) {
        setProfileId(tp.id ?? null)
        setProfessionalName(tp.professionalName || '')
        setCountry(tp.country || '')
        setNationality(tp.nationality || '')
        setDocumentId(tp.documentId || '')
        setLanguages(normalizeLanguagesFromServer(tp.languages))
        setBio(tp.bio || '')
        setPrice(String(tp.price ?? ''))
        setModality(tp.modality || 'AMBOS')
        const loc = tp.location || ''
        setLocation(loc)
        if (loc.includes(';;;')) {
          const parts = loc.split(';;;')
          setCep(parts[0] || '')
          setStreet(parts[1] || '')
          setNumber(parts[2] || '')
          setNeighborhood(parts[3] || '')
        } else {
          setCep('')
          setStreet(loc)
          setNumber('')
          setNeighborhood('')
        }
        setCity(tp.city || '')
        setState(tp.state || '')
        setYearsExp(tp.yearsExp != null ? String(tp.yearsExp) : '')
        setCertifications(tp.certifications || [])
        setPublicTargetDescription(tp.targetAudience?.specialNeeds ?? '')
        setPublicTargetDescription(tp.targetAudience?.specialNeeds ?? '')
        setWhatsapp(tp.whatsapp || (row as { phone?: string | null }).phone || '')
        setProfessionalEmail(tp.professionalEmail || row.email || '')
        setInstagram(tp.instagram || '')
        setFacebook(tp.facebook || '')
        setWebsiteUrl(tp.websiteUrl || '')
        // Estado do documento de identidade
        const hasDoc = !!tp.documentUrl
        setDocumentExists(hasDoc)
        setDocumentFileName(tp.documentFileName || null)
        if (hasDoc && tp.documentFileName) {
          setDocumentUploadLabel(tp.documentFileName)
        }
        setPresentationVideoUrl(tp.presentationVideoUrl || null)
      } else {
        setProfileId(null)
        setDocumentExists(false)
        setDocumentFileName(null)
        setWhatsapp((row as { phone?: string | null }).phone || '')
        setProfessionalEmail((row as { email?: string }).email || '')
        setCep('')
        setStreet('')
        setNumber('')
        setNeighborhood('')
      }
    } catch (e) {
      console.error('Erro ao carregar perfil:', e)
      setProfileLoadError('Erro de rede ou servidor. Verifique sua conexão e tente novamente.')
      toast.error('Erro ao carregar perfil')
      setProfile(null)
      setProfileId(null)
    } finally {
      if (!silent) setLoadingProfile(false)
    }
  }, [user])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  /** Obtém URL assinada e abre/baixa o documento */
  const openDocument = async (mode: 'view' | 'download') => {
    setDocumentLoading(true)
    try {
      const res = await fetch('/api/documents/access', withAuth())
      const data = await res.json()
      if (!data.success || !data.data?.signedUrl) {
        toast.error(data.error || 'Não foi possível acessar o documento')
        return
      }
      if (mode === 'view') {
        window.open(data.data.signedUrl, '_blank', 'noopener,noreferrer')
      } else {
        const a = document.createElement('a')
        a.href = data.data.signedUrl
        a.download = data.data.fileName || 'documento'
        a.click()
      }
    } catch {
      toast.error('Erro ao acessar o documento')
    } finally {
      setDocumentLoading(false)
    }
  }

  useEffect(() => {
    if (!profileId) return
    fetch(`/api/therapists/${profileId}/certificates`, withAuth())
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setCertificateFiles(data.data || [])
      })
      .catch(() => setCertificateFiles([]))
  }, [profileId])


  const handleRemoveCertificate = async (certId: string) => {
    if (!profileId) return
    try {
      const res = await fetch(`/api/therapists/${profileId}/certificates/${certId}`, withAuth({ method: 'DELETE' }))
      const data = await res.json()
      if (data.success) {
        setCertificateFiles((prev) => prev.filter((c) => c.id !== certId))
        toast.success('Certificado removido')
      } else {
        toast.error(data.error || 'Erro ao remover')
      }
    } catch {
      toast.error('Erro ao remover certificado')
    }
  }

  /** Gera URL assinada e abre o certificado numa nova aba. */
  const openCertificate = async (certId: string, certName: string) => {
    if (!profileId) return
    setOpeningCertId(certId)
    try {
      const res = await fetch(
        `/api/therapists/${profileId}/certificates/${certId}/signed-url`,
        withAuth()
      )
      const data = await res.json()
      if (!data.success || !data.data?.signedUrl) {
        toast.error(data.error || 'Não foi possível abrir o certificado')
        return
      }
      window.open(data.data.signedUrl, '_blank', 'noopener,noreferrer')
    } catch {
      toast.error('Erro ao acessar o certificado')
    } finally {
      setOpeningCertId(null)
    }
  }

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 50 * 1024 * 1024) {
      toast.error('O vídeo não pode exceder 50MB.')
      return
    }

    const url = URL.createObjectURL(file)
    const videoElement = document.createElement('video')
    videoElement.src = url
    videoElement.preload = 'metadata'

    const handleUpload = async () => {
      setVideoUploading(true)
      try {
        const fileExt = file.name.split('.').pop() || 'mp4'

        // 1. Obter URL assinada de Upload e URL pública de destino
        const resUrl = await fetch(`/api/therapist/profile/video?ext=${fileExt}`, withAuth())
        const dataUrl = await resUrl.json().catch(() => ({}))

        if (!resUrl.ok || !dataUrl.success || !dataUrl.signedUrl || !dataUrl.publicUrl) {
          toast.error(dataUrl.error || 'Erro ao preparar upload do vídeo.')
          return
        }

        const { signedUrl, publicUrl } = dataUrl

        // 2. Upload direto do arquivo para o Supabase Storage via PUT
        const uploadRes = await fetch(signedUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        })

        if (!uploadRes.ok) {
          toast.error('Erro de conexão ao enviar vídeo para o armazenamento.')
          return
        }

        // 3. Salvar a nova URL do vídeo no perfil do terapeuta
        const saveRes = await fetch('/api/therapist/profile/video', withAuth({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ videoUrl: publicUrl }),
        }))
        const saveData = await saveRes.json().catch(() => ({}))

        if (saveRes.ok && saveData.success) {
          setPresentationVideoUrl(saveData.url)
          toast.success('Vídeo de apresentação salvo com sucesso!')
        } else {
          toast.error(saveData.error || 'Erro ao vincular vídeo ao seu perfil.')
        }
      } catch (err) {
        console.error('[handleVideoSelect]', err)
        toast.error('Erro de conexão ao enviar vídeo.')
      } finally {
        setVideoUploading(false)
        if (videoInputRef.current) videoInputRef.current.value = ''
      }
    }

    videoElement.onloadedmetadata = () => {
      URL.revokeObjectURL(url)
      if (videoElement.duration > 60) {
        toast.error('O vídeo deve ter no máximo 1 minuto (60 segundos).')
        if (videoInputRef.current) videoInputRef.current.value = ''
        return
      }
      handleUpload()
    }

    videoElement.onerror = () => {
      URL.revokeObjectURL(url)
      console.warn('Não foi possível ler os metadados do vídeo. Prosseguindo com o upload...')
      handleUpload()
    }
  }

  const handleVideoRemove = async () => {
    try {
      const res = await fetch('/api/therapist/profile/video', withAuth({ method: 'DELETE' }))
      const data = await res.json()

      if (res.ok && data.success) {
        setPresentationVideoUrl(null)
        toast.success('Vídeo removido com sucesso.')
      } else {
        toast.error(data.error || 'Erro ao remover vídeo.')
      }
    } catch {
      toast.error('Erro de conexão ao remover vídeo.')
    }
  }
  const addCert = () => {
    if (newCert.trim()) {
      setCertifications((prev) => [...prev, newCert.trim()])
      setNewCert('')
    }
  }

  const handleSave = async (section: 'basic' | 'contact' | 'bio' | 'certificates' | 'all' = 'all') => {
    if (!user) {
      toast.error('Sessão inválida. Faça login novamente.')
      return
    }
    if (!profileId) {
      toast.error('Perfil de terapeuta não encontrado. Recarregue a página ou contate o suporte.')
      return
    }

    // Validações de campos obrigatórios por seção
    if (section === 'all' || section === 'basic') {
      if (!professionalName.trim()) {
        toast.error('O campo "Nome profissional" é obrigatório.')
        return
      }
      if (!birthDate) {
        toast.error('O campo "Data de nascimento" é obrigatório.')
        return
      }
      if (!country.trim()) {
        toast.error('O campo "País" é obrigatório.')
        return
      }
      if (!state.trim()) {
        toast.error('O campo "Estado (UF)" é obrigatório.')
        return
      }
      if (state.trim().length !== 2) {
        toast.error('O campo "Estado (UF)" deve conter a sigla de 2 caracteres (ex.: SP).')
        return
      }
      if (!documentExists) {
        toast.error('O envio do "Comprovante de Identidade" é obrigatório.')
        return
      }
    }

    if (section === 'all' || section === 'contact') {
      if (!whatsapp.trim()) {
        toast.error('O campo "WhatsApp / Telefone" é obrigatório.')
        return
      }
      if (!professionalEmail.trim()) {
        toast.error('O campo "Email profissional" é obrigatório.')
        return
      }
      if (!modality) {
        toast.error('O campo "Modalidade de atendimento" é obrigatório.')
        return
      }
    }

    if (section === 'all' || section === 'bio') {
      const bioWordCount = bio.trim() ? bio.trim().split(/\s+/).filter(Boolean).length : 0
      if (!bio.trim() || bioWordCount < 100 || bioWordCount > 1000) {
        toast.error('A biografia é obrigatória e deve conter entre 100 e 1000 palavras.')
        return
      }
    }

    setLoading(true)
    try {
      const promises: Promise<Response>[] = []

      // 1. Preparar payload de atualização do User se aplicável
      const userPayload: Record<string, unknown> = {}
      if (section === 'all' || section === 'basic') {
        userPayload.name = name
        if (birthDate) userPayload.birthDate = birthDate ? new Date(birthDate) : null
      }
      if (section === 'all' || section === 'contact') {
        userPayload.phone = whatsapp.trim() ? whatsapp : ''
      }

      if (Object.keys(userPayload).length > 0) {
        promises.push(
          fetch(
            `/api/users/${user.id}`,
            withAuth({
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(userPayload),
            })
          )
        )
      }

      // 2. Preparar payload de atualização do TherapistProfile se aplicável
      const profileBody: Record<string, unknown> = {}
      
      if (section === 'all' || section === 'basic') {
        profileBody.professionalName = professionalName || null
        profileBody.country = country.trim() || null
        profileBody.city = city || null
        profileBody.state = state.trim().toUpperCase() || null
        profileBody.nationality = nationality || null
        profileBody.languages = languages.length ? languages : ['Português']
        
        const priceNum = parseFloat(price)
        if (Number.isFinite(priceNum) && priceNum >= 0) profileBody.price = priceNum

        const yearsNum = yearsExp.trim() === '' ? null : parseInt(yearsExp, 10)
        if (yearsNum !== null && Number.isFinite(yearsNum) && yearsNum >= 0) profileBody.yearsExp = yearsNum
        else if (yearsExp.trim() === '') profileBody.yearsExp = null
      }
      
      if (section === 'all' || section === 'contact') {
        const finalLocation = modality === 'ONLINE' ? '' : [cep, street, number, neighborhood].join(';;;')
        profileBody.modality = modality
        profileBody.location = finalLocation || null
        profileBody.city = city || null
        profileBody.state = state.trim().toUpperCase() || null
        profileBody.country = country.trim() || null
        profileBody.whatsapp = whatsapp || null
        profileBody.professionalEmail = professionalEmail || null
        profileBody.instagram = instagram || null
        profileBody.facebook = facebook || null
        profileBody.websiteUrl = websiteUrl || null
      }
      
      if (section === 'all' || section === 'bio') {
        profileBody.bio = bio
      }

      if (section === 'certificates') {
        profileBody.certifications = certifications
      }

      if (Object.keys(profileBody).length > 0) {
        promises.push(
          fetch(
            `/api/therapists/${profileId}`,
            withAuth({
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(profileBody),
            })
          )
        )
      }

      if (promises.length === 0) {
        toast.success('Nenhuma alteração a ser salva.')
        setLoading(false)
        return
      }

      const responses = await Promise.all(promises)
      let allSuccess = true
      const errors: string[] = []

      for (const res of responses) {
        const data = await res.json().catch(() => ({}))
        if (!data.success) {
          allSuccess = false
          if (data.error) errors.push(data.error)
        }
      }

      if (allSuccess) {
        toast.success('Seção do perfil atualizada com sucesso!')
        setUser({
          ...user,
          name: (section === 'all' || section === 'basic') ? name : user.name,
          professionalName: (section === 'all' || section === 'basic') ? professionalName : user.professionalName,
        })
        await loadProfile({ silent: true })
      } else {
        toast.error(errors.join(' · ') || 'Erro ao salvar alterações da seção')
      }
    } catch (e) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[TerapeutaPerfil] save', e)
      }
      toast.error('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="p-6 max-w-3xl">
        <p className="text-slate-600 text-sm">Faça login para acessar o perfil.</p>
      </div>
    )
  }

  if (loadingProfile) {
    return (
      <div className="p-6 max-w-3xl flex flex-col items-center justify-center min-h-[40vh] gap-3">
        <div className="h-10 w-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-600 text-sm font-medium">Carregando perfil...</p>
      </div>
    )
  }

  if (!profile && !loadingProfile) {
    return (
      <div className="p-6 max-w-3xl space-y-4 text-center">
        <p className="text-slate-800 font-medium">Não foi possível carregar seus dados.</p>
        {profileLoadError && (
          <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2 border border-red-100">{profileLoadError}</p>
        )}
        <p className="text-sm text-slate-500">
          Confira no DevTools → Network se <code className="text-xs bg-slate-100 px-1 rounded">GET /api/profile</code> retorna
          200. Se aparecer 401, faça login novamente.
        </p>
        <Button type="button" onClick={() => loadProfile()}>
          Tentar novamente
        </Button>
      </div>
    )
  }

  const uploadBusy = loadingProfile || isUploading
  const canCertOrDocUpload = !!profileId

  return (
    <div className="min-h-full pb-20">
      <input
        ref={fileInputRef}
        type="file"
        tabIndex={-1}
        accept={defaultAccept}
        onChange={handleFileChange}
        disabled={uploadBusy}
        data-testid="therapist-unified-upload"
        aria-hidden
        className="pointer-events-none fixed left-4 top-20 z-[60] m-0 h-px w-px min-h-px min-w-px overflow-hidden border-0 p-0 opacity-[0.02]"
      />

      {/* HEADER PRINCIPAL (Formato Zen) */}
      <div className="bg-white px-6 py-12 sm:px-8 lg:px-12 rounded-b-[3rem] shadow-[0_4px_20px_-4px_rgba(6,81,237,0.05)] border-b border-slate-100 flex flex-col items-center justify-center relative overflow-hidden mb-8">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
        <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500" />
        
        <div className="relative group mb-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-[6px] border-white shadow-xl bg-slate-50 relative overflow-hidden ring-4 ring-blue-50 transition-all group-hover:ring-blue-100 flex items-center justify-center">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-black text-blue-500">{name?.charAt(0).toUpperCase() || "T"}</span>
            )}
          </div>
          <button 
             type="button" 
             onClick={() => pickFile('profileImage')} 
             disabled={uploadBusy} 
             className="absolute bottom-1 right-1 w-9 h-9 bg-[#0090FF] rounded-full border-2 border-white text-white flex items-center justify-center shadow-md hover:bg-blue-600 hover:scale-105 transition-all"
          >
            <Camera size={14} />
          </button>
        </div>

        <div className="text-center relative z-10">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-2">
            {name || 'Seu Perfil'}
            {(user?.email || documentExists) && <CheckCircle2 size={20} className="text-[#0090FF]" />}
          </h1>
          <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-[10px]">
            Terapeuta Especialista
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 sm:p-8 space-y-8 pb-24">
        {/* Dados pessoais básicos (Ficha profissional) */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-6 mb-6">
            <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <User size={20} className="text-[#0090FF]" />
              Dados pessoais básicos
            </h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Sua identificação dentro da plataforma.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input className="bg-slate-50 border-slate-100/50 rounded-xl" label="Nome completo" value={name} onChange={(e) => setName(e.target.value)} />
            <Input
              required
              label="Nome profissional"
              value={professionalName}
              onChange={(e) => setProfessionalName(e.target.value)}
              placeholder="Ex.: Dra. Ana Silva"
              tooltip="Nome que será exibido publicamente no seu perfil para os pacientes (ex: Dra. Ana Silva). Pode ser seu nome social, abreviado ou artístico."
            />
            <Input required className="bg-slate-50 border-slate-100/50 rounded-xl" label="Data de nascimento" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
            <Input required className="bg-slate-50 border-slate-100/50 rounded-xl" label="País" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Ex.: Brasil" />
            <Input className="bg-slate-50 border-slate-100/50 rounded-xl" label="Cidade" value={city} onChange={(e) => setCity(e.target.value)} />
            <Input required className="bg-slate-50 border-slate-100/50 rounded-xl" label="Estado (UF)" value={state} onChange={(e) => setState(e.target.value)} placeholder="SP" maxLength={2} />
            <Input className="bg-slate-50 border-slate-100/50 rounded-xl" label="Nacionalidade" value={nationality} onChange={(e) => setNationality(e.target.value)} placeholder="Ex.: Brasileira" />
            <LanguageMultiSelect
              label="Idiomas"
              value={languages}
              onChange={setLanguages}
              disabled={uploadBusy}
            />
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-slate-700 mb-1">Comprovante de Identidade<span className="text-red-500 ml-0.5">*</span></p>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                Anexe um documento de identificação válido para verificação do seu perfil. Após o envio, seu cadastro será analisado pelos administradores da plataforma.<br />
                <strong>Documentos aceitos:</strong> RG, CNH ou Passaporte.
              </p>
              <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-800">Arquivo enviado</span>
                  {documentExists ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800">
                      <Clock size={12} />
                      Aguardando validação
                    </span>
                  ) : (
                    <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-500">
                      Nenhum arquivo
                    </span>
                  )}
                </div>

                {documentExists && documentFileName && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
                    <FileText size={16} className="shrink-0 text-slate-400" />
                    <span className="min-w-0 flex-1 truncate text-sm text-slate-700" title={documentFileName}>
                      {documentFileName}
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-green-600">
                      <CheckCircle2 size={14} />
                      Enviado
                    </span>
                  </div>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => pickFile('document')}
                    disabled={uploadBusy || !canCertOrDocUpload}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
                  >
                    <Upload size={16} />
                    {isUploading ? 'Enviando...' : documentExists ? 'Substituir arquivo' : 'Enviar PDF ou imagem'}
                  </button>
                  {documentExists && (
                    <>
                      <button
                        type="button"
                        onClick={() => openDocument('view')}
                        disabled={documentLoading}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
                      >
                        <Eye size={16} />
                        Ver documento
                      </button>
                      <button
                        type="button"
                        onClick={() => openDocument('download')}
                        disabled={documentLoading}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
                      >
                        <Download size={16} />
                        Baixar
                      </button>
                    </>
                  )}
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  Aceito: PDF, JPG ou PNG (máx. 10MB). Visível apenas para você e administradores.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button size="md" loading={loading} onClick={() => handleSave('basic')}>
              <Save size={16} />
              Salvar alterações
            </Button>
          </div>
        </div>

        {/* Dados de contato */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-6 mb-6"><h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Phone size={20} className="text-[#0090FF]" />
            Dados de contato
          </h2></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <PhoneInput
                required
                label="WhatsApp / Telefone"
                value={whatsapp}
                onChange={setWhatsapp}
                hint="Formato internacional: DDI + DDD + número (ex.: +55 11 982586339)."
                className={`bg-slate-50 border-slate-100/50 rounded-xl ${uploadBusy ? 'opacity-50 pointer-events-none' : ''}`}
              />
            </div>
            <Input required className="bg-slate-50 border-slate-100/50 rounded-xl" label="Email profissional" type="email" value={professionalEmail} onChange={(e) => setProfessionalEmail(e.target.value)} placeholder="contato@seusite.com" />
            <Input className="bg-slate-50 border-slate-100/50 rounded-xl" label="Instagram" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@seuusuario" />
            <Input className="bg-slate-50 border-slate-100/50 rounded-xl" label="Facebook" value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="URL ou nome do perfil" />
            <Input className="bg-slate-50 border-slate-100/50 rounded-xl" label="Site (se tiver)" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Modalidade de atendimento<span className="text-red-500 ml-0.5">*</span></label>
            <div className="flex flex-wrap gap-4">
              {[
                { value: 'ONLINE', label: 'Online' },
                { value: 'PRESENCIAL', label: 'Presencial' },
                { value: 'AMBOS', label: 'Ambos' },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="modality"
                    value={opt.value}
                    checked={modality === opt.value}
                    onChange={() => setModality(opt.value)}
                    className="rounded-full border-slate-200 text-[#0090FF] focus:ring-[#0090FF]/20"
                  />
                  <span className="text-sm text-slate-700">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {modality !== 'ONLINE' && (
            <div className="mt-6 border-t border-slate-100 pt-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-800">Endereço de Atendimento Físico</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  className="bg-slate-50 border-slate-100/50 rounded-xl"
                  label="CEP"
                  value={cep}
                  onChange={(e) => setCep(cepMask(e.target.value))}
                  onBlur={handleCepBlur}
                  placeholder="00000-000"
                />
                <div className="md:col-span-2">
                  <Input
                    required
                    className="bg-slate-50 border-slate-100/50 rounded-xl"
                    label="País"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Brasil"
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    className="bg-slate-50 border-slate-100/50 rounded-xl"
                    label="Rua / Logradouro"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Ex: Avenida Paulista"
                  />
                </div>
                <Input
                  className="bg-slate-50 border-slate-100/50 rounded-xl"
                  label="Número"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="123"
                />
                <Input
                  className="bg-slate-50 border-slate-100/50 rounded-xl"
                  label="Bairro"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Bairro"
                />
                <Input
                  className="bg-slate-50 border-slate-100/50 rounded-xl"
                  label="Cidade"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Cidade"
                />
                <Input
                  required
                  className="bg-slate-50 border-slate-100/50 rounded-xl"
                  label="Estado (UF)"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="SP"
                  maxLength={2}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button size="md" loading={loading} onClick={() => handleSave('contact')}>
              <Save size={16} />
              Salvar alterações
            </Button>
          </div>
        </div>


        {/* Sobre o profissional */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-6 mb-6"><h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">Sobre o profissional</h2></div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Descrição profissional (biografia)<span className="text-red-500 ml-0.5">*</span></label>
            <p className="text-xs text-slate-500 mb-2">
              Guia: quem você é, o que faz, quem ajuda e qual é o seu enfoque. Texto de apresentação entre 100 e 1000 palavras.
            </p>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={6}
              placeholder="Descreva sua experiência, abordagem e diferenciais..."
              className="w-full px-4 py-3 text-sm border border-slate-100/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0090FF]/20 resize-none"
            />
            <p className={`mt-1 text-xs ${bio.trim().split(/\s+/).filter(Boolean).length < 100 || bio.trim().split(/\s+/).filter(Boolean).length > 1000 ? 'text-amber-600' : 'text-slate-500'}`}>
              {bio.trim() ? `${bio.trim().split(/\s+/).filter(Boolean).length} palavras` : '0 palavras'} (mín. 100, máx. 1000)
            </p>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button size="md" loading={loading} onClick={() => handleSave('bio')}>
              <Save size={16} />
              Salvar alterações
            </Button>
          </div>
        </div>

        {/* Vídeo de Apresentação */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-6 mb-6">
            <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">Vídeo de Apresentação</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Grave um vídeo curto de até 1 minuto para se apresentar aos pacientes.</p>
          </div>

          <div className="space-y-4">
            {presentationVideoUrl ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all group">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                      <video 
                        src={presentationVideoUrl} 
                        preload="metadata" 
                        muted 
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Video size={16} className="text-white" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">Vídeo de Apresentação</p>
                      <button
                        type="button"
                        onClick={() => setVideoModalOpen(true)}
                        className="text-[#0090FF] hover:underline text-[10px] font-black uppercase tracking-widest flex items-center gap-1 mt-0.5"
                      >
                        Visualizar
                        <ExternalLink size={10} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      type="button" 
                      onClick={() => videoInputRef.current?.click()} 
                      loading={videoUploading}
                      className="px-3 rounded-xl h-10 w-10 flex items-center justify-center text-slate-400 hover:text-[#0090FF] hover:bg-blue-50"
                      title="Substituir"
                    >
                      <Upload size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={handleVideoRemove}
                      className="px-3 rounded-xl h-10 w-10 flex items-center justify-center border-slate-200 text-slate-300 hover:text-red-500 hover:bg-red-50 hover:border-red-200"
                      title="Remover"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 px-4 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                <Button type="button" onClick={() => videoInputRef.current?.click()} loading={videoUploading}>
                  <Upload size={16} className="mr-2" />
                  Enviar Vídeo
                </Button>
                <p className="mt-3 text-xs text-slate-400 font-medium">Aceito: MP4, MOV ou WEBM. Máximo 50MB e 1:00 min.</p>
              </div>
            )}
            
            <input 
              type="file" 
              accept="video/mp4,video/quicktime,video/webm" 
              ref={videoInputRef} 
              className="hidden" 
              onChange={handleVideoSelect} 
            />
          </div>
        </div>
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-6 mb-6">
            <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">Certificações e documentos</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Diplomas, certificados e comprovantes de formação que aparecem em seu perfil.</p>
          </div>

          <div className="space-y-4 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Novo documento</label>
              <Input
                placeholder="Título do certificado (ex: Pós-graduação em Junguiana)"
                value={newCertificateTitle}
                onChange={(e) => setNewCertificateTitle(e.target.value)}
                className="bg-white"
              />
            </div>
            
            <button
              type="button"
              onClick={() => pickFile('certification')}
              disabled={uploadBusy || !canCertOrDocUpload || !newCertificateTitle.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-slate-200 bg-white text-sm font-bold text-slate-600 hover:border-[#0090FF] hover:text-[#0090FF] hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isUploading ? (
                <>
                  <div className="h-4 w-4 border-2 border-[#0090FF] border-t-transparent rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload size={18} className="group-hover:scale-110 transition-transform" />
                  {newCertificateTitle.trim() ? 'Selecionar arquivo e enviar' : 'Digite o título acima para habilitar o upload'}
                </>
              )}
            </button>
            <p className="text-[10px] text-slate-400 text-center font-medium">Aceito: PDF, JPG ou PNG (máx. 10MB)</p>
          </div>

          <div className="space-y-3">
            {certificateFiles.map((cert) => {
              const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(cert.fileUrl)
              return (
                <div
                  key={cert.id}
                  className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {isImage ? (
                        <img src={`/api/therapists/${profileId}/certificates/${cert.id}/view`} alt={cert.name} className="w-full h-full object-cover" />
                      ) : (
                        <FileText size={20} className="text-slate-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate" title={cert.name}>{cert.name}</p>
                      <button
                        type="button"
                        onClick={() => openCertificate(cert.id, cert.name)}
                        disabled={openingCertId === cert.id}
                        className="text-[#0090FF] hover:underline text-[10px] font-black uppercase tracking-widest flex items-center gap-1 mt-0.5 disabled:opacity-50"
                      >
                        {openingCertId === cert.id ? 'Abrindo...' : 'Visualizar'}
                        {openingCertId !== cert.id && <ExternalLink size={10} />}
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCertificate(cert.id)}
                    className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Remover"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )
            })}
            {certificateFiles.length === 0 && (
              <div className="text-center py-8 px-4 border-2 border-dashed border-slate-100 rounded-3xl">
                <p className="text-sm text-slate-400 font-medium">Nenhum certificado adicionado ainda.</p>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button size="md" loading={loading} onClick={() => handleSave('certificates')}>
              <Save size={16} />
              Salvar alterações
            </Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        title="Visualizar Vídeo de Apresentação"
        size="md"
      >
        <div className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-sm aspect-[9/16] max-w-xs mx-auto flex items-center justify-center">
          <video 
            src={presentationVideoUrl || undefined} 
            controls 
            autoPlay
            preload="metadata" 
            className="w-full h-full object-cover"
          />
        </div>
      </Modal>
    </div>
  )
}
