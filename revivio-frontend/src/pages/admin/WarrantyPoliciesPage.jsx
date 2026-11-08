import React, { useState, useEffect } from 'react'
import { Shield, Plus } from 'lucide-react'
import { Table } from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Skeleton } from '@/components/ui/Skeleton'
import { warrantyPoliciesApi } from '@/lib/api'

export function WarrantyPoliciesPage() {
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [policies, setPolicies] = useState([])

  const [form, setForm] = useState({
    name: '',
    durationMonths: 12,
    coverageType: 'STANDARD',
    description: '',
    termsAndConditions: 'Standard manufacturer hardware warranty terms apply.',
  })

  const loadPolicies = async () => {
    try {
      const res = await warrantyPoliciesApi.getAll()
      const list = Array.isArray(res.data) ? res.data : []
      setPolicies(list)
    } catch (err) {
      console.error('Failed to load warranty policies:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPolicies()
  }, [])

  const handleCreatePolicy = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await warrantyPoliciesApi.adminCreate({
        name: form.name.trim(),
        durationMonths: Number(form.durationMonths),
        coverageType: form.coverageType,
        description: form.description.trim() || null,
        termsAndConditions: form.termsAndConditions.trim() || null,
      })
      setModalOpen(false)
      setForm({
        name: '',
        durationMonths: 12,
        coverageType: 'STANDARD',
        description: '',
        termsAndConditions: 'Standard manufacturer hardware warranty terms apply.',
      })
      await loadPolicies()
    } catch (err) {
      setError(err.message || 'Failed to create warranty policy.')
    } finally {
      setSubmitting(false)
    }
  }

  const columns = [
    {
      header: 'Policy Title',
      render: (r) => (
        <div>
          <div className="font-bold text-[var(--color-text)]">{r.name}</div>
          <div className="text-xs text-[var(--color-text-secondary)]">{r.coverageType} TIER</div>
        </div>
      ),
    },
    {
      header: 'Duration',
      render: (r) => <span className="font-mono font-semibold">{r.durationMonths} Months</span>,
    },
    {
      header: 'Description',
      render: (r) => r.description || '—',
    },
    {
      header: 'Policy Status',
      render: () => <Badge variant="mint" size="sm" dot>Active Engine Rule</Badge>,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
            Warranty Policy Configuration
          </h1>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            Deterministic coverage duration rules, coverage perils, and verification criteria.
          </p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={() => setModalOpen(true)}>
          Create Warranty Policy
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      ) : (
        <Table columns={columns} data={policies} />
      )}

      {/* Add Policy Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Warranty Policy"
        description="Configure duration and coverage conditions for the deterministic warranty engine."
      >
        <form onSubmit={handleCreatePolicy} className="space-y-4 pt-2">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-600 dark:text-rose-400">
              {error}
            </div>
          )}

          <Input
            label="Policy Name"
            placeholder="e.g. Extended Hardware Protection 24M"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Duration (Months)"
              type="number"
              min="1"
              max="120"
              value={form.durationMonths}
              onChange={(e) => setForm({ ...form, durationMonths: e.target.value })}
              required
            />
            <Select
              label="Coverage Tier"
              value={form.coverageType}
              onChange={(e) => setForm({ ...form, coverageType: e.target.value })}
              options={[
                { value: 'STANDARD', label: 'Standard (Manufacturer)' },
                { value: 'EXTENDED', label: 'Extended Protection' },
                { value: 'PREMIUM', label: 'Revivio Care+ (Accidental)' },
                { value: 'LIFETIME', label: 'Lifetime Component' },
              ]}
            />
          </div>

          <Textarea
            label="Policy Description"
            placeholder="Short customer-facing description..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
          />

          <Textarea
            label="Terms & Conditions"
            value={form.termsAndConditions}
            onChange={(e) => setForm({ ...form, termsAndConditions: e.target.value })}
            rows={2}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={submitting}>
              Save Policy
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
