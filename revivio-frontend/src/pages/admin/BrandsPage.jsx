import React, { useState, useEffect } from 'react'
import { Award, Plus } from 'lucide-react'
import { Table } from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Skeleton } from '@/components/ui/Skeleton'
import { brandsApi } from '@/lib/api'

export function BrandsPage() {
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [brands, setBrands] = useState([])

  const [form, setForm] = useState({
    name: '',
    description: '',
    logoUrl: '',
  })

  const loadBrands = async () => {
    try {
      const res = await brandsApi.getAll()
      const list = Array.isArray(res.data) ? res.data : []
      setBrands(list)
    } catch (err) {
      console.error('Failed to load OEM brands:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBrands()
  }, [])

  const handleCreateBrand = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await brandsApi.adminCreate({
        name: form.name.trim(),
        description: form.description.trim() || null,
        logoUrl: form.logoUrl.trim() || null,
      })
      setModalOpen(false)
      setForm({ name: '', description: '', logoUrl: '' })
      await loadBrands()
    } catch (err) {
      setError(err.message || 'Failed to register brand.')
    } finally {
      setSubmitting(false)
    }
  }

  const columns = [
    { header: 'OEM Brand', key: 'name' },
    {
      header: 'Specialization & Notes',
      render: (r) => r.description || '—',
    },
    {
      header: 'Partnership',
      render: () => <Badge variant="mint" size="sm" dot>Authorized OEM</Badge>,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
            OEM Hardware Brands
          </h1>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            Certified manufacturers whose warranty policies are supported on Revivio.
          </p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={() => setModalOpen(true)}>
          Add OEM Brand
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      ) : (
        <Table columns={columns} data={brands} />
      )}

      {/* Add Brand Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Register OEM Manufacturer"
        description="Add a certified brand whose hardware catalog models can be registered by customers."
      >
        <form onSubmit={handleCreateBrand} className="space-y-4 pt-2">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-600 dark:text-rose-400">
              {error}
            </div>
          )}

          <Input
            label="Manufacturer / Brand Name"
            placeholder="e.g. Dell, Bose, ASUS"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <Input
            label="Logo URL (Optional)"
            placeholder="https://..."
            value={form.logoUrl}
            onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
          />

          <Textarea
            label="Manufacturer Description"
            placeholder="Specialization, component supply terms..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={submitting}>
              Register Brand
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
