import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wrench, CheckCircle2, XCircle, ArrowRight, UserCheck, Search } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/SearchInput'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { adminRepairsApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'

export function AdminRepairsPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [repairs, setRepairs] = useState([])

  useEffect(() => {
    async function loadRepairs() {
      try {
        const res = await adminRepairsApi.getAll({ size: 100 })
        const list = res.data?.content || (Array.isArray(res.data) ? res.data : [])
        setRepairs(list)
      } catch (err) {
        console.error('Failed to load admin repair triage list:', err)
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
      r.customerProduct?.product?.name?.toLowerCase().includes(term) ||
      r.customerProduct?.serialNumber?.toLowerCase().includes(term) ||
      r.customer?.firstName?.toLowerCase().includes(term) ||
      r.customer?.lastName?.toLowerCase().includes(term) ||
      r.customer?.email?.toLowerCase().includes(term) ||
      r.issueTitle?.toLowerCase().includes(term)
    const matchesStatus =
      statusFilter === 'ALL' || r.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
            Repair Intake & Triage Queue
          </h1>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            Review claims against warranty policies, approve coverage, and assign technicians.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search tickets, customers, or serial numbers..."
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
              {s === 'ALL' ? 'All Queue' : s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No service requests match"
          description={search ? "No claims match your search filters." : "There are currently no tickets in the triage queue."}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <Card
              key={r.id}
              hover
              onClick={() => navigate(`/admin/repairs/${r.id}`)}
              className="p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#27C6A5]">
                    {r.referenceNumber}
                  </span>
                  <StatusBadge status={r.status} type="repair" size="sm" />
                  <StatusBadge status={r.priority} type="priority" size="sm" />
                </div>
                <h3 className="text-sm font-bold text-[var(--color-text)]">
                  {r.customerProduct?.product?.name || 'Device'} · {r.issueTitle}
                </h3>
                <div className="text-xs text-[var(--color-text-secondary)]">
                  Customer: <strong>{r.customer?.firstName} {r.customer?.lastName}</strong> ({r.customer?.email}) ·{' '}
                  <span className="font-mono">S/N: {r.customerProduct?.serialNumber}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                  <div className="text-xs text-[var(--color-text-tertiary)]">
                    {formatDate(r.createdAt)}
                  </div>
                  <div className="text-[11px] font-medium text-[var(--color-text-secondary)]">
                    {r.assignedTechnician ? `Tech: ${r.assignedTechnician.firstName}` : 'Unassigned'}
                  </div>
                </div>
                <Button variant="secondary" size="sm">
                  Triage & Dispatch <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
