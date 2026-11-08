import React from 'react'
import { Button } from './Button'

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)]/50 ${className}`}
    >
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-[var(--color-accent-subtle)] text-[#27C6A5] flex items-center justify-center mb-4 shadow-sm">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h3 className="text-base font-semibold text-[var(--color-text)] mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-xs text-[var(--color-text-secondary)] max-w-sm mb-5">
          {description}
        </p>
      )}
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  )
}
