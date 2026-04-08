'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Mail, Lock, User, Stethoscope, Heart, ArrowRight } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Inclua ao menos uma maiúscula')
    .regex(/[0-9]/, 'Inclua ao menos um número'),
  confirmPassword: z.string(),
  role: z.enum(['TERAPEUTA', 'PACIENTE']),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

type RegisterForm = z.infer<typeof registerSchema>

const DASHBOARD_BY_ROLE: Record<string, string> = {
  TERAPEUTA: '/dashboard/terapeuta',
  PACIENTE: '/dashboard/paciente',
}

export default function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get('role') === 'TERAPEUTA' ? 'TERAPEUTA' : 'PACIENTE'
  const { setUser, setAccessToken } = useAuthStore()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: defaultRole },
  })

  const selectedRole = watch('role')

  const onSubmit = async (data: RegisterForm) => {
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
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-white px-6 py-12 selection:bg-[#C5A03F]/20 overflow-hidden">
      
      {/* Container Principal */}
      <div className="relative z-10 w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
        {/* Logo Centralizado (Aumentado para presença forte) */}
        <div className="mb-12 flex justify-center">
          <Link href="/" className="transition-transform hover:scale-105 active:scale-95 duration-500">
            <Logo className="scale-[1.8]" iconOnly />
          </Link>
        </div>

        {/* Cabeçalho */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-2">Criar sua conta</h1>
          <p className="text-sm text-slate-400 font-medium tracking-tight">Sua jornada de luz começa agora</p>
        </div>

        {/* Formulário Card */}
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
          
          {/* Role Selection (Sleek) */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              type="button"
              onClick={() => setValue('role', 'PACIENTE')}
              className={cn(
                'flex items-center justify-center gap-2 p-4 rounded-2xl border transition-all duration-300 text-sm font-bold',
                selectedRole === 'PACIENTE'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200'
                  : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'
              )}
            >
              <Heart size={14} />
              Paciente
            </button>
            <button
              type="button"
              onClick={() => setValue('role', 'TERAPEUTA')}
              className={cn(
                'flex items-center justify-center gap-2 p-4 rounded-2xl border transition-all duration-300 text-sm font-bold',
                selectedRole === 'TERAPEUTA'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200'
                  : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'
              )}
            >
              <Stethoscope size={14} />
              Terapeuta
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <input type="hidden" {...register('role')} />

            <Input
              label="Nome completo"
              placeholder="Seu nome"
              leftIcon={<User size={15} className="text-slate-300" />}
              error={errors.name?.message}
              {...register('name')}
              className="bg-slate-50/50 border-transparent focus:bg-white focus:border-slate-200 h-11 rounded-xl transition-all"
            />
            
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              leftIcon={<Mail size={15} className="text-slate-300" />}
              error={errors.email?.message}
              {...register('email')}
              className="bg-slate-50/50 border-transparent focus:bg-white focus:border-slate-200 h-11 rounded-xl transition-all"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Senha"
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock size={15} className="text-slate-300" />}
                error={errors.password?.message}
                {...register('password')}
                className="bg-slate-50/50 border-transparent focus:bg-white focus:border-slate-200 h-11 rounded-xl transition-all text-xs"
              />
              <Input
                label="Confirmar"
                type="password"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
                className="bg-slate-50/50 border-transparent focus:bg-white focus:border-slate-200 h-11 rounded-xl transition-all text-xs"
              />
            </div>

            {selectedRole === 'TERAPEUTA' && (
              <div className="p-4 bg-[#0090FF]/5 rounded-xl text-xs text-[#0090FF] leading-relaxed font-semibold border border-[#0090FF]/10 text-center">
                Análise de perfil necessária após cadastro
              </div>
            )}

            <Button 
              type="submit" 
              fullWidth 
              size="lg" 
              loading={isSubmitting} 
              className="h-14 rounded-2xl bg-slate-900 text-white font-bold text-sm shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all group mt-2"
            >
              Criar Conta
              {!isSubmitting && <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </form>

          <div className="mt-8 text-center px-4">
            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mb-6 leading-relaxed">
              Ao continuar, você aceita nossos{' '}
              <Link href="/termos" className="text-slate-400 hover:text-slate-900 underline underline-offset-4">termos de uso</Link>
            </p>
            
            <div className="pt-6 border-t border-slate-100">
               <p className="text-sm text-slate-400 font-medium">
                  Já tem conta?{' '}
                  <Link href="/login" className="text-slate-900 font-black uppercase tracking-wider hover:underline underline-offset-4">
                    Fazer Login
                  </Link>
               </p>
            </div>
          </div>
        </div>

        {/* Footer Minimalista */}
        <div className="mt-12 text-center">
            <p className="text-xs text-slate-300 font-bold uppercase tracking-wider">EA LUMINA • JORNADA DE LUZ</p>
        </div>
      </div>
    </div>
  )
}
