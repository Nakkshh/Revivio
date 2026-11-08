import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  UserCheck,
  ArrowLeft,
  Wrench,
  AlertTriangle,
  AlertCircle,
  Clock,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Input } from '@/components/ui/Input'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { adminRepairsApi, adminUsersApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'

export function AdminRepairDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [initialLoading, setInitialLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const [repair, setRepair] = useState(null)
  const [technicians, setTechnicians] = useState([])

  const [selectedTech, setSelectedTech] = useState('')
  const [coverageDecision, setCoverageDecision] = useState('COVERED_UNDER_WARRANTY')
  const [coverageReason, setCoverageReason] = useState('Claim symptoms match active warranty policy clauses.')
  const [adminNotes, setAdminNotes] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectBox, setShowRejectBox] = useState(false)

  const loadData = async () => {
    try {
      const [repairRes, techRes] = await Promise.all([
        adminRepairsApi.getById(id),
        adminUsersApi.getTechnicians(),
      ])

      if (repairRes.data) {
        setRepair(repairRes.data)
        if (repairRes.data.adminNotes) {
          setAdminNotes(repairRes.data.adminNotes)
        }
      }

      const techList = Array.isArray(techRes.data) ? techRes.data : (techRes.data?.content || [])
      setTechnicians(techList)
      if (techList.length > 0 && !selectedTech) {
        setSelectedTech(String(techList[0].id))
      }
    } catch (err) {
      console.error('Failed to load admin repair details:', err)
      setErrorMsg(err.message || 'Failed to retrieve repair claim.')
    } finally {
      setInitialLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [id])

  const handleApprove = async () => {
    setErrorMsg('')
    setSuccessMsg('')
    setLoading(true)
    try {
      await adminRepairsApi.review(id, {
        approved: true,
        coverageDecision,
        coverageDecisionReason: coverageReason,
        adminNotes: adminNotes.trim() || null,
      })
      setSuccessMsg(`Repair claim approved as: ${coverageDecision.replace(/_/g, ' ')}.`)
      await loadData()
    } catch (e) {
      setErrorMsg(e.message || 'Failed to record approval decision.')
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setErrorMsg('A specific rejection reason is mandatory when denying coverage.')
      return
    }
    setErrorMsg('')
    setSuccessMsg('')
    setLoading(true)
    try {
      await adminRepairsApi.review(id, {
        approved: false,
        rejectionReason: rejectionReason.trim(),
        adminNotes: adminNotes.trim() || null,
      })
      setSuccessMsg('Repair claim denied and customer notified.')
      setShowRejectBox(false)
      await loadData()
    } catch (e) {
      setErrorMsg(e.message || 'Failed to record rejection decision.')
    } finally {
      setLoading(false)
    }
  }

  const handleAssign = async () => {
    if (!selectedTech) {
      setErrorMsg('Please select a certified technician to assign.')
      return
    }
    setErrorMsg('')
    setSuccessMsg('')
    setLoading(true)
    try {
      await adminRepairsApi.assign(id, {
        technicianId: Number(selectedTech),
        notes: adminNotes.trim() || 'Priority bench allocation',
      })
      setSuccessMsg('Technician allocated and dispatched to bench.')
      await loadData()
    } catch (e) {
      setErrorMsg(e.message || 'Failed to assign technician.')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  if (!repair) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <EmptyState
          icon={AlertCircle}
          title="Service Claim Not Found"
          description={errorMsg || "The requested repair ticket could not be located in the database."}
          actionText="Back to Queue"
          onAction={() => navigate('/admin/repairs')}
        />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/admin/repairs')}
            icon={ArrowLeft}
          >
            Back to Queue
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-[#27C6A5]">
                {repair.referenceNumber}
              </span>
              <StatusBadge status={repair.status} type="repair" />
              <StatusBadge status={repair.priority} type="priority" />
            </div>
            <h1 className="text-xl font-bold text-[var(--color-text)]">
              {repair.customerProduct?.product?.name || 'Device Under Review'}
            </h1>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-600 dark:text-rose-400">
          {errorMsg}
        </div>
      )}

      {/* Warranty Eligibility Cross-Check Panel */}
      <Card className="p-6 border-l-4 border-l-[#27C6A5] bg-[#27C6A5]/5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[var(--color-text)] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#27C6A5]" />
            Warranty Eligibility Audit
          </h3>
          <StatusBadge status={repair.customerProduct?.warranty?.status} type="warranty" size="sm" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-1">
          <div>
            <span className="text-[var(--color-text-secondary)]">Policy:</span>
            <div className="font-semibold text-[var(--color-text)]">
              {repair.customerProduct?.warranty?.policyName || 'Standard Policy'}
            </div>
          </div>
          <div>
            <span className="text-[var(--color-text-secondary)]">Coverage Expiry:</span>
            <div className="font-semibold text-emerald-600 dark:text-emerald-400">
              {formatDate(repair.customerProduct?.warranty?.endDate)}
            </div>
          </div>
          <div>
            <span className="text-[var(--color-text-secondary)]">Customer Account:</span>
            <div className="font-semibold text-[var(--color-text)]">
              {repair.customer?.firstName} {repair.customer?.lastName} ({repair.customer?.email})
            </div>
          </div>
        </div>
      </Card>

      {/* Review Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Approve / Reject */}
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-[var(--color-text)]">
            Step 1: Coverage Review & Decision
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Determine whether this claim is covered under warranty terms or approved as out-of-warranty paid repair.
          </p>

          <Select
            label="Coverage Determination"
            value={coverageDecision}
            onChange={(e) => setCoverageDecision(e.target.value)}
            disabled={repair.status !== 'REQUESTED' && repair.status !== 'UNDER_REVIEW'}
            options={[
              { value: 'COVERED_UNDER_WARRANTY', label: 'Covered under Active Warranty ($0 customer cost)' },
              { value: 'OUT_OF_WARRANTY_PAID', label: 'Out-of-Warranty (Paid service approval required)' },
            ]}
          />

          <Textarea
            label="Confidential Internal Admin Notes"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Audit notes (hidden from customer view)..."
            rows={2}
          />

          {showRejectBox && (
            <div className="space-y-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
              <Input
                label="Mandatory Rejection Justification"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Serial tampering / unauthorized modification detected"
                required
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowRejectBox(false)}>
                  Cancel
                </Button>
                <Button variant="danger" size="sm" loading={loading} onClick={handleReject}>
                  Confirm Denial
                </Button>
              </div>
            </div>
          )}

          {!showRejectBox && (repair.status === 'REQUESTED' || repair.status === 'UNDER_REVIEW') && (
            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="primary"
                size="sm"
                loading={loading}
                onClick={handleApprove}
                icon={CheckCircle2}
              >
                Approve Coverage
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowRejectBox(true)}
                icon={XCircle}
              >
                Deny Claim
              </Button>
            </div>
          )}
        </Card>

        {/* Technician Assignment with Live Capacity */}
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-[var(--color-text)] flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-500" />
            Step 2: Technician Assignment
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Allocate an active certified electronics technician to handle this workbench service ticket.
          </p>

          <Select
            label="Allocate Certified Technician"
            value={selectedTech}
            onChange={(e) => setSelectedTech(e.target.value)}
            disabled={repair.status !== 'APPROVED'}
            options={technicians.map((t) => ({
              value: String(t.id),
              label: `${t.firstName} ${t.lastName} (${t.email})`,
            }))}
          />

          {repair.assignedTechnician && (
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs">
              <span className="font-semibold text-blue-700 dark:text-blue-300">
                Currently Assigned: {repair.assignedTechnician.firstName} {repair.assignedTechnician.lastName}
              </span>
            </div>
          )}

          {repair.status === 'APPROVED' && (
            <Button
              variant="primary"
              size="sm"
              loading={loading}
              onClick={handleAssign}
              className="w-full"
            >
              Dispatch to Workbench
            </Button>
          )}

          {repair.status !== 'APPROVED' && repair.status !== 'ASSIGNED' && repair.status !== 'IN_REPAIR' && repair.status !== 'COMPLETED' && (
            <p className="text-[11px] text-[var(--color-text-secondary)]">
              * Ticket must be in APPROVED state before a technician can be allocated.
            </p>
          )}
        </Card>
      </div>
    </div>
  )
}
