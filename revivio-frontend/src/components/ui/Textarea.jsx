import React from 'react'
import { cn } from '@/lib/utils'

export const Textarea = React.forwardRef(function Textarea(
  { label, error, hint, className = '', id, rows = 3, ...props },
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
      <textarea
        id={inputId}
        ref={ref}
        rows={rows}
        className={cn(
          'w-full bg-[var(--color-surface)] border border-[var(--color-border-strong)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[#27C6A5] focus:border-[#27C6A5] disabled:opacity-50 resize-y',
          error && 'border-rose-500 focus:ring-rose-500 focus:border-rose-500',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-rose-500 font-medium">{error}</span>}
      {hint && !error && (
        <span className="text-xs text-[var(--color-text-tertiary)]">{hint}</span>
      )}
    </div>
  )
})
