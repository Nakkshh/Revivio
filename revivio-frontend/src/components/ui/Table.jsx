import React from 'react'
import { cn } from '@/lib/utils'

export function Table({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'No records found',
  className = '',
  onRowClick,
}) {
  return (
    <div className={cn('w-full overflow-x-auto border border-[var(--color-border)] rounded-xl bg-[var(--color-surface)]', className)}>
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-sunken)]">
            {columns.map((col, idx) => (
              <th
                key={col.key || idx}
                className={cn(
                  'px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] select-none',
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                {columns.map((col, idx) => (
                  <td key={idx} className="px-4 py-3.5">
                    <div className="h-4 bg-[var(--color-border)] rounded w-3/4" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-sm text-[var(--color-text-secondary)]"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr
                key={row.id || rowIdx}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  'hover:bg-[var(--color-surface-sunken)] transition-colors',
                  onRowClick && 'cursor-pointer'
                )}
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={col.key || colIdx}
                    className={cn('px-4 py-3.5 text-[var(--color-text)]', col.cellClassName)}
                  >
                    {col.render ? col.render(row, rowIdx) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
