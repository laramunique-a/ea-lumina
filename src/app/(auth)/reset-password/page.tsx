'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Lock, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import toast from 'react-hot-toast'

const schema = z.object({
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

type ResetFormData = z.infer<typeof schema>

function ResetPasswordForm() {
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetFormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: ResetFormData) => {
    if (!token) {
      toast.error('Token de recuperação ausente ou inválido.')
      return
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: data.password }),
      })
      
      if (res.ok) {
        setSuccess(true)
        toast.success('Senha redefinida com sucesso!')
        setTimeout(() => router.push('/login'), 3000)
      } else {
        const result = await res.json()
        toast.error(result.error || 'Ocorreu um erro ao redefinir a senha.')
      }
    } catch {
      toast.error('Erro de conexão com o servidor.')
    }
  }

  if (!token && !success) {
    return (
      <div className="text-center py-4">
        <h2 className="text-xl font-black text-white tracking-tight mb-2">Link inválido</h2>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">O link de redefinição de senha está ausente ou é inválido.</p>
        <Link href="/forgot-password">
          <Button fullWidth className="h-12 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300">
            Solicitar novo link
          </Button>
        </Link>
      </div>
    )
  }

  if (success) {
    return (
      <div className="text-center py-4">
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20 shadow-inner">
          <CheckCircle2 size={28} className="text-green-500" />
        </div>
        <h2 className="text-xl font-black text-white tracking-tight mb-2">Senha alterada!</h2>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          Sua senha foi redefinida com sucesso. Você será redirecionado para o login.
        </p>
        <Link href="/login">
          <Button fullWidth className="h-12 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300">
            Ir para o login
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6 text-center">
        <h2 className="text-xl font-black text-white tracking-tight mb-2">Nova Senha</h2>
        <p className="text-slate-400 text-sm leading-relaxed">Crie uma nova senha segura para sua conta.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Nova senha"
          type="password"
          placeholder="******"
          leftIcon={<Lock size={15} className="text-slate-400" />}
          error={errors.password?.message as string}
          {...register('password')}
          labelClassName="text-slate-300 font-medium tracking-wide"
          className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-black/30 focus:border-[#C5A03F]/50 focus:ring-[#C5A03F]/10 text-sm h-12 rounded-xl transition-all duration-300"
        />
        <Input
          label="Confirmar nova senha"
          type="password"
          placeholder="******"
          leftIcon={<Lock size={15} className="text-slate-400" />}
          error={errors.confirmPassword?.message as string}
          {...register('confirmPassword')}
          labelClassName="text-slate-300 font-medium tracking-wide"
          className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-black/30 focus:border-[#C5A03F]/50 focus:ring-[#C5A03F]/10 text-sm h-12 rounded-xl transition-all duration-300"
        />
        <Button 
          type="submit" 
          fullWidth 
          size="lg" 
          loading={isSubmitting}
          className="h-14 rounded-2xl bg-[#C5A03F] text-black font-semibold text-xs uppercase tracking-widest shadow-xl shadow-[#C5A03F]/10 hover:bg-[#d6af4b] transition-all group"
        >
          Redefinir Senha
        </Button>
      </form>
      <div className="mt-6 text-center">
        <Link href="/login" className="text-sm text-slate-400 hover:text-white flex items-center justify-center gap-1.5 transition-colors">
          <ArrowLeft size={13} />
          Voltar ao login
        </Link>
      </div>
    </>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#010409] bg-[radial-gradient(circle_at_center,_#020c16_0%,_#010810_50%,_#010409_100%)] px-6 py-12 selection:bg-[#C5A03F]/20 overflow-hidden">
      <div className="relative z-10 w-full max-w-[400px] animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
        {/* Logo Centralizado (Máscara Circular) */}
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

        <div className="bg-black/40 border border-white/5 backdrop-blur-xl shadow-2xl p-8 md:p-10 rounded-3xl">
          <Suspense fallback={<div className="text-center text-sm text-slate-400 py-8">Carregando...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>

        {/* Footer Minimalista */}
        <div className="mt-12 text-center">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">EA LUMINA • JORNADA DE LUZ</p>
        </div>
      </div>
    </div>
  )
}
