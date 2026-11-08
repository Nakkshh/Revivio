import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
  className = '',
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && open) {
        onClose?.()
      }
    }
    if (open) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#142B3B]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Box */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative w-full bg-[var(--color-surface)] border border-[var(--color-border-strong)] rounded-2xl shadow-2xl z-10 overflow-hidden transform transition-all',
          sizeClasses[size] || sizeClasses.md,
          className
        )}
      >
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
          <div>
            {title && (
              <h2 className="text-lg font-semibold text-[var(--color-text)]">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-sunken)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
