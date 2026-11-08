import React from 'react'
import { cn } from '@/lib/utils'

export const Select = React.forwardRef(function Select(
  { label, error, hint, options = [], className = '', id, ...props },
  ref
) {
  const selectId = id || props.name || Math.random().toString(36).substring(7)

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        ref={ref}
        className={cn(
          'w-full bg-[var(--color-surface)] border border-[var(--color-border-strong)] rounded-lg px-3.5 py-2 text-sm text-[var(--color-text)] transition-colors focus:outline-none focus:ring-2 focus:ring-[#27C6A5] focus:border-[#27C6A5] disabled:opacity-50',
          error && 'border-rose-500 focus:ring-rose-500 focus:border-rose-500',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-rose-500 font-medium">{error}</span>}
      {hint && !error && (
        <span className="text-xs text-[var(--color-text-tertiary)]">{hint}</span>
      )}
    </div>
  )
})
