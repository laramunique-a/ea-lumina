import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { getAvatarUrl, formatDate } from '@/lib/utils'
import { getProfileCompleteness } from '@/lib/profile-completeness'
import { UserProfileViewModal } from './UserProfileViewModal'
import { 
  Search, ToggleLeft, ToggleRight, Trash2, AlertCircle, 
  CheckCircle, XCircle, Users, UserCheck, ShieldAlert, ChevronLeft, ChevronRight, Info
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useEffect, useState, useCallback } from 'react'
import { withAuth } from '@/lib/auth-fetch'

interface AdminUserListProps {
  mode: 'therapists' | 'users'
}

type Role = 'ADMIN' | 'TERAPEUTA' | 'PACIENTE'

const roleLabel: Record<Role, string> = {
  ADMIN: 'Admin',
  TERAPEUTA: 'Terapeuta',
  PACIENTE: 'Paciente',
}

const roleVariant: Record<Role, 'info' | 'success' | 'default'> = {
  ADMIN: 'info',
  TERAPEUTA: 'success',
  PACIENTE: 'default',
}

export function AdminUserList({ mode }: AdminUserListProps) {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filtros & Paginação
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState<Role | 'ALL'>('ALL')
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)

  // Visualização de Perfil Detalhado
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const loadUsers = useCallback(async () => {
    setLoading(true)
    try {
      let url = `/api/admin/users?page=${page}&perPage=10&sort=name_asc`

      if (mode === 'therapists') {
        url += `&role=TERAPEUTA&approved=false`
      } else {
        if (filterRole !== 'ALL') url += `&role=${filterRole}`
        if (filterActive === 'active') url += `&active=true`
        if (filterActive === 'inactive') url += `&active=false`
      }

      if (search.trim()) {
        url += `&search=${encodeURIComponent(search.trim())}`
      }

      const res = await fetch(url, withAuth({ cache: 'no-store' }))
      const data = await res.json()
      if (data.success) {
        setUsers(data.data || [])
        setTotalPages(data.totalPages || 1)
        setTotalRecords(data.total || 0)
      } else {
        toast.error(data.error || 'Erro ao carregar registros')
      }
    } catch {
      toast.error('Erro de conexão com o servidor')
    } finally {
      setLoading(false)
    }
  }, [page, mode, filterRole, filterActive, search])

  useEffect(() => {
    // Reinicia página para 1 ao mudar filtros
    setPage(1)
  }, [filterRole, filterActive, search])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const handleApprove = async (userId: string, approved: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(approved ? 'Terapeuta aprovado!' : 'Aprovação revogada')
        loadUsers()
        if (selectedUser?.id === userId) {
          setSelectedUser((prev: any) => prev ? { ...prev, therapistProfile: { ...prev.therapistProfile, approved } } : null)
        }
      } else {
        toast.error(data.error || 'Erro ao atualizar terapeuta')
      }
    } catch {
      toast.error('Erro ao atualizar terapeuta')
    }
  }

  const handleToggleActive = async (userId: string, active: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(active ? 'Usuário ativado' : 'Usuário suspenso/desativado')
        loadUsers()
        if (selectedUser?.id === userId) {
          setSelectedUser((prev: any) => prev ? { ...prev, active } : null)
        }
      } else {
        toast.error(data.error || 'Erro ao atualizar usuário')
      }
    } catch {
      toast.error('Erro ao atualizar usuário')
    }
  }

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`TEM CERTEZA? Isso excluirá permanentemente o usuário "${userName}", seus agendamentos, avaliações e conta de login. Esta ação não pode ser desfeita.`)) {
      return
    }

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Usuário excluído com sucesso')
        loadUsers()
        if (selectedUser?.id === userId) {
          setIsModalOpen(false)
          setSelectedUser(null)
        }
      } else {
        toast.error(data.error || 'Erro ao excluir usuário')
      }
    } catch {
      toast.error('Erro ao excluir usuário')
    }
  }

  const openProfileView = (user: any) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  // Estatísticas e contagens rápidas
  const counts = {
    total: totalRecords,
    active: users.filter(u => u.active).length,
    inactive: users.filter(u => !u.active).length,
  }

  return (
    <div className="space-y-5">
      {/* Guia de Ações específico para o modo Terapeutas */}
      {mode === 'therapists' && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3 text-sm text-blue-800 animate-in fade-in slide-in-from-top-4 duration-500">
          <Info className="shrink-0 text-blue-500" size={20} />
          <div className="space-y-1">
            <p className="font-bold">Aprovação de Terapeutas:</p>
            <p className="text-blue-700/80 text-[13px]">
              Esta central exibe exclusivamente terapeutas com cadastros pendentes de revisão. O indicador (❗) sinaliza se há dados obrigatórios ausentes.
            </p>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-surface-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#0090FF]/30 focus:border-[#0090FF]"
          />
        </div>
        
        {mode === 'users' && (
          <div className="flex gap-2 flex-wrap">
            {(['ALL', 'ADMIN', 'TERAPEUTA', 'PACIENTE'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setFilterRole(r)}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  filterRole === r
                    ? 'bg-[#0090FF] text-white shadow-sm shadow-[#0090FF]/25'
                    : 'bg-white border border-surface-200 text-slate-600 hover:bg-surface-50'
                }`}
              >
                {r === 'ALL' ? 'Todos' : roleLabel[r]}
              </button>
            ))}
            
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value as any)}
              className="px-3.5 py-2 rounded-xl text-sm font-semibold border border-surface-200 bg-white text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#0090FF]/30"
            >
              <option value="all">Todos status</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>
        )}
      </div>

      {/* Lista de Registros */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-16 text-slate-400 bg-white rounded-3xl border border-slate-100 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-[#0090FF] border-t-transparent animate-spin" />
            <span className="text-sm font-semibold">Buscando registros...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 text-slate-400 bg-white rounded-3xl border border-slate-100 italic">
            Nenhum registro localizado.
          </div>
        ) : (
          users.map((user) => {
            const completeness = getProfileCompleteness(user)
            const tp = user.therapistProfile || null

            return (
              <div 
                key={user.id} 
                className="bg-white rounded-3xl border border-surface-200 p-5 shadow-[0_2px_8px_-3px_rgba(6,81,237,0.03)] hover:shadow-[0_4px_16px_-4px_rgba(6,81,237,0.08)] hover:border-slate-300/80 transition-all group"
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-4">
                  {/* Foto de Perfil */}
                  <div 
                    onClick={() => openProfileView(user)} 
                    className="relative cursor-pointer shrink-0"
                  >
                    <Image
                      src={getAvatarUrl(user.name, user.avatarUrl)}
                      alt={user.name}
                      width={56}
                      height={56}
                      className="rounded-2xl object-cover border border-slate-100"
                    />
                  </div>

                  {/* Informações */}
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                      <button 
                        type="button"
                        onClick={() => openProfileView(user)}
                        className="font-bold text-slate-800 hover:text-[#0090FF] hover:underline text-base truncate block max-w-xs md:max-w-md text-left"
                      >
                        {user.name}
                      </button>

                      {/* Indicador de Completeness */}
                      {completeness.indicator === 'vermelho' && (
                        <div 
                          className="inline-flex items-center justify-center cursor-help shrink-0 bg-red-50 text-red-600 border border-red-200 rounded-full px-2.5 py-0.5 text-xs font-bold gap-1"
                          title="Perfil incompleto. Existem informações obrigatórias pendentes."
                        >
                          <span>❗</span>
                          <span className="text-[10px] uppercase font-black tracking-wider">Incompleto</span>
                        </div>
                      )}
                      {completeness.indicator === 'laranja' && (
                        <div 
                          className="inline-flex items-center justify-center cursor-help shrink-0 bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2.5 py-0.5 text-xs font-bold gap-1"
                          title="Perfil parcialmente completo. Existem informações opcionais recomendadas que ainda não foram preenchidas."
                        >
                          <span>❗</span>
                          <span className="text-[10px] uppercase font-black tracking-wider">Parcial</span>
                        </div>
                      )}

                      <Badge variant={roleVariant[user.role as Role]} size="sm">
                        {roleLabel[user.role as Role]}
                      </Badge>
                      {tp && (
                        <Badge variant={tp.approved ? 'success' : 'warning'} size="sm">
                          {tp.approved ? 'Aprovado' : 'Pendente'}
                        </Badge>
                      )}
                      {!user.active && <Badge variant="danger" size="sm">Inativo</Badge>}
                    </div>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-xs text-slate-500 font-semibold">
                      <span className="truncate">{user.email}</span>
                      {user.phone && <span className="text-slate-300">•</span>}
                      {user.phone && <span className="text-slate-700 font-bold">{user.phone}</span>}
                      <span className="text-slate-300">•</span>
                      <span>Cadastrado em {formatDate(user.createdAt)}</span>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-2 shrink-0 justify-end w-full sm:w-auto mt-3 sm:mt-0">
                    <Button
                      size="sm"
                      variant="outline"
                      type="button"
                      onClick={() => openProfileView(user)}
                      className="rounded-xl"
                    >
                      Ver Perfil
                    </Button>

                    {mode === 'therapists' && tp && !tp.approved && (
                      <Button
                        size="sm"
                        type="button"
                        onClick={() => handleApprove(user.id, true)}
                        className="bg-[#0090FF] hover:bg-[#0077EE] rounded-xl"
                      >
                        Aprovar
                      </Button>
                    )}

                    {mode === 'users' && (
                      <>
                        <Button
                          size="sm"
                          type="button"
                          variant={user.active ? 'danger' : 'secondary'}
                          onClick={() => handleToggleActive(user.id, !user.active)}
                          className="rounded-xl"
                        >
                          {user.active ? 'Suspender' : 'Ativar'}
                        </Button>
                        <Button
                          size="sm"
                          type="button"
                          variant="secondary"
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100 rounded-xl"
                          title="Excluir permanentemente"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Paginação */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <span className="text-xs text-slate-500 font-semibold">
            Página {page} de {totalPages} ({totalRecords} registros)
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="rounded-xl h-9 px-3"
            >
              <ChevronLeft size={16} className="mr-1" /> Anterior
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="rounded-xl h-9 px-3"
            >
              Próximo <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Modal de Detalhe de Perfil Compartilhado */}
      <UserProfileViewModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedUser(null)
        }}
        user={selectedUser}
        onApprove={mode === 'therapists' ? handleApprove : undefined}
        onToggleActive={handleToggleActive}
      />
    </div>
  )
}
