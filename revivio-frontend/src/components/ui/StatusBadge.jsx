import React from 'react'
import { Badge } from './Badge'

export function StatusBadge({ status, type = 'repair', size = 'md' }) {
  if (!status) return null

  if (type === 'repair') {
    const map = {
      COMPLETED: { label: 'Completed', variant: 'success' },
      IN_REPAIR: { label: 'In Repair', variant: 'info' },
      ASSIGNED: { label: 'Assigned', variant: 'info' },
      APPROVED: { label: 'Approved', variant: 'mint' },
      UNDER_REVIEW: { label: 'Under Review', variant: 'warning' },
      REQUESTED: { label: 'Requested', variant: 'neutral' },
      REJECTED: { label: 'Rejected', variant: 'error' },
    }
    const info = map[status] || { label: status, variant: 'neutral' }
    return (
      <Badge variant={info.variant} size={size} dot>
        {info.label}
      </Badge>
    )
  }

  if (type === 'warranty') {
    const map = {
      ACTIVE: { label: 'Active Coverage', variant: 'success' },
      EXPIRED: { label: 'Expired', variant: 'error' },
      PENDING_VERIFICATION: { label: 'Pending Verification', variant: 'warning' },
      VOID: { label: 'Void', variant: 'error' },
    }
    const info = map[status] || { label: status, variant: 'neutral' }
    return (
      <Badge variant={info.variant} size={size} dot>
        {info.label}
      </Badge>
    )
  }

  if (type === 'priority') {
    const map = {
      URGENT: { label: 'Urgent', variant: 'error' },
      HIGH: { label: 'High', variant: 'warning' },
      MEDIUM: { label: 'Medium', variant: 'info' },
      LOW: { label: 'Low', variant: 'neutral' },
    }
    const info = map[status] || { label: status, variant: 'neutral' }
    return (
      <Badge variant={info.variant} size={size} dot>
        {info.label}
      </Badge>
    )
  }

  return <Badge size={size}>{status}</Badge>
}
