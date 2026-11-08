import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wrench, FilePlus, Search, ArrowRight, Clock } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/SearchInput'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { repairsApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'

export function MyRepairsPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [repairs, setRepairs] = useState([])

  useEffect(() => {
    async function loadRepairs() {
      try {
        const res = await repairsApi.getMy({ size: 100 })
        if (res.data?.content) {
          setRepairs(res.data.content)
        } else if (Array.isArray(res.data)) {
          setRepairs(res.data)
        }
      } catch (err) {
        console.error('Failed to load customer repairs:', err)
      } finally {
        setLoading(false)
      }
    }
    loadRepairs()
  }, [])

  const filtered = repairs.filter((r) => {
    const term = search.toLowerCase()
    const matchesSearch =
      r.referenceNumber?.toLowerCase().includes(term) ||
      r.issueTitle?.toLowerCase().includes(term) ||
      r.customerProduct?.product?.name?.toLowerCase().includes(term) ||
      r.customerProduct?.serialNumber?.toLowerCase().includes(term)
    const matchesStatus =
      statusFilter === 'ALL' || r.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
            Service & Repair Requests
          </h1>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            Track intake status, diagnostics, and bench repairs in real-time.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/customer/repairs/create')}
          icon={FilePlus}
        >
          Submit New Request
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by ticket RV-..., issue, or device..."
        />
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'REQUESTED', 'UNDER_REVIEW', 'APPROVED', 'ASSIGNED', 'IN_REPAIR', 'COMPLETED', 'REJECTED'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === s
                  ? 'bg-[var(--color-text)] text-[var(--color-surface)]'
                  : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
              }`}
            >
              {s === 'ALL' ? 'All Tickets' : s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No service requests found"
          description={search ? "No repair tickets match your search." : "You have not submitted any repair claims."}
          actionText="Request Service Bench"
          onAction={() => navigate('/customer/repairs/create')}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((rep) => (
            <Card
              key={rep.id}
              hover
              onClick={() => navigate(`/customer/repairs/${rep.id}`)}
              className="p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-[#27C6A5]">
                    {rep.referenceNumber}
                  </span>
                  <StatusBadge status={rep.status} type="repair" size="sm" />
                  <StatusBadge status={rep.priority} type="priority" size="sm" />
                </div>
                <h3 className="text-sm font-bold text-[var(--color-text)]">
                  {rep.issueTitle}
                </h3>
                <div className="text-xs text-[var(--color-text-secondary)] flex items-center gap-2">
                  <span>Device: <strong>{rep.customerProduct?.product?.name || 'Hardware'}</strong></span>
                  <span>·</span>
                  <span className="font-mono">S/N: {rep.customerProduct?.serialNumber}</span>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-[var(--color-border)]">
                <div className="text-xs text-[var(--color-text-secondary)]">
                  Submitted {formatDate(rep.createdAt)}
                </div>
                <div className="text-xs font-semibold text-[#27C6A5] flex items-center gap-1 sm:mt-1">
                  View Timeline <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
