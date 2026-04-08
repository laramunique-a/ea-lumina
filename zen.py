import os

path = 'src/app/dashboard/terapeuta/perfil/page.tsx'

with open(path, 'r', encoding='utf-8') as f:
    txt = f.read()

# Headers / Container Base
txt = txt.replace('className="p-6 max-w-3xl space-y-6"', 'className="max-w-4xl mx-auto p-6 sm:p-8 space-y-8 pb-24"')

# Boxes Layout
txt = txt.replace('bg-white rounded-2xl border border-surface-200 shadow-card p-6', 'bg-white rounded-[2rem] border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] p-6 sm:p-8')

# Inputs border-surface-200
txt = txt.replace('border-surface-200', 'border-slate-100/50')
txt = txt.replace('border-surface-300', 'border-slate-200')

# Cores
txt = txt.replace('text-primary-600', 'text-[#0090FF]')
txt = txt.replace('text-primary-500', 'text-[#0090FF]')
txt = txt.replace('focus:ring-primary-500', 'focus:ring-[#0090FF]/20')
txt = txt.replace('bg-primary-600', 'bg-[#0090FF]')
txt = txt.replace('bg-primary-500', 'bg-[#0090FF]')

# Input customizados (somente as tags)
txt = txt.replace('<Input ', '<Input className="bg-slate-50 border-slate-100/50 rounded-xl" ')
txt = txt.replace('<PhoneInput ', '<PhoneInput className="bg-slate-50 border-slate-100/50 rounded-xl" ')

# Headers menores
txt = txt.replace('<h2 className="font-semibold text-slate-900', '<h2 className="text-xl font-black text-slate-800 tracking-tight mb-2')
txt = txt.replace('<h2 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">', '<h2 className="text-xl font-black text-slate-800 tracking-tight mb-2 flex items-center gap-2">')
txt = txt.replace('<h2 className="font-semibold text-slate-900 mb-2">', '<h2 className="text-xl font-black text-slate-800 tracking-tight mb-2">')

# Textareas
txt = txt.replace('resize-none"', 'resize-none bg-slate-50 border-slate-100/50 rounded-xl"')

# The Hero Header Replacement
old_top = """  return (
    <>
      {/* Já existe a div p-6 max-w-3xl logo abaixo, 
          não precisamos de wrapper se removermos o Header */}
      <input"""

new_top = """  return (
    <>
      {/* HEADER PRINCIPAL (Formato Zen) */}
      <div className="bg-white px-6 py-12 sm:px-8 lg:px-12 rounded-b-[3rem] shadow-[0_4px_20px_-4px_rgba(6,81,237,0.05)] border-b border-slate-100 flex flex-col items-center justify-center relative overflow-hidden mb-8">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
        <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500" />
        
        <div className="relative group mb-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-[6px] border-white shadow-xl bg-slate-50 relative overflow-hidden ring-4 ring-blue-50 transition-all group-hover:ring-blue-100 flex items-center justify-center">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-black text-blue-500">{name?.charAt(0).toUpperCase() || "T"}</span>
            )}
          </div>
          <button 
             type="button" 
             onClick={() => pickFile('profileImage')} 
             disabled={uploadBusy} 
             className="absolute bottom-1 right-1 w-9 h-9 bg-[#0090FF] rounded-full border-2 border-white text-white flex items-center justify-center shadow-md hover:bg-blue-600 hover:scale-105 transition-all"
          >
            <Camera size={14} />
          </button>
        </div>

        <div className="text-center relative z-10">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-2">
            {name || 'Seu Perfil'}
            {(user?.email || documentExists) && <CheckCircle2 size={20} className="text-[#0090FF]" />}
          </h1>
          <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-[10px]">
            Terapeuta Especialista
          </p>
        </div>
      </div>
      <input"""

if old_top in txt:
    txt = txt.replace(old_top, new_top)

# Removing old inner Avatar code
inner_avatar = """<div className="flex items-center gap-6 border-b border-slate-100 pb-8">
            <div
              className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Foto profissional" className="h-full w-full object-cover" />
              ) : (
                <User size={32} className="text-slate-400" />
              )}
            </div>
            <div className="min-w-0 flex flex-col gap-1">
              <button
                type="button"
                className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-slate-100/50 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-50"
                onClick={() => pickFile('profileImage')}
                disabled={uploadBusy}
              >
                <Camera size={18} className="text-[#0090FF] shrink-0" />
                {isUploading ? 'Enviando...' : 'Enviar imagem'}
              </button>
              <p className="text-xs text-slate-500">Foto profissional com fundo neutro (recomendado).</p>
            </div>
          </div>"""
if inner_avatar in txt:
    txt = txt.replace(inner_avatar, "")

# Same for regular button hover
txt = txt.replace('className="w-full sm:w-auto"', 'className="w-full sm:w-auto bg-[#0090FF] hover:bg-[#0077EE] font-bold shadow-lg shadow-blue-500/30 rounded-xl h-11"')

with open(path, 'w', encoding='utf-8') as f:
    f.write(txt)
    
print("Successfully processed Zen template.")
