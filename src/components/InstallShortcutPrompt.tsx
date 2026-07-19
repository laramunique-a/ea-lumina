'use client'

import { useEffect, useState } from 'react'
import { Sparkles, X, Download, Share, PlusSquare, MoreVertical, Smartphone, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Modal } from './ui/Modal'

export function InstallShortcutPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [showInstructionsModal, setShowInstructionsModal] = useState(false)
  const [deviceInfo, setDeviceInfo] = useState({ os: '', browser: '', isStandalone: false })

  useEffect(() => {
    // 1. Detect if already running in standalone mode (PWA installed)
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true

    if (isStandalone) return

    // 2. Simple OS and Browser detection
    const userAgent = window.navigator.userAgent.toLowerCase()
    let os = 'unknown'
    let browser = 'unknown'

    if (/iphone|ipad|ipod/.test(userAgent)) {
      os = 'ios'
    } else if (/android/.test(userAgent)) {
      os = 'android'
    } else if (/win/.test(userAgent)) {
      os = 'windows'
    } else if (/mac/.test(userAgent)) {
      os = 'macos'
    }

    if (/chrome|crios/.test(userAgent) && !/edge|opr/.test(userAgent)) {
      browser = 'chrome'
    } else if (/safari/.test(userAgent) && !/chrome|crios/.test(userAgent)) {
      browser = 'safari'
    } else if (/firefox|fxios/.test(userAgent)) {
      browser = 'firefox'
    } else if (/edge|edg/.test(userAgent)) {
      browser = 'edge'
    }

    setDeviceInfo({ os, browser, isStandalone })

    // 3. Listen for standard PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      // Check if not dismissed recently
      const dismissedTime = localStorage.getItem('ea_shortcut_prompt_dismissed')
      if (!dismissedTime || Date.now() - Number(dismissedTime) > 7 * 24 * 60 * 60 * 1000) { // 7 days cooldown
        setShowPrompt(true)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // For iOS and browsers that don't trigger `beforeinstallprompt` (like Safari on iOS)
    // We show our own custom floating invitation if they haven't dismissed it
    if (os === 'ios' && browser === 'safari') {
      const dismissedTime = localStorage.getItem('ea_shortcut_prompt_dismissed')
      if (!dismissedTime || Date.now() - Number(dismissedTime) > 7 * 24 * 60 * 60 * 1000) {
        // Delay a bit to not annoy the user instantly
        const timer = setTimeout(() => setShowPrompt(true), 3000)
        return () => clearTimeout(timer)
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Browser native install prompt available
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setDeferredPrompt(null)
        setShowPrompt(false)
      }
    } else {
      // Show step-by-step custom guide modal
      setShowInstructionsModal(true)
    }
  }

  const handleDismiss = () => {
    localStorage.setItem('ea_shortcut_prompt_dismissed', String(Date.now()))
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <>
      {/* Floating Bottom Banner */}
      <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md animate-in slide-in-from-bottom duration-500">
        <div className="bg-slate-900/95 backdrop-blur-md text-white border border-slate-800 rounded-3xl p-4 shadow-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Sparkles size={18} className="animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-black tracking-tight leading-tight">Instalar Acesso Rápido</p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5 leading-snug">
                Adicione o app à sua tela de início para acessar em um clique.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px] font-black uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all shadow-md shadow-amber-500/15 shrink-0"
            >
              Instalar
            </button>
            <button 
              onClick={handleDismiss}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Custom Step-by-Step Instructions Modal */}
      <Modal
        isOpen={showInstructionsModal}
        onClose={() => setShowInstructionsModal(false)}
        title="Como Criar Atalho de Acesso Rápido"
        size="sm"
      >
        <div className="space-y-6 pt-2">
          {/* OS/Browser specific instructions */}
          {deviceInfo.os === 'ios' ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Smartphone size={16} className="text-[#0090FF]" />
                <span>Instruções para iPhone / iPad</span>
              </div>
              <ol className="space-y-4 text-xs font-medium text-slate-600">
                <li className="flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-blue-50 text-[#0090FF] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                  <div>
                    No seu navegador Safari, toque no ícone de <strong className="text-slate-800">Compartilhar</strong> (o quadrado com uma seta para cima <Share className="inline-block mx-1 text-[#0090FF]" size={14} />) na barra inferior.
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-blue-50 text-[#0090FF] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                  <div>
                    Role a lista de opções para baixo e toque em <strong className="text-slate-800">"Adicionar à Tela de Início"</strong> (<PlusSquare className="inline-block mx-1 text-slate-700" size={14} />).
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-blue-50 text-[#0090FF] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                  <div>
                    Toque em <strong className="text-[#0090FF]">Adicionar</strong> no canto superior direito para confirmar.
                  </div>
                </li>
              </ol>
            </div>
          ) : deviceInfo.os === 'android' ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Smartphone size={16} className="text-[#0090FF]" />
                <span>Instruções para Android</span>
              </div>
              <ol className="space-y-4 text-xs font-medium text-slate-600">
                <li className="flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-blue-50 text-[#0090FF] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                  <div>
                    Toque no ícone de <strong className="text-slate-800">Menu</strong> (três pontinhos <MoreVertical className="inline-block mx-0.5 text-slate-600" size={14} />) no canto superior direito do seu navegador Chrome.
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-blue-50 text-[#0090FF] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                  <div>
                    Selecione a opção de <strong className="text-slate-800">"Instalar aplicativo"</strong> ou <strong className="text-slate-800">"Adicionar à tela inicial"</strong>.
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-blue-50 text-[#0090FF] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                  <div>
                    Confirme o nome e toque em <strong className="text-[#0090FF]">Instalar</strong> ou <strong className="text-[#0090FF]">Adicionar</strong>.
                  </div>
                </li>
              </ol>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Monitor size={16} className="text-[#0090FF]" />
                <span>Instruções para Computador (Chrome/Edge)</span>
              </div>
              <ol className="space-y-4 text-xs font-medium text-slate-600">
                <li className="flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-blue-50 text-[#0090FF] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                  <div>
                    Clique no ícone de <strong className="text-slate-800">Instalação</strong> (um computador com uma seta para baixo <Download className="inline-block mx-1 text-[#0090FF]" size={14} />) na barra de endereços do navegador no topo.
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-blue-50 text-[#0090FF] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                  <div>
                    Ou clique no ícone de <strong className="text-slate-800">Menu</strong> (três pontinhos <MoreVertical className="inline-block mx-0.5 text-slate-600" size={14} />) e selecione <strong className="text-slate-800">"Instalar EA Lumina..."</strong> ou <strong className="text-slate-800">"Salvar e Compartilhar" → "Instalar página como app"</strong>.
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-blue-50 text-[#0090FF] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                  <div>
                    Confirme clicando no botão azul de <strong className="text-[#0090FF]">Instalar</strong>.
                  </div>
                </li>
              </ol>
            </div>
          )}

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-start gap-3 mt-4">
            <div className="text-xl">💡</div>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
              Dica: O ícone do aplicativo será adicionado na sua tela inicial ou área de trabalho. Você poderá abrir a plataforma instantaneamente sempre que precisar!
            </p>
          </div>

          <button
            onClick={() => setShowInstructionsModal(false)}
            className="w-full bg-[#0090FF] hover:bg-blue-600 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-md shadow-blue-500/10"
          >
            Entendido, obrigado!
          </button>
        </div>
      </Modal>
    </>
  )
}
