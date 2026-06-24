import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { getAvatarUrl } from '@/lib/utils'
import { getProfileCompleteness } from '@/lib/profile-completeness'
import { 
  X, AlertCircle, CheckCircle2, FileText, Download, Eye, 
  User, MapPin, Briefcase, Award, Globe
} from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { withAuth } from '@/lib/auth-fetch'

interface UserProfileViewModalProps {
  isOpen: boolean
  onClose: () => void
  user: any
  onApprove?: (userId: string, approved: boolean) => Promise<void>
  onToggleActive?: (userId: string, active: boolean) => Promise<void>
}

export function UserProfileViewModal({
  isOpen,
  onClose,
  user,
  onApprove,
  onToggleActive,
}: UserProfileViewModalProps) {
  const [docLoading, setDocLoading] = useState(false)
  const [isPhotoZoomed, setIsPhotoZoomed] = useState(false)

  // Escuta tecla ESC para fechar o zoom da foto
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPhotoZoomed(false)
      }
    }
    if (isPhotoZoomed) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isPhotoZoomed])

  if (!user) return null

  const completeness = getProfileCompleteness(user)
  const tp = user.therapistProfile || null
  const pp = user.patientProfile || null
  const role = user.role

  const openDocument = async (mode: 'view' | 'download') => {
    setDocLoading(true)
    try {
      const res = await fetch(`/api/documents/access?userId=${user.id}`, withAuth())
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
        a.download = tp?.documentFileName || data.data.fileName || 'documento'
        a.click()
      }
    } catch {
      toast.error('Erro ao acessar o documento')
    } finally {
      setDocLoading(false)
    }
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsPhotoZoomed(false)
    }
  }

  // Renderiza um campo individual
  const renderField = (
    label: string,
    value: any,
    fieldName: string,
    isMandatory: boolean = false
  ) => {
    const isMissing = role !== 'ADMIN' && (
      completeness.missingMandatory.some(m => m.field === fieldName) || 
      completeness.missingOptional.some(o => o.field === fieldName)
    )

    return (
      <div 
        className={`p-3.5 rounded-xl border transition-all ${
          isMissing 
            ? isMandatory 
              ? 'border-red-200 bg-red-50/30' 
              : 'border-amber-200 bg-amber-50/20'
            : 'border-slate-100 bg-slate-50/50'
        }`}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
          {role !== 'ADMIN' && (
            isMissing ? (
              <span 
                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  isMandatory 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {isMandatory ? 'Obrigatório Pendente' : 'Opcional'}
              </span>
            ) : (
              isMandatory && <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Obrigatório</span>
            )
          )}
        </div>
        <div className={`text-sm font-medium ${isMissing ? 'text-slate-400 italic' : 'text-slate-800'}`}>
          {isMissing ? 'Não preenchido' : (value !== null && value !== undefined && String(value).trim() !== '' ? String(value) : 'Não informado')}
        </div>
      </div>
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Perfil Completo do Usuário"
      size="xl"
    >
      <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-1">
        {/* Cabecalho Principal */}
        <div className="flex flex-col md:flex-row items-center gap-5 p-5 bg-slate-50 rounded-3xl border border-slate-100/60">
          <div 
            onClick={() => setIsPhotoZoomed(true)}
            className="relative group cursor-pointer overflow-hidden rounded-2xl flex-shrink-0"
            title="Clique para ampliar a foto"
          >
            <Image
              src={getAvatarUrl(user.name, user.avatarUrl)}
              alt={user.name}
              width={72}
              height={72}
              className="w-[72px] h-[72px] rounded-2xl border-2 border-white shadow-sm object-cover transition-transform group-hover:scale-105 duration-200"
            />
            <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-2xl">
              <Eye className="text-white shrink-0" size={18} />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left min-w-0">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1.5">
              <h3 className="text-lg font-black text-slate-800 tracking-tight">{user.name}</h3>
              <Badge variant={user.role === 'ADMIN' ? 'info' : user.role === 'TERAPEUTA' ? 'success' : 'default'} size="sm">
                {user.role}
              </Badge>
              {user.active ? (
                <Badge variant="success" size="sm">Ativo</Badge>
              ) : (
                <Badge variant="danger" size="sm">Inativo</Badge>
              )}
              {tp && (
                <Badge variant={tp.approved ? 'success' : 'warning'} size="sm">
                  {tp.approved ? 'Aprovado' : 'Pendente de Aprovação'}
                </Badge>
              )}
            </div>
            <p className="text-sm text-slate-500 font-medium">{user.email}</p>
          </div>
        </div>

        {/* Banner de Completeness */}
        {role !== 'ADMIN' && (
          <div 
            className={`p-5 rounded-3xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
              completeness.status === 'Incompleto' 
                ? 'bg-red-50/50 border-red-100 text-red-900' 
                : completeness.status === 'Parcialmente Completo'
                  ? 'bg-amber-50/50 border-amber-100 text-amber-900'
                  : 'bg-green-50/50 border-green-100 text-green-900'
            }`}
          >
            <div className="flex gap-3">
              <div className="mt-0.5">
                {completeness.status === 'Incompleto' ? (
                  <AlertCircle className="text-red-500 shrink-0" size={22} />
                ) : completeness.status === 'Parcialmente Completo' ? (
                  <AlertCircle className="text-amber-500 shrink-0" size={22} />
                ) : (
                  <CheckCircle2 className="text-green-600 shrink-0" size={22} />
                )}
              </div>
              <div>
                <p className="text-base font-black tracking-tight">Status do Perfil: {completeness.status}</p>
                <div className="flex gap-4 text-xs font-semibold mt-1 opacity-80">
                  <span>Campos obrigatórios pendentes: {completeness.missingMandatory.length}</span>
                  <span>Campos opcionais pendentes: {completeness.missingOptional.length}</span>
                </div>
              </div>
            </div>
            {completeness.status !== 'Completo' && (
              <div className="text-xs bg-white/70 border border-current/15 rounded-xl p-3 max-w-md">
                <span className="font-bold">Pendências: </span>
                {completeness.status === 'Incompleto' 
                  ? completeness.missingMandatory.map(m => m.label).join(', ')
                  : completeness.missingOptional.map(o => o.label).join(', ')
                }
              </div>
            )}
          </div>
        )}

        {/* 1. SEÇÃO: DADOS PESSOAIS */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
          <h4 className="text-sm font-black text-slate-800 tracking-wider uppercase flex items-center gap-2 px-1 pb-2 border-b border-slate-100/80">
            <User size={16} className="text-[#0090FF]" />
            Dados Pessoais
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {role === 'TERAPEUTA' && tp ? (
              <>
                {renderField('Nome de Cadastro', user.name, 'name', true)}
                {renderField('Nome Profissional', tp.professionalName, 'professionalName', true)}
                {renderField('E-mail de Cadastro', user.email, 'email', true)}
                {renderField('E-mail Profissional', tp.professionalEmail, 'professionalEmail', true)}
                {renderField('WhatsApp / Telefone', user.phone || tp.whatsapp, 'whatsapp', true)}
                {renderField('Data de Nascimento', user.birthDate ? new Date(user.birthDate).toLocaleDateString('pt-BR') : '', 'birthDate', true)}
                {renderField('Nacionalidade', tp.nationality, 'nationality', false)}
                {renderField('Idiomas', tp.languages?.join(', '), 'languages', false)}
              </>
            ) : role === 'PACIENTE' && pp ? (
              <>
                {renderField('Nome Completo', user.name, 'name', true)}
                {renderField('Nome Social', pp.socialName, 'socialName', false)}
                {renderField('E-mail', user.email, 'email', true)}
                {renderField('Telefone (WhatsApp)', user.phone, 'phone', true)}
                {renderField('Data de Nascimento', user.birthDate ? new Date(user.birthDate).toLocaleDateString('pt-BR') : '', 'birthDate', true)}
                {renderField('Gênero', pp.gender, 'gender', false)}
                {renderField('Estado Civil', pp.maritalStatus, 'maritalStatus', false)}
                {renderField('Profissão', pp.profession, 'profession', false)}
              </>
            ) : (
              // ADMIN
              <>
                {renderField('Nome Completo', user.name, 'name', true)}
                {renderField('E-mail', user.email, 'email', true)}
                {renderField('Telefone', user.phone, 'phone', false)}
                {renderField('Data de Nascimento', user.birthDate ? new Date(user.birthDate).toLocaleDateString('pt-BR') : '', 'birthDate', false)}
              </>
            )}
          </div>
        </div>

        {/* 2. SEÇÃO: ENDEREÇO */}
        {role !== 'ADMIN' && (
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h4 className="text-sm font-black text-slate-800 tracking-wider uppercase flex items-center gap-2 px-1 pb-2 border-b border-slate-100/80">
              <MapPin size={16} className="text-[#0090FF]" />
              Endereço
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {role === 'TERAPEUTA' && tp ? (
                <>
                  {renderField('País', tp.country, 'country', true)}
                  {renderField('Estado (UF)', tp.state, 'state', true)}
                  {renderField('Cidade', tp.city, 'city', false)}
                  {renderField('Modalidade de Atendimento', tp.modality, 'modality', true)}
                  
                  {tp.modality === 'ONLINE' ? (
                    <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/20 sm:col-span-2 lg:col-span-3 flex items-center gap-2 text-xs font-semibold text-blue-700">
                      <Globe size={14} /> Atendimento 100% Online. Sem endereço físico cadastrado.
                    </div>
                  ) : (
                    (() => {
                      let cep = '', street = '', number = '', neighborhood = ''
                      if (tp.location && tp.location.includes(';;;')) {
                        const parts = tp.location.split(';;;')
                        cep = parts[0] || ''
                        street = parts[1] || ''
                        number = parts[2] || ''
                        neighborhood = parts[3] || ''
                      }
                      return (
                        <>
                          {renderField('CEP do Consultório', cep, 'address.cep', true)}
                          {renderField('Logradouro', street, 'address.street', true)}
                          {renderField('Número', number, 'address.number', true)}
                          {renderField('Bairro', neighborhood, 'address.neighborhood', true)}
                        </>
                      )
                    })()
                  )}
                </>
              ) : (
                // PACIENTE
                <>
                  {renderField('CEP', pp?.zipCode, 'zipCode', false)}
                  {renderField('Cidade', pp?.city, 'city', false)}
                  {renderField('Estado (UF)', pp?.state, 'state', false)}
                  {renderField('Bairro', pp?.neighborhood, 'neighborhood', false)}
                  {renderField('Rua', pp?.street, 'street', false)}
                  {renderField('Número', pp?.number, 'number', false)}
                  {renderField('Complemento', pp?.complement, 'complement', false)}
                </>
              )}
            </div>
          </div>
        )}

        {/* 3. SEÇÃO: DADOS PROFISSIONAIS */}
        {role === 'TERAPEUTA' && tp && (
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h4 className="text-sm font-black text-slate-800 tracking-wider uppercase flex items-center gap-2 px-1 pb-2 border-b border-slate-100/80">
              <Briefcase size={16} className="text-[#0090FF]" />
              Dados Profissionais
            </h4>
            
            {/* Biografia / Formação */}
            <div className="space-y-1">
              {renderField('Biografia / Formação', tp.bio, 'bio', true)}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderField('Anos de Experiência', tp.yearsExp != null ? `${tp.yearsExp} anos` : '', 'yearsExp', false)}
              {renderField('Valor da Sessão (Preset)', tp.price ? `R$ ${Number(tp.price).toFixed(2)}` : '', 'price', false)}
              
              {/* Especialidades */}
              <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 sm:col-span-2 lg:col-span-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Especialidades / Terapias</span>
                <div className="flex flex-wrap gap-1">
                  {tp.therapies && tp.therapies.length > 0 ? (
                    tp.therapies.map((t: string) => (
                      <Badge key={t} variant="default" size="sm">
                        {t}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs font-medium text-slate-400 italic">Nenhuma especialidade registrada</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. SEÇÃO: DOCUMENTAÇÃO */}
        {role === 'TERAPEUTA' && tp && (
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h4 className="text-sm font-black text-slate-800 tracking-wider uppercase flex items-center gap-2 px-1 pb-2 border-b border-slate-100/80">
              <Award size={16} className="text-[#0090FF]" />
              Documentação
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Documento de Identidade */}
              <div className={`p-5 rounded-2xl border ${(!tp.documentUrl || tp.documentUrl.trim() === '') ? 'border-red-200 bg-red-50/20' : 'border-slate-100 bg-slate-50/50'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-700">Comprovante de Identidade (RG/CNH/Passaporte)</span>
                  {(!tp.documentUrl || tp.documentUrl.trim() === '') ? (
                    <Badge variant="danger" size="sm">Pendente</Badge>
                  ) : (
                    <Badge variant="success" size="sm">Enviado</Badge>
                  )}
                </div>
                
                {tp.documentUrl ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200">
                      <FileText className="text-slate-400 shrink-0" size={18} />
                      <span className="text-xs font-medium text-slate-700 truncate block max-w-[200px]" title={tp.documentFileName}>
                        {tp.documentFileName || 'documento_identidade'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openDocument('view')}
                        loading={docLoading}
                        className="flex-1 text-xs"
                      >
                        <Eye size={12} className="mr-1" /> Ver
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openDocument('download')}
                        loading={docLoading}
                        className="flex-1 text-xs"
                      >
                        <Download size={12} className="mr-1" /> Baixar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-red-600 font-semibold italic mt-1">O terapeuta ainda não anexou o comprovante de identidade obrigatório.</p>
                )}
              </div>

              {/* Certificados Acadêmicos */}
              <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-700">Certificações e Diplomas</span>
                  <Badge variant="default" size="sm">{tp.certificates?.length || 0} anexados</Badge>
                </div>
                
                <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                  {tp.certificates && tp.certificates.length > 0 ? (
                    tp.certificates.map((cert: any) => (
                      <div key={cert.id} className="flex items-center justify-between gap-3 p-2 bg-white border border-slate-100 rounded-xl">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="text-[#0090FF] shrink-0" size={14} />
                          <span className="text-xs font-semibold text-slate-700 truncate" title={cert.name}>{cert.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => window.open(`/api/therapists/${tp.id}/certificates/${cert.id}/view`, '_blank', 'noopener,noreferrer')}
                          className="text-[#0090FF] hover:underline text-[10px] font-black uppercase flex items-center gap-0.5"
                        >
                          Ver <Eye size={10} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic mt-2">Nenhum diploma ou certificado adicional cadastrado.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. SEÇÃO: INFORMAÇÕES COMPLEMENTARES */}
        {role === 'TERAPEUTA' && tp && (
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h4 className="text-sm font-black text-slate-800 tracking-wider uppercase flex items-center gap-2 px-1 pb-2 border-b border-slate-100/80">
              <Globe size={16} className="text-[#0090FF]" />
              Informações Complementares
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderField('Instagram', tp.instagram, 'instagram', false)}
              {renderField('Facebook', tp.facebook, 'facebook', false)}
              {renderField('Site Pessoal', tp.websiteUrl, 'websiteUrl', false)}
              {renderField('Vídeo de Apresentação', tp.presentationVideoUrl, 'presentationVideoUrl', false)}
            </div>
          </div>
        )}

        {role === 'PACIENTE' && pp && (
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h4 className="text-sm font-black text-slate-800 tracking-wider uppercase flex items-center gap-2 px-1 pb-2 border-b border-slate-100/80">
              <FileText size={16} className="text-[#0090FF]" />
              Informações Complementares (Anamnese)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderField('Objetivo Terapêutico', pp.anamnese?.objetivo, 'anamnese.objetivo', false)}
              {renderField('Histórico Emocional', pp.anamnese?.historicoEmocional, 'anamnese.historicoEmocional', false)}
              {renderField('Expectativas', pp.anamnese?.expectativas, 'anamnese.expectativas', false)}
              {renderField('Uso de Medicamentos', pp.anamnese?.medicamentos, 'anamnese.medicamentos', false)}
              {renderField('Alergias / Restrições', pp.anamnese?.alergias, 'anamnese.alergias', false)}
            </div>
          </div>
        )}

        {/* Ações Administrativas */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-5 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">
            Fechar
          </Button>

          {onToggleActive && (
            <Button
              type="button"
              variant={user.active ? 'danger' : 'secondary'}
              onClick={() => onToggleActive(user.id, !user.active)}
              className="rounded-xl"
            >
              {user.active ? 'Suspender/Desativar Usuário' : 'Reativar Usuário'}
            </Button>
          )}

          {role === 'TERAPEUTA' && tp && onApprove && (
            <>
              {tp.approved ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (window.confirm('Revogar a aprovação deste terapeuta?')) {
                      onApprove(user.id, false)
                    }
                  }}
                  className="text-red-600 border-red-200 hover:bg-red-50 rounded-xl"
                >
                  Revogar Aprovação
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => onApprove(user.id, true)}
                  className="bg-[#0090FF] hover:bg-[#0077EE] rounded-xl"
                >
                  Aprovar Cadastro
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Visualizador de Foto de Perfil Ampliado (Zoom) */}
      {isPhotoZoomed && (
        <div 
          onClick={handleOverlayClick}
          className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300 animate-in fade-in"
        >
          <button
            onClick={() => setIsPhotoZoomed(false)}
            className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 text-white rounded-full p-2.5 transition-all outline-none border border-white/10"
            title="Fechar (ESC)"
          >
            <X size={20} />
          </button>
          <div className="relative max-w-full max-h-[85vh] md:max-w-2xl md:max-h-[80vh] shadow-2xl rounded-2xl overflow-hidden border border-white/10 bg-slate-950">
            <Image
              src={getAvatarUrl(user.name, user.avatarUrl)}
              alt={user.name}
              width={600}
              height={600}
              className="w-auto h-auto max-w-[90vw] max-h-[80vh] object-contain mx-auto"
              unoptimized
            />
          </div>
        </div>
      )}
    </Modal>
  )
}
