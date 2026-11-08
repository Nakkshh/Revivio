import React from 'react'
import { cn } from '@/lib/utils'

export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  dot = false,
}) {
  const variants = {
    neutral:
      'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
    success:
      'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    warning:
      'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    error:
      'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    info:
      'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    mint:
      'bg-[#27C6A5]/10 text-[#17876B] dark:text-[#27C6A5] border-[#27C6A5]/30',
  }

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
  }

  const dotColors = {
    neutral: 'bg-slate-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-rose-500',
    info: 'bg-blue-500',
    mint: 'bg-[#27C6A5]',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border tracking-wide uppercase',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', dotColors[variant])}
        />
      )}
      {children}
    </span>
  )
}
