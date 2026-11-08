import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Wrench,
  CheckCircle2,
  Clock,
  User,
  ShieldCheck,
  FileCheck,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { repairsApi } from '@/lib/api'
import { formatDate, formatDateTime } from '@/lib/utils'

export function RepairDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [repair, setRepair] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadRepair() {
      try {
        const res = await repairsApi.getById(id)
        if (res.data) {
          setRepair(res.data)
        }
      } catch (err) {
        console.error('Failed to load repair details:', err)
        setError(err.message || 'Service ticket details could not be retrieved.')
      } finally {
        setLoading(false)
      }
    }
    loadRepair()
  }, [id])

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-28 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  if (!repair || error) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <EmptyState
          icon={AlertCircle}
          title="Service Ticket Not Found"
          description={error || "This repair ticket could not be located or you lack permissions to inspect it."}
          actionText="Back to My Repairs"
          onAction={() => navigate('/customer/repairs')}
        />
      </div>
    )
  }

  const stages = ['REQUESTED', 'UNDER_REVIEW', 'APPROVED', 'ASSIGNED', 'IN_REPAIR', 'COMPLETED']
  const currentStageIdx = stages.indexOf(repair.status)

  return (
    <div className="space-y-8">
      {/* Top Breadcrumb & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/customer/repairs')}
            icon={ArrowLeft}
          >
            Back to Repairs
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-[#27C6A5]">
                {repair.referenceNumber}
              </span>
              <StatusBadge status={repair.status} type="repair" />
              <StatusBadge status={repair.priority} type="priority" />
            </div>
            <h1 className="text-xl font-bold text-[var(--color-text)] mt-0.5">
              {repair.customerProduct?.product?.name || 'Registered Device'}
            </h1>
          </div>
        </div>

        {repair.status === 'COMPLETED' && (
          <Button
            variant="primary"
            size="sm"
            icon={FileCheck}
            onClick={() => window.print()}
          >
            Print Service Certificate
          </Button>
        )}
      </div>

      {/* 6-Stage Interactive Stepper */}
      <Card className="p-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-6">
          Lifecycle Progression
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {stages.map((st, i) => {
            const isCompleted = i < currentStageIdx || repair.status === 'COMPLETED'
            const isCurrent = i === currentStageIdx && repair.status !== 'COMPLETED'
            return (
              <div
                key={st}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isCompleted
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : isCurrent
                    ? 'border-[#27C6A5] bg-[#27C6A5]/10 text-[#17876B] dark:text-[#27C6A5] shadow-sm font-bold'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-tertiary)]'
                }`}
              >
                <div className="text-[10px] font-mono">Stage 0{i + 1}</div>
                <div className="text-xs font-semibold mt-1">{st.replace('_', ' ')}</div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Main Grid: Details & Public Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Complaint & Technician Notes */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-semibold text-[var(--color-text)]">
              Customer Complaint Details
            </h3>
            <div className="space-y-1">
              <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                Issue Summary:
              </span>
              <p className="text-sm font-semibold text-[var(--color-text)]">
                {repair.issueTitle}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                Detailed Problem Description:
              </span>
              <p className="text-xs text-[var(--color-text)] p-3 rounded-lg bg-[var(--color-surface-sunken)] leading-relaxed">
                {repair.issueDescription}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[var(--color-border)] text-xs">
              <div>
                <span className="text-[var(--color-text-secondary)]">Hardware S/N:</span>
                <div className="font-mono font-medium text-[var(--color-text)]">
                  {repair.customerProduct?.serialNumber}
                </div>
              </div>
              <div>
                <span className="text-[var(--color-text-secondary)]">Warranty Status:</span>
                <div>
                  <StatusBadge status={repair.customerProduct?.warranty?.status} type="warranty" size="sm" />
                </div>
              </div>
            </div>
          </Card>

          {/* Technician Verified Bench Notes */}
          <Card className="p-6 space-y-3 border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2">
                <Wrench className="w-4 h-4 text-blue-500" />
                Technician Bench Update
              </h3>
              {repair.assignedTechnician && (
                <span className="text-xs text-[var(--color-text-secondary)] font-medium">
                  Tech: {repair.assignedTechnician.firstName} {repair.assignedTechnician.lastName}
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--color-text)] p-3 rounded-lg bg-blue-500/5 border border-blue-500/20 leading-relaxed">
              {repair.technicianNotes ||
                repair.completionNotes ||
                repair.diagnosisNotes ||
                'A technician has been allocated and is inspecting hardware diagnostics. Bench updates will appear here.'}
            </p>
          </Card>
        </div>

        {/* Right Column: Public Audit History */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-sm font-semibold text-[var(--color-text)]">
            Service History & Audit Log
          </h3>
          <Card className="p-5">
            <div className="space-y-4">
              {repair.history && repair.history.length > 0 ? (
                repair.history.map((h, idx) => (
                  <div key={h.id || idx} className="flex items-start gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-[#27C6A5] mt-1.5 flex-shrink-0" />
                    <div className="space-y-0.5">
                      <div className="font-semibold text-[var(--color-text)]">
                        {h.newStatus ? h.newStatus.replace('_', ' ') : 'CLAIM INITIATED'}
                      </div>
                      <div className="text-[11px] text-[var(--color-text-secondary)]">
                        {h.comment || 'Status milestone recorded'}
                      </div>
                      <div className="text-[10px] text-[var(--color-text-tertiary)]">
                        {formatDateTime(h.createdAt)} · {h.actorName || 'Revivio System'}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-[var(--color-text-secondary)] text-center py-4">
                  No previous transition records yet.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
