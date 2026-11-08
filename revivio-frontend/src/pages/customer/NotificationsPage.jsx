import React, { useState, useEffect } from 'react'
import { Bell, CheckCheck, Wrench, ShieldCheck, Package, AlertCircle, Clock } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { notificationsApi } from '@/lib/api'
import { formatDateTime } from '@/lib/utils'

export function NotificationsPage() {
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])

  const loadNotifications = async () => {
    try {
      const res = await notificationsApi.getAll({ size: 50 })
      const list = res.data?.content || (Array.isArray(res.data) ? res.data : [])
      setNotifications(list)
    } catch (err) {
      console.error('Failed to load notifications:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  const markAsRead = async (id) => {
    try {
      await notificationsApi.markRead(id)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      )
    } catch (err) {
      console.error('Failed to mark notification as read:', err)
    }
  }

  const markAllRead = async () => {
    try {
      await notificationsApi.markAllRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    } catch (err) {
      console.error('Failed to mark all as read:', err)
    }
  }

  const getIcon = (type) => {
    switch (type) {
      case 'REPAIR_SUBMITTED':
      case 'REPAIR_STATUS_CHANGED':
      case 'TECHNICIAN_ASSIGNED':
      case 'REPAIR_COMPLETED':
        return <Wrench className="w-4 h-4 text-[#27C6A5]" />
      case 'REPAIR_APPROVED':
      case 'WARRANTY_VERIFIED':
        return <ShieldCheck className="w-4 h-4 text-emerald-500" />
      case 'REPAIR_REJECTED':
        return <AlertCircle className="w-4 h-4 text-rose-500" />
      default:
        return <Package className="w-4 h-4 text-blue-500" />
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
            Notifications
          </h1>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            Real-time updates regarding your products, warranties, and repairs.
          </p>
        </div>
        {notifications.some((n) => !n.read) && (
          <Button variant="secondary" size="sm" onClick={markAllRead} icon={CheckCheck}>
            Mark All Read
          </Button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You're completely caught up. Activity regarding your service claims will appear here."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <Card
              key={n.id}
              onClick={() => !n.read && markAsRead(n.id)}
              className={`p-4 flex items-start gap-4 transition-colors cursor-pointer ${
                !n.read ? 'border-[#27C6A5]/40 bg-[#27C6A5]/5' : ''
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-[var(--color-surface-sunken)] flex items-center justify-center flex-shrink-0 mt-0.5">
                {getIcon(n.type)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-[var(--color-text)]">
                    {n.title}
                  </div>
                  <div className="text-[10px] text-[var(--color-text-tertiary)] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDateTime(n.createdAt)}
                  </div>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  {n.message}
                </p>
              </div>
              {!n.read && (
                <div className="w-2 h-2 rounded-full bg-[#27C6A5] mt-2 flex-shrink-0" />
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
