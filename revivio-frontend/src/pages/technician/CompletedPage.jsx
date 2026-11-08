import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, FileCheck, ArrowRight, Package } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { technicianJobsApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'

export function CompletedPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [completedJobs, setCompletedJobs] = useState([])

  useEffect(() => {
    async function loadCompleted() {
      try {
        const res = await technicianJobsApi.getAll({ size: 100 })
        const list = res.data?.content || (Array.isArray(res.data) ? res.data : [])
        const done = list.filter((j) => j.status === 'COMPLETED')
        setCompletedJobs(done)
      } catch (err) {
        console.error('Failed to load completed jobs:', err)
      } finally {
        setLoading(false)
      }
    }
    loadCompleted()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
          Completed Repair Archive
        </h1>
        <p className="text-xs text-[var(--color-text-secondary)] mt-1">
          Historical log of all verified, certified hardware repairs.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      ) : completedJobs.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="No completed repairs yet"
          description="When you finalize bench service and certify hardware jobs, they will be archived here."
          actionText="View Active Bench Jobs"
          onAction={() => navigate('/technician/jobs')}
        />
      ) : (
        <div className="space-y-3">
          {completedJobs.map((job) => (
            <Card
              key={job.id}
              onClick={() => navigate(`/technician/jobs/${job.id}`)}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:border-[#27C6A5] transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#27C6A5]">
                    {job.referenceNumber}
                  </span>
                  <StatusBadge status="COMPLETED" type="repair" size="sm" />
                </div>
                <h3 className="text-sm font-bold text-[var(--color-text)]">
                  {job.customerProduct?.product?.name || 'Device'} · {job.issueTitle}
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Actions Taken: {job.repairActions || 'Standard component servicing completed'}
                </p>
                <div className="text-[11px] text-[var(--color-text-tertiary)] font-mono">
                  S/N: {job.customerProduct?.serialNumber} · Completed: {formatDate(job.completedAt || job.createdAt)}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={FileCheck}
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/technician/jobs/${job.id}`)
                  }}
                >
                  Inspect Certificate
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
