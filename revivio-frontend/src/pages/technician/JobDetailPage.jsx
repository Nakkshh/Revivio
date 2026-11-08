import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Wrench,
  CheckCircle2,
  Clock,
  ArrowLeft,
  FileText,
  AlertCircle,
  Play,
  Package,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { technicianJobsApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'

export function TechnicianJobDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [initialLoading, setInitialLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [job, setJob] = useState(null)

  const [diagnosisInput, setDiagnosisInput] = useState('')
  const [actionsInput, setActionsInput] = useState('')
  const [publicNotesInput, setPublicNotesInput] = useState('')
  const [careInstructionsInput, setCareInstructionsInput] = useState('')

  const loadJob = async () => {
    try {
      const res = await technicianJobsApi.getById(id)
      if (res.data) {
        setJob(res.data)
        setDiagnosisInput(res.data.diagnosisNotes || '')
        setActionsInput(res.data.repairActions || '')
        setPublicNotesInput(res.data.completionNotes || '')
        setCareInstructionsInput(res.data.technicianNotes || '')
      }
    } catch (err) {
      console.error('Failed to load technician job:', err)
      setErrorMsg(err.message || 'Assigned job ticket could not be loaded.')
    } finally {
      setInitialLoading(false)
    }
  }

  useEffect(() => {
    loadJob()
  }, [id])

  const handleStartRepair = async () => {
    setErrorMsg('')
    setSuccessMsg('')
    setLoading(true)
    try {
      await technicianJobsApi.updateStatus(id, {
        newStatus: 'IN_REPAIR',
        comment: 'Technician commenced hardware disassembly and bench inspection.',
      })
      setSuccessMsg('Job transitioned to IN_REPAIR.')
      await loadJob()
    } catch (err) {
      setErrorMsg(err.message || 'Failed to transition repair state.')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDiagnosis = async () => {
    if (!diagnosisInput.trim()) {
      setErrorMsg('Please enter diagnostic findings before saving.')
      return
    }
    setErrorMsg('')
    setSuccessMsg('')
    setLoading(true)
    try {
      await technicianJobsApi.submitDiagnosis(id, { diagnosisNotes: diagnosisInput.trim() })
      setSuccessMsg('Diagnostic findings recorded successfully.')
      await loadJob()
    } catch (err) {
      setErrorMsg(err.message || 'Failed to record diagnosis notes.')
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteRepair = async () => {
    if (!actionsInput.trim()) {
      setErrorMsg('Itemized repair actions taken are mandatory to complete a repair.')
      return
    }
    setErrorMsg('')
    setSuccessMsg('')
    setLoading(true)
    try {
      await technicianJobsApi.complete(id, {
        repairActions: actionsInput.trim(),
        completionNotes: publicNotesInput.trim() || 'Service completed and verified on bench.',
        customerCareInstructions: careInstructionsInput.trim() || 'Handle device with care.',
      })
      setSuccessMsg('Repair certified and successfully marked as COMPLETED.')
      await loadJob()
    } catch (err) {
      setErrorMsg(err.message || 'Failed to complete repair certification.')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-4">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
          <div className="lg:col-span-8 space-y-6">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <EmptyState
          icon={AlertCircle}
          title="Job Ticket Not Found"
          description={errorMsg || "This job is not assigned to your workbench or does not exist."}
          actionText="Back to Assigned Jobs"
          onAction={() => navigate('/technician/jobs')}
        />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/technician/jobs')}
            icon={ArrowLeft}
          >
            Back to Queue
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-[#27C6A5]">
                {job.referenceNumber}
              </span>
              <StatusBadge status={job.status} type="repair" />
              <StatusBadge status={job.priority} type="priority" />
            </div>
            <h1 className="text-xl font-bold text-[var(--color-text)] mt-0.5">
              {job.customerProduct?.product?.name || 'Device Under Repair'}
            </h1>
          </div>
        </div>

        {/* Action State Transition Buttons */}
        <div className="flex items-center gap-2">
          {job.status === 'ASSIGNED' && (
            <Button
              variant="primary"
              size="sm"
              loading={loading}
              onClick={handleStartRepair}
              icon={Play}
            >
              Begin Hardware Bench Repair
            </Button>
          )}
          {job.status === 'IN_REPAIR' && (
            <Button
              variant="primary"
              size="sm"
              loading={loading}
              onClick={handleCompleteRepair}
              icon={CheckCircle2}
            >
              Sign Off & Complete Repair
            </Button>
          )}
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

      {/* 3-Panel Professional Workshop Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Device Intake Context */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
              Hardware Passport
            </h3>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[var(--color-text-secondary)]">Device Model:</span>
                <div className="font-semibold text-[var(--color-text)]">
                  {job.customerProduct?.product?.name} ({job.customerProduct?.product?.modelNumber || 'Standard'})
                </div>
              </div>
              <div>
                <span className="text-[var(--color-text-secondary)]">Serial Number:</span>
                <div className="font-mono font-medium text-[var(--color-text)]">
                  {job.customerProduct?.serialNumber}
                </div>
              </div>
              <div>
                <span className="text-[var(--color-text-secondary)]">Warranty Status:</span>
                <div>
                  <StatusBadge status={job.customerProduct?.warranty?.status} type="warranty" size="sm" />
                </div>
              </div>
              <div>
                <span className="text-[var(--color-text-secondary)]">Intake Date:</span>
                <div className="font-medium text-[var(--color-text)]">
                  {formatDate(job.createdAt)}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
              Customer Complaint
            </h3>
            <div className="text-xs font-semibold text-[var(--color-text)]">
              {job.issueTitle}
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] p-3 rounded-lg bg-[var(--color-surface-sunken)] leading-relaxed">
              "{job.issueDescription}"
            </p>
          </Card>
        </div>

        {/* Right: Interactive Workbench Inputs */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-6 space-y-5">
            <h3 className="text-sm font-bold text-[var(--color-text)] flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#27C6A5]" />
              Technician Diagnostic Assessment
            </h3>

            <Textarea
              label="Formal Diagnostic Findings"
              value={diagnosisInput}
              onChange={(e) => setDiagnosisInput(e.target.value)}
              placeholder="Record component measurements, oscilloscope/multimeter readings, failure root cause..."
              rows={3}
              disabled={job.status === 'COMPLETED'}
            />
            {job.status !== 'COMPLETED' && (
              <div className="flex justify-end">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleSaveDiagnosis}
                  loading={loading}
                >
                  Save Diagnosis Notes
                </Button>
              </div>
            )}
          </Card>

          <Card className="p-6 space-y-5">
            <h3 className="text-sm font-bold text-[var(--color-text)] flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" />
              Repair Actions & Public Progress Log
            </h3>

            <Textarea
              label="Itemized Repair Actions Taken *"
              value={actionsInput}
              onChange={(e) => setActionsInput(e.target.value)}
              placeholder="e.g. Disassembled chassis, replaced OEM battery pack, calibrated charge controller..."
              rows={3}
              disabled={job.status === 'COMPLETED'}
            />

            <Textarea
              label="Internal Completion Notes"
              value={publicNotesInput}
              onChange={(e) => setPublicNotesInput(e.target.value)}
              placeholder="Internal bench observations and test benchmarks..."
              rows={2}
              disabled={job.status === 'COMPLETED'}
            />

            <Textarea
              label="Customer Care & Usage Instructions"
              value={careInstructionsInput}
              onChange={(e) => setCareInstructionsInput(e.target.value)}
              placeholder="Maintenance instructions visible to customer upon return..."
              rows={2}
              disabled={job.status === 'COMPLETED'}
            />

            {job.status === 'IN_REPAIR' && (
              <div className="pt-2 flex justify-end">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleCompleteRepair}
                  loading={loading}
                  icon={CheckCircle2}
                >
                  Finalize & Submit Completion Report
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
