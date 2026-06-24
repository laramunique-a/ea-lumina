'use client'

import { AdminUserList } from '@/components/admin/AdminUserList'

export default function AdminUsersPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Gestão de Usuários</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">Visualização e controle de todos os usuários cadastrados.</p>
      </div>

      <AdminUserList mode="users" />
    </div>
  )
}
