'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, Eye, EyeOff, ArrowRight, ChevronLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/hooks/useAuth'

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
})

type LoginForm = z.infer<typeof loginSchema>

const DASHBOARD_BY_ROLE: Record<string, string> = {
  ADMIN: '/dashboard/admin',
  TERAPEUTA: '/dashboard/terapeuta',
  PACIENTE: '/dashboard/paciente',
}

export default function LoginPage() {
  const router = useRouter()
  const { setUser, setAccessToken } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (!result.success) {
        toast.error(result.error || 'Credenciais inválidas')
        return
      }
      setUser(result.data.user)
      setAccessToken(result.data.accessToken)
      toast.success(`Bem-vindo de volta, ${result.data.user.name.split(' ')[0]}!`)
      router.push(DASHBOARD_BY_ROLE[result.data.user.role] || '/')
    } catch {
      toast.error('Erro de conexão. Tente novamente.')
    }
  }

  return (
    <div className="w-full h-[100dvh] max-h-[100dvh] bg-[#010409] text-slate-100 font-outfit flex flex-col items-center justify-between relative overflow-hidden px-4 py-3 sm:p-6 selection:bg-[#E19B28]/20">
      
      {/* ── HEADER DA TELA DE LOGIN ── */}
      <div className="w-full max-w-[1400px] flex items-center justify-between z-40 shrink-0">
        <Link
          href="/"
          className="text-xs sm:text-sm font-black uppercase tracking-widest text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ChevronLeft size={16} /> Voltar ao Início
        </Link>
        <div className="w-[100px] sm:w-[130px] md:w-[150px] h-auto opacity-95 pointer-events-none drop-shadow-lg">
          <img src="/logo-login.jpg" alt="EA Lumina" className="w-full h-auto object-contain rounded-xl" />
        </div>
      </div>

      {/* ── CARD CENTRAL DE LOGIN (PERFEITAMENTE CENTRALIZADO) ── */}
      <div className="w-full flex-1 flex items-center justify-center z-10 px-2 my-auto">
        <div className="w-full max-w-[400px] bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col items-center text-center">
          
          {/* Título & Subtítulo */}
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mb-1">
            Entrar na sua conta
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-normal mb-5">
            Acesse seu painel EALUMINA
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4 text-left">
            {/* Campo E-mail */}
            <div className="space-y-1">
              <label className="text-xs font-semibold tracking-wider text-slate-200 uppercase pl-1">
                E-mail
              </label>
              <div className="relative flex items-center">
                <Mail size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  placeholder="seu@email.com"
                  {...register('email')}
                  className="w-full bg-white/5 border border-white/15 text-white placeholder:text-slate-400 rounded-full pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#0063c6] focus:bg-white/[0.08] transition-all"
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-red-400 pl-3 pt-0.5">{errors.email.message}</p>
              )}
            </div>

            {/* Campo Senha */}
            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-semibold tracking-wider text-slate-200 uppercase">
                  Senha
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-slate-300 hover:text-white font-medium transition-colors"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative flex items-center">
                <Lock size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className="w-full bg-white/5 border border-white/15 text-white placeholder:text-slate-400 rounded-full pl-10 pr-10 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#0063c6] focus:bg-white/[0.08] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
                  title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-400 pl-3 pt-0.5">{errors.password.message}</p>
              )}
            </div>

            {/* Botão Acessar */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0063c6] hover:bg-[#0052a3] text-white rounded-full py-2.5 sm:py-3 text-xs sm:text-sm font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer mt-1 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Acessando...</span>
              ) : (
                <>
                  <span>Acessar</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Link para cadastro */}
          <div className="mt-5 pt-3.5 border-t border-white/10 w-full text-center">
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Ainda não tem uma conta?{' '}
              <Link href="/register" className="text-[#E19B28] font-bold hover:underline">
                Criar conta
              </Link>
            </p>
          </div>

        </div>
      </div>

      {/* ── FOOTER VISÍVEL NA BASE DA TELA ── */}
      <div className="z-20 text-[11px] sm:text-xs text-slate-400 font-medium tracking-wide shrink-0 pb-1">
        © {new Date().getFullYear()} EALUMINA. Todos os direitos reservados.
      </div>
    </div>
  )
}
