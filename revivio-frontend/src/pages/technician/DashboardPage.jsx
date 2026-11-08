import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Briefcase,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Clock,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { dashboardApi, technicianJobsApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'

export function TechnicianDashboardPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalAssigned: 0,
    pendingJobs: 0,
    activeRepairs: 0,
    completedJobs: 0,
  })
  const [activeJobs, setActiveJobs] = useState([])

  useEffect(() => {
    async function loadData() {
      try {
        const [dashRes, jobsRes] = await Promise.all([
          dashboardApi.getTechnicianDashboard(),
          technicianJobsApi.getAll({ size: 10 }),
        ])
        if (dashRes.data) {
          setStats(dashRes.data)
        }
        const jobsList = jobsRes.data?.content || (Array.isArray(jobsRes.data) ? jobsRes.data : [])
        setActiveJobs(jobsList)
      } catch (e) {
        console.error('Failed to load technician workbench data:', e)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text)]">
          Technician Workbench
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1">
          Review assigned hardware jobs, conduct diagnostic inspections, and log repair actions.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-l-4 border-l-blue-500">
          <div className="text-[var(--color-text-secondary)] text-xs font-semibold uppercase flex justify-between items-center">
            <span>Active on Bench</span>
            <Wrench className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-2">
            {loading ? <Skeleton className="h-8 w-12" /> : stats.activeRepairs}
          </div>
          <div className="text-[11px] text-[var(--color-text-secondary)] mt-1">
            Currently disassembling/testing
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-amber-500">
          <div className="text-[var(--color-text-secondary)] text-xs font-semibold uppercase flex justify-between items-center">
            <span>Pending Intake</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-amber-500 mt-2">
            {loading ? <Skeleton className="h-8 w-12" /> : stats.pendingJobs}
          </div>
          <div className="text-[11px] text-[var(--color-text-secondary)] mt-1">
            Assigned, needs diagnosis
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-purple-500">
          <div className="text-[var(--color-text-secondary)] text-xs font-semibold uppercase flex justify-between items-center">
            <span>Total Assigned</span>
            <Briefcase className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 mt-2">
            {loading ? <Skeleton className="h-8 w-12" /> : stats.totalAssigned}
          </div>
          <div className="text-[11px] text-[var(--color-text-secondary)] mt-1">
            Lifetime bench queue
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-emerald-500">
          <div className="text-[var(--color-text-secondary)] text-xs font-semibold uppercase flex justify-between items-center">
            <span>Completed Repairs</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
            {loading ? <Skeleton className="h-8 w-12" /> : stats.completedJobs}
          </div>
          <div className="text-[11px] text-[var(--color-text-secondary)] mt-1">
            Certified & returned
          </div>
        </Card>
      </div>

      {/* Priority Active Bench Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[var(--color-text)]">
            Active Assigned Hardware Jobs
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/technician/jobs')}
          >
            Open Full Queue →
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        ) : activeJobs.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No active jobs assigned"
            description="Your bench queue is clear. New repair requests allocated by the administrator will appear here."
          />
        ) : (
          <div className="space-y-3">
            {activeJobs.map((job) => (
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
    </div>
  )
}
