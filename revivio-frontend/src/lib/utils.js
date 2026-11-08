import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString) {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function formatDateTime(dateString) {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date)
}

export function formatCurrency(amount, currency = 'INR') {
  if (amount == null) return '—'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getInitials(firstName = '', lastName = '') {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U'
}

export function getStatusColor(status) {
  switch (status) {
    case 'COMPLETED':
    case 'ACTIVE':
    case 'APPROVED':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    case 'IN_REPAIR':
    case 'ASSIGNED':
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
    case 'UNDER_REVIEW':
    case 'PENDING_VERIFICATION':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    case 'REQUESTED':
      return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
    case 'REJECTED':
    case 'VOID':
    case 'EXPIRED':
      return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
    default:
      return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
  }
}

export function getPriorityColor(priority) {
  switch (priority) {
    case 'URGENT':
      return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
    case 'HIGH':
      return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20'
    case 'MEDIUM':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    case 'LOW':
      return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
    default:
      return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
  }
}

export function truncate(str, length = 32) {
  if (!str) return ''
  return str.length > length ? str.substring(0, length) + '...' : str
}

export function timeAgo(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now - date) / 1000)

  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return formatDate(dateString)
}
