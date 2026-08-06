'use client'

import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  fullWidth?: boolean
}

const variantStyles = {
  primary:   'bg-[#0090FF] text-white hover:bg-[#0077EE] active:bg-[#0062B0] shadow-sm hover:shadow-[0_8px_20px_-4px_rgba(0,144,255,0.4)]',
  secondary: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50',
  outline:   'bg-transparent border-2 border-[#0090FF] text-[#0090FF] hover:bg-[#0090FF]/5',
  ghost:     'bg-transparent text-slate-600 hover:bg-slate-100',
  danger:    'bg-red-600 text-white hover:bg-red-700',
  gold:      'bg-[#C5A03F] text-white hover:bg-[#AB8A36] shadow-sm hover:shadow-[0_8px_20px_-4px_rgba(197,160,63,0.4)]',
}

const sizeStyles = {
  sm:  'px-3 py-1.5 text-xs font-bold rounded-lg gap-1.5 min-h-[44px]',
  md:  'px-4 py-2 text-sm font-bold rounded-lg gap-2 min-h-[44px]',
  lg:  'px-6 py-2.5 text-sm font-bold rounded-lg gap-2 min-h-[44px]',
  xl:  'px-8 py-3 text-base font-extrabold rounded-xl gap-2.5 min-h-[52px]',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    loading,
    fullWidth,
    children,
    disabled,
    type = 'button',
    ...props
  }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center transition-all duration-300 active:scale-[0.98]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0090FF]/30 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="animate-spin flex-shrink-0" size={size === 'sm' ? 13 : size === 'xl' ? 18 : 15} />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export { Button }
