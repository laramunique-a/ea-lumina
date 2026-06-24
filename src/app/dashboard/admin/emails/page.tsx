'use client'

import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import {
  Mail, Plus, Edit, Trash2, Copy, Send, Eye, RefreshCw, Search,
  Users, CheckCircle, XCircle, Clock, ArrowRight, Loader2, Bold,
  Italic, Underline, Heading1, Heading2, List, ListOrdered, AlignLeft,
  AlignCenter, AlignRight, Link as LinkIcon, Image as ImageIcon, FileText,
  Check, X, ToggleLeft, ToggleRight, ArrowLeft, AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'TERAPEUTA' | 'PACIENTE'
  avatarUrl?: string | null
}

interface EmailTemplate {
  id: string
  name: string
  subject: string
  content: string
  createdAt: string
  updatedAt: string
}

interface EmailAutomation {
  id: string
  trigger: 'WELCOME_THERAPIST' | 'WELCOME_PATIENT' | 'INCOMPLETE_PROFILE'
  subject: string
  content: string
  active: boolean
  createdAt: string
  updatedAt: string
}

interface EmailCampaign {
  id: string
  subject: string
  content: string
  type: 'MANUAL' | 'AUTOMATIC'
  trigger?: string | null
  status: 'PENDING' | 'SENDING' | 'SUCCESS' | 'FAILED' | 'WITH_FAILURES'
  recipientsCount: number
  createdAt: string
  updatedAt: string
}

interface EmailLog {
  id: string
  recipientEmail: string
  recipientName?: string | null
  status: 'SUCCESS' | 'FAILED' | 'DELIVERED' | 'BOUNCED'
  errorMessage?: string | null
  sentAt: string
}

export default function EmailsDashboardPage() {
  const [activeTab, setActiveTab] = useState<'send' | 'templates' | 'automations' | 'history'>('send')

  // Listagem de usuários para seleção de destinatários
  const [users, setUsers] = useState<User[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [userSearch, setUserSearch] = useState('')
  const [userRoleFilter, setUserRoleFilter] = useState<'ALL' | 'TERAPEUTA' | 'PACIENTE'>('ALL')
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])

  // Editor manual
  const [emailSubject, setEmailSubject] = useState('')
  const [emailContent, setEmailContent] = useState('')
  const editorRef = useRef<HTMLDivElement>(null)
  const imageUploadRef = useRef<HTMLInputElement>(null)

  // Templates
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loadingTemplates, setLoadingTemplates] = useState(false)
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const [templateForm, setTemplateForm] = useState({ id: '', name: '', subject: '', content: '' })
  const templateEditorRef = useRef<HTMLDivElement>(null)

  // Automações
  const [automations, setAutomations] = useState<EmailAutomation[]>([])
  const [loadingAutomations, setLoadingAutomations] = useState(false)
  const [isAutomationModalOpen, setIsAutomationModalOpen] = useState(false)
  const [selectedAutomation, setSelectedAutomation] = useState<EmailAutomation | null>(null)
  const automationEditorRef = useRef<HTMLDivElement>(null)

  // Histórico
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([])
  const [loadingCampaigns, setLoadingCampaigns] = useState(false)
  const [campaignSearch, setCampaignSearch] = useState('')
  const [campaignTypeFilter, setCampaignTypeFilter] = useState<'ALL' | 'MANUAL' | 'AUTOMATIC'>('ALL')
  const [selectedCampaignDetail, setSelectedCampaignDetail] = useState<EmailCampaign | null>(null)
  const [campaignLogs, setCampaignLogs] = useState<EmailLog[]>([])
  const [loadingLogs, setLoadingLogs] = useState(false)

  // Visualização de Prévia do E-mail
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewSubject, setPreviewSubject] = useState('')
  const [previewContent, setPreviewContent] = useState('')

  // Envio em Lote (Batch Sending Status)
  const [showConfirmSendModal, setShowConfirmSendModal] = useState(false)
  const [isSendingBatch, setIsSendingBatch] = useState(false)
  const [batchProgress, setBatchProgress] = useState(0) // 0 a 100
  const [batchSuccessCount, setBatchSuccessCount] = useState(0)
  const [batchFailedCount, setBatchFailedCount] = useState(0)
  const [batchTotalCount, setBatchTotalCount] = useState(0)
  const cancelBatchRef = useRef<boolean>(false)

  // Carregar dados iniciais
  useEffect(() => {
    fetchUsers()
    fetchTemplates()
    fetchAutomations()
    fetchCampaigns()
  }, [])

  // Buscar usuários para listagem
  const fetchUsers = async () => {
    setLoadingUsers(true)
    try {
      // Buscar até 1000 usuários para permitir seleção abrangente
      const res = await fetch('/api/admin/users?perPage=1000')
      const data = await res.json()
      if (data.success) {
        // Excluir ADMINs da seleção de e-mails
        setUsers(data.data.filter((u: User) => u.role !== 'ADMIN'))
      } else {
        toast.error('Erro ao buscar usuários para destinatários')
      }
    } catch {
      toast.error('Falha de rede ao buscar usuários')
    } finally {
      setLoadingUsers(false)
    }
  }

  // Buscar templates
  const fetchTemplates = async () => {
    setLoadingTemplates(true)
    try {
      const res = await fetch('/api/admin/emails/templates')
      const data = await res.json()
      if (data.success) {
        setTemplates(data.templates)
      }
    } catch {
      toast.error('Erro ao buscar templates')
    } finally {
      setLoadingTemplates(false)
    }
  }

  // Buscar automações
  const fetchAutomations = async () => {
    setLoadingAutomations(true)
    try {
      const res = await fetch('/api/admin/emails/automations')
      const data = await res.json()
      if (data.success) {
        setAutomations(data.automations)
      }
    } catch {
      toast.error('Erro ao buscar automações')
    } finally {
      setLoadingAutomations(false)
    }
  }

  // Buscar campanhas
  const fetchCampaigns = async () => {
    setLoadingCampaigns(true)
    try {
      const res = await fetch('/api/admin/emails/campaigns')
      const data = await res.json()
      if (data.success) {
        setCampaigns(data.campaigns)
      }
    } catch {
      toast.error('Erro ao buscar histórico de envios')
    } finally {
      setLoadingCampaigns(false)
    }
  }

  // Obter logs de uma campanha específica
  const fetchCampaignLogs = async (id: string) => {
    setLoadingLogs(true)
    try {
      const res = await fetch(`/api/admin/emails/campaigns/${id}`)
      const data = await res.json()
      if (data.success) {
        setCampaignLogs(data.campaign.logs || [])
      }
    } catch {
      toast.error('Erro ao buscar detalhes de logs')
    } finally {
      setLoadingLogs(false)
    }
  }

  // Filtragem de usuários no client side
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
    const matchesRole = userRoleFilter === 'ALL' || u.role === userRoleFilter
    return matchesSearch && matchesRole
  })

  // Selecionar/Deselecionar todos os filtrados
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const idsToAdd = filteredUsers.map((u) => u.id)
      setSelectedUserIds((prev) => Array.from(new Set([...prev, ...idsToAdd])))
    } else {
      const idsToRemove = filteredUsers.map((u) => u.id)
      setSelectedUserIds((prev) => prev.filter((id) => !idsToRemove.includes(id)))
    }
  }

  // Alternar checkbox de usuário único
  const handleToggleSelectUser = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((uId) => uId !== id) : [...prev, id]
    )
  }

  // Limpar seleção
  const handleClearSelection = () => {
    setSelectedUserIds([])
  }

  // Formatação do Editor WYSIWYG
  // IMPORTANTE: capturamos o innerHTML ANTES de chamar setState para evitar
  // que o callback do setState acesse uma ref já desmontada (null) no React 18.
  const executeCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      const content = editorRef.current.innerHTML
      setEmailContent(content)
    }
    if (templateEditorRef.current) {
      const content = templateEditorRef.current.innerHTML
      setTemplateForm(prev => ({ ...prev, content }))
    }
    if (automationEditorRef.current && selectedAutomation) {
      const content = automationEditorRef.current.innerHTML
      setSelectedAutomation(prev => prev ? ({ ...prev, content }) : null)
    }
  }

  const insertLink = () => {
    const url = prompt('Digite a URL do link:')
    if (url) executeCommand('createLink', url)
  }

  const insertImage = () => {
    if (imageUploadRef.current) {
      imageUploadRef.current.click()
    }
  }

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    e.target.value = ''

    if (!file.type.startsWith('image/')) {
      toast.error('Selecione uma imagem válida (JPG, PNG).')
      return
    }

    const uploadToast = toast.loading('Enviando imagem...')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'emailImage')

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()

      if (data.success && data.data?.url) {
        toast.success('Imagem inserida com sucesso!', { id: uploadToast })
        executeCommand('insertImage', data.data.url)
      } else {
        toast.error(data.error || 'Erro ao enviar imagem', { id: uploadToast })
      }
    } catch (err) {
      toast.error('Falha de rede ao enviar imagem', { id: uploadToast })
    }
  }

  // Carregar template para o editor manual
  const handleUseTemplate = (tpl: EmailTemplate) => {
    setEmailSubject(tpl.subject)
    setEmailContent(tpl.content)
    setActiveTab('send')
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = tpl.content
      }
    }, 50)
    toast.success('Template carregado!')
  }

  // CRUD de Templates
  const handleOpenTemplateModal = (tpl?: EmailTemplate) => {
    if (tpl) {
      setTemplateForm({ id: tpl.id, name: tpl.name, subject: tpl.subject, content: tpl.content })
      setTimeout(() => {
        if (templateEditorRef.current) templateEditorRef.current.innerHTML = tpl.content
      }, 50)
    } else {
      setTemplateForm({ id: '', name: '', subject: '', content: '' })
      setTimeout(() => {
        if (templateEditorRef.current) templateEditorRef.current.innerHTML = ''
      }, 50)
    }
    setIsTemplateModalOpen(true)
  }

  const handleSaveTemplate = async () => {
    if (!templateForm.name || !templateForm.subject || !templateForm.content) {
      toast.error('Por favor, preencha todos os campos.')
      return
    }

    const isEdit = !!templateForm.id
    const url = isEdit
      ? `/api/admin/emails/templates/${templateForm.id}`
      : '/api/admin/emails/templates'
    const method = isEdit ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateForm)
      })
      const data = await res.json()
      if (data.success) {
        toast.success(data.message)
        setIsTemplateModalOpen(false)
        fetchTemplates()
      } else {
        toast.error(data.error || 'Erro ao salvar template')
      }
    } catch {
      toast.error('Erro de conexão ao salvar template')
    }
  }

  const handleDuplicateTemplate = async (tpl: EmailTemplate) => {
    try {
      const res = await fetch('/api/admin/emails/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${tpl.name} (Cópia)`,
          subject: tpl.subject,
          content: tpl.content
        })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Template duplicado!')
        fetchTemplates()
      } else {
        toast.error('Erro ao duplicar template')
      }
    } catch {
      toast.error('Erro de rede ao duplicar')
    }
  }

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Deseja realmente excluir este template?')) return
    try {
      const res = await fetch(`/api/admin/emails/templates/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        toast.success('Template removido!')
        fetchTemplates()
      } else {
        toast.error('Erro ao excluir template')
      }
    } catch {
      toast.error('Erro de rede ao excluir')
    }
  }

  // Automações
  const handleToggleAutomation = async (aut: EmailAutomation) => {
    try {
      const updated = { ...aut, active: !aut.active }
      const res = await fetch('/api/admin/emails/automations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      })
      const data = await res.json()
      if (data.success) {
        toast.success(`Automação ${updated.active ? 'ativada' : 'desativada'}!`)
        fetchAutomations()
      } else {
        toast.error('Erro ao atualizar automação')
      }
    } catch {
      toast.error('Erro de rede ao alternar automação')
    }
  }

  const handleOpenAutomationModal = (aut: EmailAutomation) => {
    setSelectedAutomation(aut)
    setTimeout(() => {
      if (automationEditorRef.current) automationEditorRef.current.innerHTML = aut.content
    }, 50)
    setIsAutomationModalOpen(true)
  }

  const handleSaveAutomation = async () => {
    if (!selectedAutomation) return
    try {
      const res = await fetch('/api/admin/emails/automations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedAutomation)
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Automação atualizada com sucesso!')
        setIsAutomationModalOpen(false)
        fetchAutomations()
      } else {
        toast.error('Erro ao salvar automação')
      }
    } catch {
      toast.error('Erro de rede ao salvar')
    }
  }

  // Visualizar Prévia
  const handleOpenPreview = (subj: string, body: string) => {
    setPreviewSubject(subj)
    setPreviewContent(body)
    setIsPreviewOpen(true)
  }

  // ENVIO EM MASSA - LÓGICA DE LOTES (Client-Controlled Batching)
  const handleStartSendProcess = () => {
    if (selectedUserIds.length === 0) {
      toast.error('Selecione pelo menos um destinatário.')
      return
    }
    if (!emailSubject.trim()) {
      toast.error('Defina um assunto para o e-mail.')
      return
    }
    if (!emailContent.trim() || emailContent === '<br>') {
      toast.error('Escreva o conteúdo do e-mail.')
      return
    }

    setShowConfirmSendModal(true)
  }

  const handleConfirmSend = async () => {
    setShowConfirmSendModal(false)
    setIsSendingBatch(true)
    setBatchProgress(0)
    setBatchSuccessCount(0)
    setBatchFailedCount(0)
    setBatchTotalCount(selectedUserIds.length)
    cancelBatchRef.current = false

    const recipientsToProcess = users
      .filter((u) => selectedUserIds.includes(u.id))
      .map((u) => ({ id: u.id, email: u.email, name: u.name }))

    let campaignId = ''

    // 1. Criar a campanha em status SENDING no banco
    try {
      const campaignRes = await fetch('/api/admin/emails/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: emailSubject,
          content: emailContent,
          type: 'MANUAL',
          recipientsCount: recipientsToProcess.length
        })
      })
      const campaignData = await campaignRes.json()
      if (campaignData.success) {
        campaignId = campaignData.campaign.id
      } else {
        toast.error('Não foi possível iniciar o log da campanha no banco.')
        setIsSendingBatch(false)
        return
      }
    } catch (err) {
      console.error(err)
      toast.error('Erro ao conectar com o banco de dados.')
      setIsSendingBatch(false)
      return
    }

    // 2. Dividir em lotes de 15 destinatários
    const BATCH_SIZE = 15
    const totalRecipients = recipientsToProcess.length
    const batches = []
    for (let i = 0; i < totalRecipients; i += BATCH_SIZE) {
      batches.push(recipientsToProcess.slice(i, i + BATCH_SIZE))
    }

    let successAccumulator = 0
    let failedAccumulator = 0

    // 3. Processar lotes sequencialmente
    for (let index = 0; index < batches.length; index++) {
      if (cancelBatchRef.current) {
        toast.error('Envio cancelado pelo administrador.')
        break
      }

      const currentBatch = batches[index]

      try {
        const sendRes = await fetch('/api/admin/emails/send-batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            campaignId,
            recipients: currentBatch,
            subject: emailSubject,
            content: emailContent
          })
        })

        const sendData = await sendRes.json()
        if (sendData.success) {
          successAccumulator += sendData.successCount
          failedAccumulator += sendData.failedCount
        } else {
          failedAccumulator += currentBatch.length
        }
      } catch (err) {
        console.error(err)
        failedAccumulator += currentBatch.length
      }

      setBatchSuccessCount(successAccumulator)
      setBatchFailedCount(failedAccumulator)
      setBatchProgress(Math.min(100, Math.round(((index + 1) / batches.length) * 100)))
    }

    // 4. Finalizar campanha no banco com o status correto
    try {
      const finalStatus = failedAccumulator === totalRecipients ? 'FAILED' : 'SUCCESS'
      await fetch(`/api/admin/emails/campaigns/${campaignId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: finalStatus,
          recipientsCount: successAccumulator + failedAccumulator
        })
      })
    } catch (err) {
      console.error('Erro ao fechar campanha:', err)
    }

    // Recarregar histórico e limpar editor
    fetchCampaigns()
    if (!cancelBatchRef.current) {
      toast.success('Envio concluído com sucesso!')
      // Limpar campos
      setEmailSubject('')
      setEmailContent('')
      setSelectedUserIds([])
      if (editorRef.current) editorRef.current.innerHTML = ''
    }
  }

  // Filtragem de Campanhas no Histórico
  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch = c.subject.toLowerCase().includes(campaignSearch.toLowerCase())
    const matchesType = campaignTypeFilter === 'ALL' || c.type === campaignTypeFilter
    return matchesSearch && matchesType
  })

  return (
    <div className="p-6 space-y-6">
      {/* Cabeçalho do módulo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Mail className="text-[#0090FF]" size={26} />
            E-mails e Marketing
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Envie comunicados manuais, crie templates reutilizáveis e gerencie automações de cadastro.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        {(['send', 'templates', 'automations', 'history'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-bold border-b-2 transition-all ${
              activeTab === tab
                ? 'border-[#0090FF] text-[#0090FF]'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            {tab === 'send' && 'Envio de E-mail'}
            {tab === 'templates' && 'Templates'}
            {tab === 'automations' && 'Automações'}
            {tab === 'history' && 'Histórico de Envios'}
          </button>
        ))}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ABA: ENVIO DE E-MAIL
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'send' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Seleção de Destinatários */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Users size={16} className="text-[#0090FF]" />
                Destinatários ({selectedUserIds.length})
              </h2>
              {selectedUserIds.length > 0 && (
                <button
                  onClick={handleClearSelection}
                  className="text-xs text-rose-500 hover:underline font-semibold"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Filtros de Papel */}
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-0.5 rounded-xl">
              {(['ALL', 'TERAPEUTA', 'PACIENTE'] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setUserRoleFilter(role)}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                    userRoleFilter === role
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {role === 'ALL' ? 'Todos' : role === 'TERAPEUTA' ? 'Terapeutas' : 'Pacientes'}
                </button>
              ))}
            </div>

            {/* Pesquisa */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nome ou email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-[#0090FF]/30 focus:border-[#0090FF]"
              />
            </div>

            {/* Listagem com Checkbox */}
            <div className="border border-slate-100 rounded-xl overflow-hidden max-h-[300px] overflow-y-auto divide-y divide-slate-50">
              {/* Selecionar todos os filtrados */}
              <label className="flex items-center gap-3 px-3 py-2.5 bg-slate-50 hover:bg-slate-100/80 cursor-pointer select-none text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={
                    filteredUsers.length > 0 &&
                    filteredUsers.every((u) => selectedUserIds.includes(u.id))
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-slate-300 text-[#0090FF] focus:ring-[#0090FF]/30"
                />
                Selecionar Todos ({filteredUsers.length})
              </label>

              {loadingUsers ? (
                <div className="p-8 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-[#0090FF]" />
                  Carregando lista...
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs italic">
                  Nenhum usuário correspondente.
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <label
                    key={user.id}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50/80 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUserIds.includes(user.id)}
                      onChange={() => handleToggleSelectUser(user.id)}
                      className="rounded border-slate-300 text-[#0090FF] focus:ring-[#0090FF]/30"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                    </div>
                    <Badge variant={user.role === 'TERAPEUTA' ? 'warning' : 'info'} size="sm">
                      {user.role === 'TERAPEUTA' ? 'Terapeuta' : 'Paciente'}
                    </Badge>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Editor e Formulário */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Assunto do E-mail</label>
              <input
                type="text"
                placeholder="Ex: Novidades na plataforma, recados gerais..."
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0090FF]/30 focus:border-[#0090FF]"
              />
            </div>

            {/* WYSIWYG Editor Toolbar */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-600">Conteúdo do E-mail</label>
              
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                {/* Toolbar */}
                <div className="flex flex-wrap gap-1 p-2 bg-slate-50 border-b border-slate-200">
                  <button
                    type="button"
                    onClick={() => executeCommand('bold')}
                    title="Negrito"
                    className="p-1.5 hover:bg-slate-200 rounded text-slate-600"
                  >
                    <Bold size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => executeCommand('italic')}
                    title="Itálico"
                    className="p-1.5 hover:bg-slate-200 rounded text-slate-600"
                  >
                    <Italic size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => executeCommand('underline')}
                    title="Sublinhado"
                    className="p-1.5 hover:bg-slate-200 rounded text-slate-600"
                  >
                    <Underline size={14} />
                  </button>
                  <span className="w-px h-6 bg-slate-200 mx-1" />
                  
                  <button
                    type="button"
                    onClick={() => executeCommand('formatBlock', '<h1>')}
                    title="Título 1"
                    className="p-1.5 hover:bg-slate-200 rounded text-slate-600 font-bold"
                  >
                    <Heading1 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => executeCommand('formatBlock', '<h2>')}
                    title="Título 2"
                    className="p-1.5 hover:bg-slate-200 rounded text-slate-600 font-bold"
                  >
                    <Heading2 size={14} />
                  </button>
                  <span className="w-px h-6 bg-slate-200 mx-1" />

                  <button
                    type="button"
                    onClick={() => executeCommand('insertUnorderedList')}
                    title="Lista Marcadores"
                    className="p-1.5 hover:bg-slate-200 rounded text-slate-600"
                  >
                    <List size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => executeCommand('insertOrderedList')}
                    title="Lista Numerada"
                    className="p-1.5 hover:bg-slate-200 rounded text-slate-600"
                  >
                    <ListOrdered size={14} />
                  </button>
                  <span className="w-px h-6 bg-slate-200 mx-1" />

                  <button
                    type="button"
                    onClick={() => executeCommand('justifyLeft')}
                    title="Alinhar Esquerda"
                    className="p-1.5 hover:bg-slate-200 rounded text-slate-600"
                  >
                    <AlignLeft size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => executeCommand('justifyCenter')}
                    title="Alinhar Centro"
                    className="p-1.5 hover:bg-slate-200 rounded text-slate-600"
                  >
                    <AlignCenter size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => executeCommand('justifyRight')}
                    title="Alinhar Direita"
                    className="p-1.5 hover:bg-slate-200 rounded text-slate-600"
                  >
                    <AlignRight size={14} />
                  </button>
                  <span className="w-px h-6 bg-slate-200 mx-1" />

                  <button
                    type="button"
                    onClick={insertLink}
                    title="Inserir Link"
                    className="p-1.5 hover:bg-slate-200 rounded text-slate-600"
                  >
                    <LinkIcon size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={insertImage}
                    title="Inserir Imagem por URL"
                    className="p-1.5 hover:bg-slate-200 rounded text-slate-600"
                  >
                    <ImageIcon size={14} />
                  </button>
                </div>

                {/* Área editável */}
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={(e) => {
                    const content = e.currentTarget.innerHTML;
                    setEmailContent(content);
                  }}
                  className="p-4 min-h-[300px] max-h-[400px] overflow-y-auto outline-none prose prose-sm max-w-none text-slate-800 bg-white"
                  style={{ minHeight: '300px' }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1 italic">
                Dica: Digite <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[9px] text-[#0090FF]">&#123;&#123;nome&#125;&#125;</code> para inserir automaticamente o nome completo de cada destinatário.
              </p>
            </div>

            {/* Ações */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                type="button"
                className="flex items-center gap-2"
                onClick={() => handleOpenPreview(emailSubject, emailContent)}
              >
                <Eye size={16} />
                Pré-visualizar
              </Button>
              <Button
                variant="primary"
                type="button"
                className="flex items-center gap-2 bg-[#0090FF] hover:bg-[#0090FF]/90 border-none"
                onClick={handleStartSendProcess}
              >
                <Send size={16} />
                Enviar E-mail ({selectedUserIds.length})
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          ABA: TEMPLATES (MODELOS)
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-700">Templates Criados ({templates.length})</h2>
            <Button
              variant="primary"
              className="flex items-center gap-2 bg-[#0090FF] hover:bg-[#0090FF]/90 border-none text-xs py-2 px-3"
              onClick={() => handleOpenTemplateModal()}
            >
              <Plus size={14} />
              Novo Template
            </Button>
          </div>

          {loadingTemplates ? (
            <div className="text-center py-20 text-slate-400 bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center gap-2">
              <Loader2 className="animate-spin text-[#0090FF]" />
              Buscando templates...
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-20 text-slate-400 bg-white rounded-2xl border border-slate-200 italic">
              Nenhum template cadastrado ainda. Crie um modelo clicando no botão acima.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="default" size="sm" className="bg-slate-100 text-slate-700 font-bold border-none">
                        Template
                      </Badge>
                      <span className="text-[10px] text-slate-400">
                        {new Date(tpl.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-800 truncate">{tpl.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      <span className="font-semibold">Assunto: </span>
                      {tpl.subject}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-5 border-t border-slate-50 pt-3">
                    <button
                      onClick={() => handleUseTemplate(tpl)}
                      className="flex-1 py-1.5 bg-[#0090FF]/5 hover:bg-[#0090FF]/15 text-[#0090FF] text-xs font-bold rounded-xl transition-all"
                    >
                      Usar no Envio
                    </button>
                    <button
                      onClick={() => handleOpenTemplateModal(tpl)}
                      title="Editar"
                      className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDuplicateTemplate(tpl)}
                      title="Duplicar"
                      className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(tpl.id)}
                      title="Excluir"
                      className="p-1.5 hover:bg-rose-50 rounded text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          ABA: AUTOMAÇÕES
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'automations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-700">Automações do Sistema ({automations.length})</h2>
          </div>

          {loadingAutomations ? (
            <div className="text-center py-20 text-slate-400 bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center gap-2">
              <Loader2 className="animate-spin text-[#0090FF]" />
              Buscando automações...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {automations.map((aut) => {
                const isWelcomeTherapist = aut.trigger === 'WELCOME_THERAPIST'
                const isWelcomePatient = aut.trigger === 'WELCOME_PATIENT'
                const isProfileIncomplete = aut.trigger === 'INCOMPLETE_PROFILE'

                return (
                  <div
                    key={aut.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Badge e Status */}
                      <div className="flex justify-between items-center">
                        <Badge
                          variant={isWelcomeTherapist ? 'warning' : isWelcomePatient ? 'info' : 'danger'}
                          size="sm"
                          className="font-bold border-none"
                        >
                          {isWelcomeTherapist && 'Terapeuta'}
                          {isWelcomePatient && 'Paciente'}
                          {isProfileIncomplete && 'Cadastro'}
                        </Badge>

                        <button
                          onClick={() => handleToggleAutomation(aut)}
                          className="flex items-center focus:outline-none"
                        >
                          {aut.active ? (
                            <ToggleRight size={28} className="text-[#0090FF]" />
                          ) : (
                            <ToggleLeft size={28} className="text-slate-300" />
                          )}
                        </button>
                      </div>

                      {/* Título e Regras */}
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-slate-800">
                          {isWelcomeTherapist && 'Boas-vindas para Terapeutas'}
                          {isWelcomePatient && 'Boas-vindas para Pacientes'}
                          {isProfileIncomplete && 'Perfil Incompleto (Alerta)'}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {isWelcomeTherapist && 'Regra: Disparado automaticamente assim que o terapeuta conclui o formulário de cadastro.'}
                          {isWelcomePatient && 'Regra: Disparado automaticamente assim que o paciente conclui o formulário de cadastro.'}
                          {isProfileIncomplete && 'Regra: Disparado apenas uma vez após 4 dias de cadastro se faltar dados obrigatórios.'}
                        </p>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Assunto Atual</span>
                        <span className="text-xs font-semibold text-slate-700 block truncate mt-0.5">{aut.subject}</span>
                      </div>
                    </div>

                    <div className="mt-6 flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleOpenPreview(aut.subject, aut.content)}
                        className="flex-1 text-xs py-2"
                      >
                        Ver E-mail
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => handleOpenAutomationModal(aut)}
                        className="flex-1 text-xs py-2 bg-slate-800 border-none hover:bg-slate-900"
                      >
                        Configurar
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          ABA: HISTÓRICO DE ENVIOS
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          
          {/* Barra de Filtros */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por assunto..."
                value={campaignSearch}
                onChange={(e) => setCampaignSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#0090FF]/30 focus:border-[#0090FF]"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {(['ALL', 'MANUAL', 'AUTOMATIC'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setCampaignTypeFilter(type)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    campaignTypeFilter === type
                      ? 'bg-[#0090FF] text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {type === 'ALL' ? 'Todos' : type === 'MANUAL' ? 'Manuais' : 'Automáticos'}
                </button>
              ))}
            </div>
          </div>

          {/* Tabela do Histórico */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left px-5 py-3.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Data e Hora</th>
                    <th className="text-left px-5 py-3.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Assunto</th>
                    <th className="text-left px-5 py-3.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Tipo</th>
                    <th className="text-left px-5 py-3.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Destinatários</th>
                    <th className="text-left px-5 py-3.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="text-center px-5 py-3.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingCampaigns ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                        <Loader2 className="animate-spin text-[#0090FF] mx-auto mb-2" />
                        Carregando histórico...
                      </td>
                    </tr>
                  ) : filteredCampaigns.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-slate-400 italic">
                        Nenhum envio registrado.
                      </td>
                    </tr>
                  ) : (
                    filteredCampaigns.map((camp) => (
                      <tr key={camp.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">
                          {new Date(camp.createdAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="px-5 py-4 font-semibold text-slate-900 truncate max-w-[200px] md:max-w-[300px]">
                          {camp.subject}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <Badge variant={camp.type === 'MANUAL' ? 'default' : 'info'} size="sm">
                            {camp.type === 'MANUAL' ? 'Manual' : 'Automático'}
                          </Badge>
                        </td>
                        <td className="px-5 py-4 text-xs font-bold text-slate-700 whitespace-nowrap">
                          {camp.recipientsCount}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          {camp.status === 'SUCCESS' && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                              <CheckCircle size={14} /> Enviado
                            </span>
                          )}
                          {camp.status === 'WITH_FAILURES' && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600">
                              <AlertTriangle size={14} /> Falha
                            </span>
                          )}
                          {camp.status === 'FAILED' && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600">
                              <XCircle size={14} /> Falha
                            </span>
                          )}
                          {camp.status === 'SENDING' && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-500">
                              <Loader2 size={14} className="animate-spin" /> Enviando
                            </span>
                          )}
                          {camp.status === 'PENDING' && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400">
                              <Clock size={14} /> Pendente
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-center whitespace-nowrap">
                          <button
                            onClick={() => {
                              setSelectedCampaignDetail(camp)
                              fetchCampaignLogs(camp.id)
                            }}
                            className="text-xs font-bold text-[#0090FF] hover:underline"
                          >
                            Ver Detalhes
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: CONFIRMAR ENVIO MANUAL
      ───────────────────────────────────────────────────────────── */}
      {showConfirmSendModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-lg font-black text-slate-800">Confirmar Envio</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Você está prestes a disparar este e-mail para <strong className="text-slate-800 font-extrabold">{selectedUserIds.length}</strong> destinatário(s).
              Este processo será enviado em lotes automáticos. Por favor, mantenha esta guia aberta até a conclusão do envio.
            </p>
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="outline" onClick={() => setShowConfirmSendModal(false)}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                className="bg-emerald-600 hover:bg-emerald-700 border-none"
                onClick={handleConfirmSend}
              >
                Sim, Enviar Agora!
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: PROGRESSO DO ENVIO EM BATCH
      ───────────────────────────────────────────────────────────── */}
      {isSendingBatch && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-[2px] flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-xl space-y-5 text-center">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-800">
                {batchProgress < 100 ? 'Enviando E-mails...' : 'Envio Concluído!'}
              </h3>
              <p className="text-xs text-slate-400 font-semibold">
                Campanha em processamento
              </p>
            </div>

            {/* Progresso Visual */}
            <div className="space-y-2">
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-100">
                <div
                  className="bg-gradient-to-r from-[#0090FF] to-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${batchProgress}%` }}
                />
              </div>
              <span className="text-xs font-bold text-slate-600">{batchProgress}% completo</span>
            </div>

            {/* Estatísticas do Lote */}
            <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-slate-100">
              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400">Sucesso</span>
                <p className="text-base font-extrabold text-emerald-600 mt-0.5">{batchSuccessCount}</p>
              </div>
              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400">Falhou</span>
                <p className="text-base font-extrabold text-rose-600 mt-0.5">{batchFailedCount}</p>
              </div>
              <div className="text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total</span>
                <p className="text-base font-extrabold text-slate-800 mt-0.5">{batchTotalCount}</p>
              </div>
            </div>

            {/* Botão de Fechar ou Cancelar */}
            <div className="pt-2 flex justify-center">
              {batchProgress < 100 ? (
                <Button
                  variant="outline"
                  className="border-rose-200 text-rose-600 hover:bg-rose-50"
                  onClick={() => {
                    cancelBatchRef.current = true
                  }}
                >
                  Cancelar Envio
                </Button>
              ) : (
                <Button
                  variant="primary"
                  className="bg-[#0090FF] border-none hover:bg-[#0090FF]/90 px-8"
                  onClick={() => setIsSendingBatch(false)}
                >
                  Fechar
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: PRÉVIA DO E-MAIL (MOCK EMAIL CLIENT)
      ───────────────────────────────────────────────────────────── */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-[#F3F4F6] rounded-3xl border border-slate-200 shadow-xl max-w-2xl w-full mx-4 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header com estilo de janela do cliente de e-mail */}
            <div className="bg-white px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs font-bold text-slate-400 ml-2">Visualizador de E-mail</span>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {/* Cabeçalho do e-mail */}
            <div className="bg-white px-6 py-4 border-b border-slate-100 space-y-2 text-xs">
              <div className="flex">
                <span className="font-bold text-slate-400 w-16">De:</span>
                <span className="text-slate-700">EA Lumina &lt;contato@ealumina.com&gt;</span>
              </div>
              <div className="flex">
                <span className="font-bold text-slate-400 w-16">Para:</span>
                <span className="text-slate-700">usuario@exemplo.com (Substituição de &#123;&#123;nome&#125;&#125; simulada)</span>
              </div>
              <div className="flex">
                <span className="font-bold text-slate-400 w-16">Assunto:</span>
                <span className="font-bold text-slate-800">{previewSubject || '(Sem Assunto)'}</span>
              </div>
            </div>

            {/* Corpo do e-mail mockado */}
            <div className="flex-1 p-6 overflow-y-auto bg-white flex justify-center">
              <div
                className="prose prose-sm max-w-[600px] w-full"
                dangerouslySetInnerHTML={{
                  __html: (previewContent || '<p className="text-slate-400 italic">E-mail sem conteúdo</p>')
                    .replace(/\{\{nome\}\}/g, 'Nome do Usuário')
                }}
              />
            </div>
            
            <div className="bg-white px-5 py-3 border-t border-slate-100 flex justify-end">
              <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
                Fechar Prévia
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: DETALHES DA CAMPANHA E LOGS DE AUDITORIA
      ───────────────────────────────────────────────────────────── */}
      {selectedCampaignDetail && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-4xl w-full mx-4 overflow-hidden flex flex-col h-[85vh]">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-800 truncate max-w-[500px]">
                  {selectedCampaignDetail.subject}
                </h3>
                <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                  ID: {selectedCampaignDetail.id} | Tipo: {selectedCampaignDetail.type}
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedCampaignDetail(null)
                  setCampaignLogs([])
                }}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {/* Conteúdo dividido: E-mail e Logs */}
            <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-2">
              
              {/* E-mail Content Preview */}
              <div className="border-r border-slate-100 p-5 overflow-y-auto flex flex-col space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2">
                  E-mail Enviado
                </h4>
                <div className="bg-slate-50 rounded-2xl p-4 flex-1 overflow-y-auto text-sm">
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: selectedCampaignDetail.content }}
                  />
                </div>
              </div>

              {/* Logs */}
              <div className="p-5 overflow-y-auto flex flex-col space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2">
                  Auditoria de Logs ({campaignLogs.length} destinatários)
                </h4>
                
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {loadingLogs ? (
                    <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                      <Loader2 className="animate-spin text-[#0090FF]" />
                      Buscando logs...
                    </div>
                  ) : campaignLogs.length === 0 ? (
                    <div className="py-20 text-center text-slate-400 text-xs italic">
                      Nenhum destinatário registrado para este envio.
                    </div>
                  ) : (
                    campaignLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-100 rounded-xl flex items-center justify-between text-xs transition-colors"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-bold text-slate-800 truncate">
                            {log.recipientName || 'Usuário'}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">
                            {log.recipientEmail}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          {log.status === 'DELIVERED' ? (
                            <Badge variant="success" size="sm">✓ Entregue</Badge>
                          ) : log.status === 'SUCCESS' ? (
                            <Badge variant="info" size="sm">Enviado</Badge>
                          ) : log.status === 'BOUNCED' ? (
                            <div className="space-y-0.5 flex flex-col items-end text-right">
                              <Badge variant="danger" size="sm">Falha</Badge>
                              <p className="text-[10px] text-rose-500 font-bold leading-tight max-w-[200px]" title={log.errorMessage || ''}>
                                {log.errorMessage || 'E-mail rejeitado'}
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-0.5 flex flex-col items-end text-right">
                              <Badge variant="danger" size="sm">Falha</Badge>
                              <p className="text-[10px] text-rose-500 font-bold leading-tight max-w-[200px]" title={log.errorMessage || ''}>
                                {log.errorMessage || 'Erro SMTP'}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCampaignDetail(null)
                  setCampaignLogs([])
                }}
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: CRUD TEMPLATES
      ───────────────────────────────────────────────────────────── */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-2xl w-full mx-4 overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-800">
                {templateForm.id ? 'Editar Template' : 'Criar Template'}
              </h3>
              <button
                onClick={() => setIsTemplateModalOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Nome do Template (Interno)</label>
                <input
                  type="text"
                  placeholder="Ex: Alerta de Black Friday, Informativo Mensal..."
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0090FF]/30 focus:border-[#0090FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Assunto Padrão</label>
                <input
                  type="text"
                  placeholder="Assunto que será preenchido automaticamente ao carregar o template"
                  value={templateForm.subject}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0090FF]/30 focus:border-[#0090FF]"
                />
              </div>

              {/* Editor WYSIWYG do Template */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-600">Conteúdo do E-mail</label>
                
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  {/* Toolbar */}
                  <div className="flex flex-wrap gap-1 p-2 bg-slate-50 border-b border-slate-200">
                    <button
                      type="button"
                      onClick={() => executeCommand('bold')}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600"
                    >
                      <Bold size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => executeCommand('italic')}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600"
                    >
                      <Italic size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => executeCommand('underline')}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600"
                    >
                      <Underline size={13} />
                    </button>
                    <span className="w-px h-5 bg-slate-200 mx-1" />

                    <button
                      type="button"
                      onClick={() => executeCommand('formatBlock', '<h1>')}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600 font-bold"
                    >
                      <Heading1 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => executeCommand('formatBlock', '<h2>')}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600 font-bold"
                    >
                      <Heading2 size={13} />
                    </button>
                    <span className="w-px h-5 bg-slate-200 mx-1" />

                    <button
                      type="button"
                      onClick={() => executeCommand('insertUnorderedList')}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600"
                    >
                      <List size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => executeCommand('insertOrderedList')}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600"
                    >
                      <ListOrdered size={13} />
                    </button>
                    <span className="w-px h-5 bg-slate-200 mx-1" />

                    <button
                      type="button"
                      onClick={insertLink}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600"
                    >
                      <LinkIcon size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={insertImage}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600"
                    >
                      <ImageIcon size={13} />
                    </button>
                  </div>

                  {/* Área editável */}
                  <div
                    ref={templateEditorRef}
                    contentEditable
                    onInput={(e) => {
                      const content = e.currentTarget.innerHTML;
                      setTemplateForm(prev => ({ ...prev, content }));
                    }}
                    className="p-4 min-h-[250px] max-h-[350px] overflow-y-auto outline-none prose prose-sm max-w-none text-slate-800 bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsTemplateModalOpen(false)}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                className="bg-[#0090FF] border-none hover:bg-[#0090FF]/90"
                onClick={handleSaveTemplate}
              >
                Salvar Template
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: CONFIGURAR AUTOMATIZAÇÃO
      ───────────────────────────────────────────────────────────── */}
      {isAutomationModalOpen && selectedAutomation && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-2xl w-full mx-4 overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-800">Configurar Automação</h3>
                <span className="text-[10px] text-[#0090FF] font-bold block uppercase tracking-wider mt-0.5">
                  Gatilho: {selectedAutomation.trigger}
                </span>
              </div>
              <button
                onClick={() => setIsAutomationModalOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Assunto do E-mail</label>
                <input
                  type="text"
                  placeholder="Assunto do e-mail automático..."
                  value={selectedAutomation.subject}
                  onChange={(e) => setSelectedAutomation(prev => prev ? ({ ...prev, subject: e.target.value }) : null)}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0090FF]/30 focus:border-[#0090FF]"
                />
              </div>

              {/* Editor WYSIWYG da Automação */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-600">Conteúdo do E-mail</label>
                
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  {/* Toolbar */}
                  <div className="flex flex-wrap gap-1 p-2 bg-slate-50 border-b border-slate-200">
                    <button
                      type="button"
                      onClick={() => executeCommand('bold')}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600"
                    >
                      <Bold size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => executeCommand('italic')}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600"
                    >
                      <Italic size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => executeCommand('underline')}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600"
                    >
                      <Underline size={13} />
                    </button>
                    <span className="w-px h-5 bg-slate-200 mx-1" />

                    <button
                      type="button"
                      onClick={() => executeCommand('formatBlock', '<h1>')}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600 font-bold"
                    >
                      <Heading1 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => executeCommand('formatBlock', '<h2>')}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600 font-bold"
                    >
                      <Heading2 size={13} />
                    </button>
                    <span className="w-px h-5 bg-slate-200 mx-1" />

                    <button
                      type="button"
                      onClick={() => executeCommand('insertUnorderedList')}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600"
                    >
                      <List size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => executeCommand('insertOrderedList')}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600"
                    >
                      <ListOrdered size={13} />
                    </button>
                    <span className="w-px h-5 bg-slate-200 mx-1" />

                    <button
                      type="button"
                      onClick={insertLink}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600"
                    >
                      <LinkIcon size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={insertImage}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600"
                    >
                      <ImageIcon size={13} />
                    </button>
                  </div>

                  {/* Área editável */}
                  <div
                    ref={automationEditorRef}
                    contentEditable
                    onInput={(e) => {
                      const content = e.currentTarget.innerHTML;
                      setSelectedAutomation(prev => prev ? ({ ...prev, content }) : null);
                    }}
                    className="p-4 min-h-[250px] max-h-[350px] overflow-y-auto outline-none prose prose-sm max-w-none text-slate-800 bg-white"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1 italic">
                  Utilize <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[9px] text-[#0090FF]">&#123;&#123;nome&#125;&#125;</code> para preencher com o nome dinâmico do cadastrado.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAutomationModalOpen(false)}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                className="bg-[#0090FF] border-none hover:bg-[#0090FF]/90"
                onClick={handleSaveAutomation}
              >
                Salvar Automação
              </Button>
            </div>

          </div>
        </div>
      )}

      <input
        type="file"
        ref={imageUploadRef}
        onChange={handleImageFileChange}
        accept="image/jpeg, image/png, image/webp"
        className="hidden"
      />
    </div>
  )
}
