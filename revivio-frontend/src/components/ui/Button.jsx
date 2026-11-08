import React from 'react'
import { cn } from '@/lib/utils'

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  className = '',
  icon: Icon,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none'

  const variants = {
    primary:
      'bg-[#27C6A5] text-[#142B3B] font-semibold hover:bg-[#1FA688] dark:hover:bg-[#35D4B3] shadow-sm focus:ring-[#27C6A5]',
    secondary:
      'bg-[var(--color-surface)] border border-[var(--color-border-strong)] text-[var(--color-text)] hover:bg-[var(--color-surface-sunken)] focus:ring-slate-400',
    outline:
      'bg-transparent border border-[var(--color-border-strong)] text-[var(--color-text)] hover:bg-[var(--color-surface-sunken)] focus:ring-[#27C6A5]',
    ghost:
      'bg-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-sunken)] focus:ring-slate-400',
    danger:
      'bg-rose-600 text-white hover:bg-rose-700 shadow-sm focus:ring-rose-500',
  }

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      ) : Icon ? (
        <Icon className="w-4 h-4 flex-shrink-0" />
      ) : null}
      {children}
    </button>
  )
}
