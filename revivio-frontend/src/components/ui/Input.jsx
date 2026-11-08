import React from 'react'
import { cn } from '@/lib/utils'

export const Input = React.forwardRef(function Input(
  { label, error, hint, icon: Icon, className = '', id, ...props },
  ref
) {
  const inputId = id || props.name || Math.random().toString(36).substring(7)

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        {Icon && (
          <div className="absolute left-3 text-[var(--color-text-tertiary)] pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'w-full bg-[var(--color-surface)] border border-[var(--color-border-strong)] rounded-lg px-3.5 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[#27C6A5] focus:border-[#27C6A5] disabled:opacity-50 disabled:bg-[var(--color-surface-sunken)]',
            Icon && 'pl-9',
            error && 'border-rose-500 focus:ring-rose-500 focus:border-rose-500',
            className
          )}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-rose-500 font-medium">{error}</span>}
      {hint && !error && (
        <span className="text-xs text-[var(--color-text-tertiary)]">{hint}</span>
      )}
    </div>
  )
})
