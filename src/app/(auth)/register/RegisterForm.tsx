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
import { Footer } from '@/components/Footer'

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Inclua ao menos uma letra maiúscula')
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
    <div className="relative min-h-screen flex flex-col items-center justify-between bg-[#010409] bg-[radial-gradient(circle_at_center,_#020c16_0%,_#010810_50%,_#010409_100%)] selection:bg-[#C5A03F]/20 overflow-x-hidden w-full">
      
      {/* Espaçador flex para centralizar o card */}
      <div className="flex-1 flex items-center justify-center w-full px-6 py-12">
        {/* Container Principal */}
        <div className="relative z-10 w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
        {/* Logo Centralizado (Aumentado para presença forte com máscara circular) */}
        <div className="mb-8 flex justify-center">
          <Link href="/" className="transition-transform hover:scale-105 active:scale-95 duration-500 block">
            <div className="relative w-32 h-32 md:w-36 md:h-36">
              <img
                src="/logo-dark.jpg"
                alt="EA Lumina"
                className="w-full h-full object-contain"
                style={{
                  WebkitMaskImage: 'radial-gradient(circle at center, black 50%, transparent 75%)',
                  maskImage: 'radial-gradient(circle at center, black 50%, transparent 75%)'
                }}
              />
            </div>
          </Link>
        </div>

        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black tracking-tight text-white mb-2">Criar sua conta</h1>
          <p className="text-sm text-slate-400 font-medium tracking-tight">Sua jornada de luz começa agora</p>
        </div>

        {/* Formulário Card com Efeito de Vidro */}
        <div className="bg-black/40 border border-white/5 backdrop-blur-xl shadow-2xl p-8 md:p-10 rounded-[2.5rem]">
          
          {/* Role Selection (Sleek Dark Theme) */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              type="button"
              onClick={() => setValue('role', 'PACIENTE')}
              className={cn(
                'flex items-center justify-center gap-2 p-4 rounded-2xl border transition-all duration-300 text-sm font-bold',
                selectedRole === 'PACIENTE'
                  ? 'bg-white/10 text-white border-white/20 shadow-lg'
                  : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10 hover:text-white'
              )}
            >
              <Heart size={14} className={selectedRole === 'PACIENTE' ? 'text-white' : 'text-slate-400'} />
              Paciente
            </button>
            <button
              type="button"
              onClick={() => setValue('role', 'TERAPEUTA')}
              className={cn(
                'flex items-center justify-center gap-2 p-4 rounded-2xl border transition-all duration-300 text-sm font-bold',
                selectedRole === 'TERAPEUTA'
                  ? 'bg-white/10 text-white border-white/20 shadow-lg'
                  : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10 hover:text-white'
              )}
            >
              <Stethoscope size={14} className={selectedRole === 'TERAPEUTA' ? 'text-white' : 'text-slate-400'} />
              Terapeuta
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <input type="hidden" {...register('role')} />

            <Input
              label="Nome completo"
              placeholder="Seu nome"
              leftIcon={<User size={15} className="text-slate-400" />}
              error={errors.name?.message}
              {...register('name')}
              labelClassName="text-slate-300 font-medium tracking-wide"
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-black/30 focus:border-[#C5A03F]/50 focus:ring-[#C5A03F]/10 text-sm h-11 rounded-xl transition-all duration-300"
            />
            
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              leftIcon={<Mail size={15} className="text-slate-400" />}
              error={errors.email?.message}
              {...register('email')}
              labelClassName="text-slate-300 font-medium tracking-wide"
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-black/30 focus:border-[#C5A03F]/50 focus:ring-[#C5A03F]/10 text-sm h-11 rounded-xl transition-all duration-300"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Senha"
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock size={15} className="text-slate-400" />}
                error={errors.password?.message}
                {...register('password')}
                hint="Mínimo 8 caracteres, 1 maiúscula e 1 número"
                labelClassName="text-slate-300 font-medium tracking-wide"
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-black/30 focus:border-[#C5A03F]/50 focus:ring-[#C5A03F]/10 text-xs h-11 rounded-xl transition-all duration-300"
              />
              <Input
                label="Confirmar"
                type="password"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
                labelClassName="text-slate-300 font-medium tracking-wide"
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-black/30 focus:border-[#C5A03F]/50 focus:ring-[#C5A03F]/10 text-xs h-11 rounded-xl transition-all duration-300"
              />
            </div>

            {selectedRole === 'TERAPEUTA' && (
              <div className="p-4 bg-[#0090FF]/10 rounded-xl text-xs text-[#0090FF] leading-relaxed font-semibold border border-[#0090FF]/20 text-center">
                Análise de perfil necessária após cadastro
              </div>
            )}

            <Button 
              type="submit" 
              fullWidth 
              size="lg" 
              loading={isSubmitting} 
              className="h-14 rounded-2xl bg-[#C5A03F] text-black font-semibold text-xs uppercase tracking-widest shadow-xl shadow-[#C5A03F]/10 hover:bg-[#d6af4b] transition-all group mt-2"
            >
              Criar Conta
              {!isSubmitting && <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </form>

          <div className="mt-8 text-center px-4">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6 leading-relaxed">
              Ao continuar, você aceita nossos{' '}
              <Link href="/termos" className="text-[#C5A03F] hover:text-[#d6af4b] underline underline-offset-4">termos de uso</Link>
            </p>
            
            <div className="pt-6 border-t border-white/5">
               <p className="text-sm text-slate-400 font-medium">
                  Já tem conta?{' '}
                  <Link href="/login" className="text-white font-black uppercase tracking-wider hover:underline underline-offset-4">
                    Fazer Login
                  </Link>
               </p>
            </div>
          </div>
        </div>

        </div>
      </div>
      
      <Footer />
    </div>
  )
}
