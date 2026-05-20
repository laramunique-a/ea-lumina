'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import toast from 'react-hot-toast'
import { useState } from 'react'

const schema = z.object({
  email: z.string().email('E-mail inválido'),
})

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ email: string }>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: { email: string }) => {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setSent(true)
      } else {
        const result = await res.json()
        toast.error(result.error || 'Ocorreu um erro')
      }
    } catch {
      toast.error('Erro de conexão')
    }
  }

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
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-blue-100 shadow-inner">
                <CheckCircle2 size={28} className="text-[#0090FF]" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">E-mail enviado!</h2>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                Se este e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha em breve.
              </p>
              <Link href="/login">
                <Button fullWidth variant="outline">
                  <ArrowLeft size={15} />
                  Voltar ao login
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-1">Esqueceu a senha?</h2>
                <p className="text-slate-500 text-sm leading-relaxed">Digite seu e-mail para receber as instruções.</p>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="E-mail cadastrado"
                  type="email"
                  placeholder="seu@email.com"
                  leftIcon={<Mail size={15} />}
                  error={errors.email?.message as string}
                  {...register('email')}
                />
                <Button type="submit" fullWidth size="lg" loading={isSubmitting}>
                  Enviar instruções
                </Button>
              </form>
              <div className="mt-5 text-center">
                <Link href="/login" className="text-sm text-slate-400 hover:text-slate-700 flex items-center justify-center gap-1.5 transition-colors">
                  <ArrowLeft size={13} />
                  Voltar ao login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
