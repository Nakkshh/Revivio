import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './Button'

export function Pagination({
  currentPage = 0,
  totalPages = 1,
  onPageChange,
  totalElements,
  pageSize = 10,
}) {
  if (totalPages <= 1) return null

  const start = currentPage * pageSize + 1
  const end = Math.min((currentPage + 1) * pageSize, totalElements || 0)

  return (
    <div className="flex items-center justify-between px-2 py-4 text-xs text-[var(--color-text-secondary)]">
      <div>
        {totalElements ? (
          <span>
            Showing <strong className="text-[var(--color-text)]">{start}</strong> to{' '}
            <strong className="text-[var(--color-text)]">{end}</strong> of{' '}
            <strong className="text-[var(--color-text)]">{totalElements}</strong> results
          </span>
        ) : (
          <span>
            Page <strong className="text-[var(--color-text)]">{currentPage + 1}</strong> of{' '}
            <strong className="text-[var(--color-text)]">{totalPages}</strong>
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage === 0}
          onClick={() => onPageChange?.(currentPage - 1)}
          icon={ChevronLeft}
        >
          Previous
        </Button>
        <span className="px-2 font-medium text-[var(--color-text)]">
          {currentPage + 1} / {totalPages}
        </span>
        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage >= totalPages - 1}
          onClick={() => onPageChange?.(currentPage + 1)}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
