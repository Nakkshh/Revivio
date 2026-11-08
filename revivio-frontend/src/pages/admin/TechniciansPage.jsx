import React, { useState, useEffect } from 'react'
import { UserCheck, Plus, Wrench } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Table } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'
import { adminUsersApi } from '@/lib/api'

export function TechniciansPage() {
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [technicians, setTechnicians] = useState([])

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    address: 'Electronics Service Center, Revivio Hub',
  })

  const loadTechnicians = async () => {
    try {
      const res = await adminUsersApi.getTechnicians()
      const list = Array.isArray(res.data) ? res.data : (res.data?.content || [])
      setTechnicians(list)
    } catch (err) {
      console.error('Failed to load technicians list:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTechnicians()
  }, [])

  const handleCreateTechnician = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await adminUsersApi.createTechnician(form)
      setModalOpen(false)
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        address: 'Electronics Service Center, Revivio Hub',
      })
      await loadTechnicians()
    } catch (err) {
      setError(err.message || 'Failed to create technician account.')
    } finally {
      setSubmitting(false)
    }
  }

  const columns = [
    {
      header: 'Technician',
      render: (row) => (
        <div>
          <div className="font-bold text-[var(--color-text)]">
            {row.firstName} {row.lastName}
          </div>
          <div className="text-xs text-[var(--color-text-secondary)]">{row.email}</div>
        </div>
      ),
    },
    {
      header: 'Contact Phone',
      render: (row) => row.phone || '—',
    },
    {
      header: 'Staff Certification',
      render: (row) => (
        <Badge variant={row.enabled ? 'success' : 'neutral'} size="sm" dot>
          {row.enabled ? 'Certified Bench Staff' : 'Inactive'}
        </Badge>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
            Certified Technicians
          </h1>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            Service bench personnel authorized to record inspections and certify repairs.
          </p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={() => setModalOpen(true)}>
          Add Certified Technician
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      ) : (
        <Table columns={columns} data={technicians} />
      )}

      {/* Add Technician Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Certified Technician"
        description="Create credentials and authorize workbench access for a certified repair specialist."
      >
        <form onSubmit={handleCreateTechnician} className="space-y-4 pt-2">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-600 dark:text-rose-400">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              required
            />
            <Input
              label="Last Name"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              required
            />
          </div>

          <Input
            label="Corporate Email"
            type="email"
            placeholder="tech@revivio.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <Input
            label="Initial Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <Input
            label="Direct Phone"
            placeholder="+91 98765 43210"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={submitting}>
              Authorize & Create Account
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
