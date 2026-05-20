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
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Link inválido</h2>
        <p className="text-slate-500 mb-6">O link de redefinição de senha está ausente ou é inválido.</p>
        <Link href="/forgot-password">
          <Button>Solicitar novo link</Button>
        </Link>
      </div>
    )
  }

  if (success) {
    return (
      <div className="text-center py-4">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-100 shadow-inner">
          <CheckCircle2 size={28} className="text-green-500" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Senha alterada!</h2>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          Sua senha foi redefinida com sucesso. Você será redirecionado para o login.
        </p>
        <Link href="/login">
          <Button fullWidth variant="outline">
            Ir para o login
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-1">Nova Senha</h2>
        <p className="text-slate-500 text-sm leading-relaxed">Crie uma nova senha segura para sua conta.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nova senha"
          type="password"
          placeholder="******"
          leftIcon={<Lock size={15} />}
          error={errors.password?.message as string}
          {...register('password')}
        />
        <Input
          label="Confirmar nova senha"
          type="password"
          placeholder="******"
          leftIcon={<Lock size={15} />}
          error={errors.confirmPassword?.message as string}
          {...register('confirmPassword')}
        />
        <Button type="submit" fullWidth size="lg" loading={isSubmitting}>
          Redefinir Senha
        </Button>
      </form>
      <div className="mt-5 text-center">
        <Link href="/login" className="text-sm text-slate-400 hover:text-slate-700 flex items-center justify-center gap-1.5 transition-colors">
          <ArrowLeft size={13} />
          Voltar ao login
        </Link>
      </div>
    </>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#FAFAF9]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group">
            <Logo size="lg" iconOnly className="mb-4" />
            <span className="font-semibold text-slate-900 text-xl sr-only">EA Lumina</span>
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-7">
          <Suspense fallback={<div className="text-center text-sm text-slate-500 py-8">Carregando...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
