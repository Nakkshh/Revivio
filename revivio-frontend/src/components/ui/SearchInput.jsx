import React from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = 'Search...',
  className = '',
  ...props
}) {
  return (
    <div className={cn('relative flex items-center w-full max-w-sm', className)}>
      <Search className="absolute left-3 w-4 h-4 text-[var(--color-text-tertiary)] pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[var(--color-surface)] border border-[var(--color-border-strong)] rounded-lg pl-9 pr-8 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[#27C6A5] focus:border-[#27C6A5] transition-colors"
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange?.('')
            onClear?.()
          }}
          className="absolute right-2.5 text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] p-0.5 rounded"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
