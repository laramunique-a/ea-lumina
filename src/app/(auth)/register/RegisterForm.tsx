'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, User, Stethoscope, Heart, Eye, EyeOff, ArrowRight, ChevronLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

const registerSchema = z
  .object({
    name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
    email: z.string().email('E-mail inválido'),
    password: z
      .string()
      .min(8, 'Mínimo 8 caracteres')
      .regex(/[A-Z]/, 'Inclua ao menos uma letra maiúscula')
      .regex(/[0-9]/, 'Inclua ao menos um número'),
    confirmPassword: z.string(),
    role: z.enum(['TERAPEUTA', 'PACIENTE']),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

type RegisterFormInput = z.infer<typeof registerSchema>

const DASHBOARD_BY_ROLE: Record<string, string> = {
  TERAPEUTA: '/dashboard/terapeuta',
  PACIENTE: '/dashboard/paciente',
}

export default function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get('role') === 'TERAPEUTA' ? 'TERAPEUTA' : 'PACIENTE'
  const { setUser, setAccessToken } = useAuthStore()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: defaultRole },
  })

  const selectedRole = watch('role')

  const onSubmit = async (data: RegisterFormInput) => {
    try {
      const { confirmPassword, ...payload } = data
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await res.json()

      if (!result.success) {
        toast.error(result.error || 'Erro ao criar conta')
        return
      }

      setUser(result.data.user)
      setAccessToken(result.data.accessToken)

      toast.success('Conta criada com sucesso!')
      router.push(DASHBOARD_BY_ROLE[result.data.user.role] || '/')
    } catch {
      toast.error('Erro de conexão. Tente novamente.')
    }
  }

  return (
    <div className="w-full h-[100dvh] max-h-[100dvh] bg-[#010409] text-slate-100 font-outfit flex flex-col items-center justify-between relative overflow-hidden px-4 py-2 sm:px-6 sm:py-4 selection:bg-[#E19B28]/20">
      
      {/* ── HEADER DA TELA DE REGISTRO ── */}
      <div className="w-full max-w-[1400px] flex items-center justify-between z-40 shrink-0">
        <Link
          href="/"
          className="text-xs sm:text-sm font-black uppercase tracking-widest text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ChevronLeft size={16} /> Voltar ao Início
        </Link>
        <div className="w-[90px] sm:w-[120px] md:w-[140px] h-auto opacity-95 pointer-events-none drop-shadow-lg">
          <img src="/logo-login.jpg" alt="EA Lumina" className="w-full h-auto object-contain rounded-xl" />
        </div>
      </div>

      {/* ── CARD CENTRAL DE REGISTRO ── */}
      <div className="w-full flex-1 flex items-center justify-center z-10 px-2 my-auto">
        <div className="w-full max-w-[420px] bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col items-center text-center">
          
          {/* Título & Subtítulo */}
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mb-0.5">
            Criar sua conta
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-normal mb-3">
            Sua jornada de bem-estar começa agora
          </p>

          {/* Seleção de Perfil com Rótulo 'EU SOU:' Centralizado */}
          <div className="w-full mb-3 text-center">
            <span className="text-[11px] font-bold tracking-wider text-slate-300 uppercase mb-1 block text-center">
              EU SOU:
            </span>
            <div className="grid grid-cols-2 gap-2.5 w-full">
              <button
                type="button"
                onClick={() => setValue('role', 'PACIENTE')}
                className={cn(
                  'flex items-center justify-center gap-2 py-1.5 px-3 rounded-full border transition-all duration-300 text-xs sm:text-sm font-bold cursor-pointer',
                  selectedRole === 'PACIENTE'
                    ? 'bg-[#0063c6] text-white border-[#0063c6] shadow-md'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                )}
              >
                <Heart size={14} className={selectedRole === 'PACIENTE' ? 'text-white' : 'text-slate-400'} />
                Paciente
              </button>
              <button
                type="button"
                onClick={() => setValue('role', 'TERAPEUTA')}
                className={cn(
                  'flex items-center justify-center gap-2 py-1.5 px-3 rounded-full border transition-all duration-300 text-xs sm:text-sm font-bold cursor-pointer',
                  selectedRole === 'TERAPEUTA'
                    ? 'bg-[#0063c6] text-white border-[#0063c6] shadow-md'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                )}
              >
                <Stethoscope size={14} className={selectedRole === 'TERAPEUTA' ? 'text-white' : 'text-slate-400'} />
                Terapeuta
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-2.5 text-left">
            <input type="hidden" {...register('role')} />

            {/* Nome Completo */}
            <div className="space-y-0.5">
              <label className="text-[11px] font-semibold tracking-wider text-slate-200 uppercase pl-1">
                Nome completo
              </label>
              <div className="relative flex items-center">
                <User size={15} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Seu nome completo"
                  {...register('name')}
                  className="w-full bg-white/5 border border-white/15 text-white placeholder:text-slate-400 rounded-full pl-10 pr-4 py-2 text-xs sm:text-sm focus:outline-none focus:border-[#0063c6] focus:bg-white/[0.08] transition-all"
                />
              </div>
              {errors.name && (
                <p className="text-[10px] text-red-400 pl-3 pt-0.5">{errors.name.message}</p>
              )}
            </div>

            {/* Campo E-mail */}
            <div className="space-y-0.5">
              <label className="text-[11px] font-semibold tracking-wider text-slate-200 uppercase pl-1">
                E-mail
              </label>
              <div className="relative flex items-center">
                <Mail size={15} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  placeholder="seu@email.com"
                  {...register('email')}
                  className="w-full bg-white/5 border border-white/15 text-white placeholder:text-slate-400 rounded-full pl-10 pr-4 py-2 text-xs sm:text-sm focus:outline-none focus:border-[#0063c6] focus:bg-white/[0.08] transition-all"
                />
              </div>
              {errors.email && (
                <p className="text-[10px] text-red-400 pl-3 pt-0.5">{errors.email.message}</p>
              )}
            </div>

            {/* Senha e Confirmar Senha (2 Colunas) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <label className="text-[11px] font-semibold tracking-wider text-slate-200 uppercase pl-1">
                  Senha
                </label>
                <div className="relative flex items-center">
                  <Lock size={15} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('password')}
                    className="w-full bg-white/5 border border-white/15 text-white placeholder:text-slate-400 rounded-full pl-10 pr-9 py-2 text-xs focus:outline-none focus:border-[#0063c6] focus:bg-white/[0.08] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-white transition-colors cursor-pointer p-0.5"
                    title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[10px] text-red-400 pl-3 pt-0.5">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-0.5">
                <label className="text-[11px] font-semibold tracking-wider text-slate-200 uppercase pl-1">
                  Confirmar
                </label>
                <div className="relative flex items-center">
                  <Lock size={15} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('confirmPassword')}
                    className="w-full bg-white/5 border border-white/15 text-white placeholder:text-slate-400 rounded-full pl-10 pr-9 py-2 text-xs focus:outline-none focus:border-[#0063c6] focus:bg-white/[0.08] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 text-slate-400 hover:text-white transition-colors cursor-pointer p-0.5"
                    title={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-[10px] text-red-400 pl-3 pt-0.5">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Botão Criar Conta */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0063c6] hover:bg-[#0052a3] text-white rounded-full py-2.5 sm:py-3 text-xs sm:text-sm font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer mt-1 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Criando conta...</span>
              ) : (
                <>
                  <span>Criar Conta</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Termos & Login Link */}
          <div className="mt-3 pt-2.5 border-t border-white/10 w-full text-center space-y-1">
            <p className="text-[10px] text-slate-400">
              Ao se cadastrar, você concorda com nossos{' '}
              <Link href="/termos" className="text-[#E19B28] hover:underline font-semibold">
                Termos de Uso
              </Link>
            </p>

            <p className="text-xs text-slate-300 font-medium">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-[#E19B28] font-bold hover:underline">
                Fazer Login
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
