import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase, ArrowRight, Wrench } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/SearchInput'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { technicianJobsApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'

export function TechnicianJobsPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await technicianJobsApi.getAll({ size: 100 })
        const list = res.data?.content || (Array.isArray(res.data) ? res.data : [])
        setJobs(list)
      } catch (err) {
        console.error('Failed to load technician assigned jobs:', err)
      } finally {
        setLoading(false)
      }
    }
    loadJobs()
  }, [])

  const filtered = jobs.filter((j) => {
    const term = search.toLowerCase()
    const matchesSearch =
      j.referenceNumber?.toLowerCase().includes(term) ||
      j.customerProduct?.product?.name?.toLowerCase().includes(term) ||
      j.customerProduct?.serialNumber?.toLowerCase().includes(term) ||
      j.issueTitle?.toLowerCase().includes(term)
    const matchesStatus =
      statusFilter === 'ALL' || j.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
            Assigned Bench Jobs
          </h1>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            All repair jobs currently assigned to your workbench.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Filter by ticket number, device, or symptom..."
        />
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'ASSIGNED', 'IN_REPAIR', 'COMPLETED'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === s
                  ? 'bg-[var(--color-text)] text-[var(--color-surface)]'
                  : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
              }`}
            >
              {s === 'ALL' ? 'All Workbench' : s.replace('_', ' ')}
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
          icon={Briefcase}
          title="No assigned jobs found"
          description={search ? "No jobs match your search filters." : "Your workbench has no allocated tickets currently."}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((job) => (
            <Card
              key={job.id}
              hover
              onClick={() => navigate(`/technician/jobs/${job.id}`)}
              className="p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#27C6A5]">
                    {job.referenceNumber}
                  </span>
                  <StatusBadge status={job.status} type="repair" size="sm" />
                  <StatusBadge status={job.priority} type="priority" size="sm" />
                </div>
                <h3 className="text-sm font-bold text-[var(--color-text)]">
                  {job.customerProduct?.product?.name || 'Device'} · {job.issueTitle}
                </h3>
                <div className="text-xs text-[var(--color-text-secondary)] font-mono">
                  S/N: {job.customerProduct?.serialNumber}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-[var(--color-text-tertiary)]">
                  {formatDate(job.createdAt)}
                </span>
                <Button variant="secondary" size="sm">
                  Open Workbench <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
