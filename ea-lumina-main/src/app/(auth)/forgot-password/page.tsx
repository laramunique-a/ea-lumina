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
import { Footer } from '@/components/Footer'

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
    <div className="relative min-h-screen flex flex-col items-center justify-between bg-[#010409] bg-[radial-gradient(circle_at_center,_#020c16_0%,_#010810_50%,_#010409_100%)] selection:bg-[#C5A03F]/20 overflow-x-hidden w-full">
      
      {/* Espaçador flex para centralizar o card */}
      <div className="flex-1 flex items-center justify-center w-full px-6 py-12">
        {/* Card Container */}
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

        {/* Card com Glassmorphism */}
        <div className="bg-black/40 border border-white/5 backdrop-blur-xl shadow-2xl p-8 md:p-10 rounded-3xl">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-[#0090FF]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#0090FF]/20 shadow-inner">
                <CheckCircle2 size={28} className="text-[#0090FF]" />
              </div>
              <h2 className="text-xl font-black text-white tracking-tight mb-2">E-mail enviado!</h2>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Se este e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha em breve.
              </p>
              <Link href="/login">
                <Button fullWidth className="h-12 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                  <ArrowLeft size={15} className="mr-2" />
                  Voltar ao login
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6 text-center">
                <h2 className="text-xl font-black text-white tracking-tight mb-2">Esqueceu a senha?</h2>
                <p className="text-slate-400 text-sm leading-relaxed">Digite seu e-mail para receber as instruções de redefinição.</p>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  label="E-mail cadastrado"
                  type="email"
                  placeholder="seu@email.com"
                  leftIcon={<Mail size={15} className="text-slate-400" />}
                  error={errors.email?.message as string}
                  {...register('email')}
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
                  Enviar instruções
                </Button>
              </form>
              <div className="mt-6 text-center">
                <Link href="/login" className="text-sm text-slate-400 hover:text-white flex items-center justify-center gap-1.5 transition-colors">
                  <ArrowLeft size={13} />
                  Voltar ao login
                </Link>
              </div>
            </>
          )}
        </div>

        </div>
      </div>
      
      <Footer />
    </div>
  )
}
