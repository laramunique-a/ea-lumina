'use client'

import { cn } from '@/lib/utils'
import { Eye, EyeOff, Info } from 'lucide-react'
import { InputHTMLAttributes, forwardRef, useState } from 'react'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  labelClassName?: string
  tooltip?: string
  required?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, size, type, id, labelClassName, tooltip, required, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    const isPassword = type === 'password'
    const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <div className="flex items-center gap-1.5">
            <label htmlFor={inputId} className={cn("block text-xs font-semibold text-slate-700", labelClassName)}>
              {label}
              {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            {tooltip && (
              <div className="relative group inline-flex items-center">
                <button
                  type="button"
                  tabIndex={0}
                  className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none focus:text-slate-600"
                  aria-label="Informações sobre o campo"
                >
                  <Info size={13} />
                </button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 hidden group-hover:block group-focus-within:block bg-slate-900 text-white text-[11px] font-normal p-2.5 rounded-xl shadow-xl z-50 text-center leading-normal pointer-events-none select-none">
                  {tooltip}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-900" />
                </div>
              </div>
            )}
          </div>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            className={cn(
              'w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-slate-900',
              'placeholder:text-slate-400 transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-[#0090FF]/20 focus:border-[#0090FF]',
              'hover:border-slate-300',
              'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed',
              size === 'sm' && 'py-1.5 px-3 text-xs',
              size === 'lg' && 'py-3.5 px-5 text-base',
              error
                ? 'border-red-400 focus:ring-red-400/20 focus:border-red-400'
                : 'border-slate-200',
              leftIcon && 'pl-10',
              (rightIcon || isPassword) && 'pr-10',
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
          {rightIcon && !isPassword && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
            <span className="w-1 h-1 rounded-full bg-red-500 flex-shrink-0" />
            {error}
          </p>
        )}
        {hint && !error && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
export { Input }
