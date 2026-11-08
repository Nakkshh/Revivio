import React from 'react'
import { cn } from '@/lib/utils'

export function Skeleton({ className = '' }) {
  return (
    <div
      className={cn(
        'animate-pulse bg-[var(--color-border)] rounded-lg',
        className
      )}
    />
  )
}

export function Spinner({ size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  }

  return (
    <div
      className={cn(
        'inline-block rounded-full border-[#27C6A5] border-t-transparent animate-spin',
        sizeMap[size] || sizeMap.md,
        className
      )}
    />
  )
}
