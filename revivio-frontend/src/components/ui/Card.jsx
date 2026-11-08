import React from 'react'
import { cn } from '@/lib/utils'

export function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={cn(
        'bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm overflow-hidden transition-all duration-150',
        hover &&
          'hover:shadow-md hover:border-[var(--color-border-strong)] hover:translate-y-[-1px]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div
      className={cn('p-5 border-b border-[var(--color-border)] flex items-center justify-between', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '', ...props }) {
  return (
    <h3
      className={cn('text-base font-semibold text-[var(--color-text)]', className)}
      {...props}
    >
      {children}
    </h3>
  )
}

export function CardDescription({ children, className = '', ...props }) {
  return (
    <p
      className={cn('text-xs text-[var(--color-text-secondary)] mt-0.5', className)}
      {...props}
    >
      {children}
    </p>
  )
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <div className={cn('p-5', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className = '', ...props }) {
  return (
    <div
      className={cn(
        'p-4 bg-[var(--color-surface-sunken)] border-t border-[var(--color-border)] flex items-center justify-between',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
