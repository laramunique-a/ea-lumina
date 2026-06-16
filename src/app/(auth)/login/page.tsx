'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/hooks/useAuth'
import { Logo } from '@/components/ui/Logo'

const loginSchema = z.object({
  email:    z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
})

type LoginForm = z.infer<typeof loginSchema>

const DASHBOARD_BY_ROLE: Record<string, string> = {
  ADMIN:     '/dashboard/admin',
  TERAPEUTA: '/dashboard/terapeuta',
  PACIENTE:  '/dashboard/paciente',
}

export default function LoginPage() {
  const router = useRouter()
  const { setUser, setAccessToken } = useAuthStore()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
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
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#010409] bg-[radial-gradient(circle_at_center,_#020c16_0%,_#010810_50%,_#010409_100%)] px-6 py-12 selection:bg-[#C5A03F]/20 overflow-hidden">
      
      {/* Conteúdo Principal */}
      <div className="relative z-10 w-full max-w-[400px] animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
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

        {/* Cabeçalho do Card */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black tracking-tight text-white mb-2">Entrar na sua conta</h1>
          <p className="text-sm text-slate-400 font-normal tracking-tight max-w-[280px] mx-auto leading-relaxed">
            Faça seu login e gerencie sua jornada de bem-estar
          </p>
        </div>

        {/* Formulário com Efeito de Vidro */}
        <div className="bg-black/40 border border-white/5 backdrop-blur-xl shadow-2xl p-8 md:p-10 rounded-3xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              leftIcon={<Mail size={15} className="text-slate-400" />}
              error={errors.email?.message}
              {...register('email')}
              labelClassName="text-slate-300 font-medium tracking-wide"
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-black/30 focus:border-[#C5A03F]/50 focus:ring-[#C5A03F]/10 text-sm h-12 rounded-xl transition-all duration-300"
            />
            
            <div className="space-y-2">
              <Input
                label="Senha"
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock size={15} className="text-slate-400" />}
                error={errors.password?.message}
                {...register('password')}
                labelClassName="text-slate-300 font-medium tracking-wide"
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-black/30 focus:border-[#C5A03F]/50 focus:ring-[#C5A03F]/10 text-sm h-12 rounded-xl transition-all duration-300"
              />
              <div className="flex justify-end">
                <Link 
                  href="/forgot-password" 
                  className="text-xs text-slate-400 hover:text-white font-semibold transition-colors"
                >
                  Esqueceu a senha?
                </Link>
              </div>
            </div>

            <Button 
              type="submit" 
              fullWidth 
              size="lg" 
              loading={isSubmitting} 
              className="h-14 rounded-2xl bg-[#C5A03F] text-black font-semibold text-xs uppercase tracking-widest shadow-xl shadow-[#C5A03F]/10 hover:bg-[#d6af4b] transition-all group"
            >
              Acessar
              {!isSubmitting && <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </form>

          {/* Registro Link */}
          <p className="text-center text-xs text-slate-400 mt-8 font-medium">
            Ainda não tem conta?{' '}
            <Link 
              href="/register" 
              className="text-[#C5A03F] font-semibold hover:text-[#d6af4b] hover:underline underline-offset-4"
            >
              Criar agora
            </Link>
          </p>
        </div>

        {/* Footer Minimalista */}
        <div className="mt-12 text-center">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">EA LUMINA • JORNADA DE LUZ</p>
        </div>
      </div>
    </div>
  )
}
