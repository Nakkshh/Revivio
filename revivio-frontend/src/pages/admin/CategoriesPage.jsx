import React, { useState, useEffect } from 'react'
import { Layers, Plus } from 'lucide-react'
import { Table } from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Skeleton } from '@/components/ui/Skeleton'
import { categoriesApi } from '@/lib/api'

export function CategoriesPage() {
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState([])

  const [form, setForm] = useState({
    name: '',
    description: '',
  })

  const loadCategories = async () => {
    try {
      const res = await categoriesApi.getAll()
      const list = Array.isArray(res.data) ? res.data : []
      setCategories(list)
    } catch (err) {
      console.error('Failed to load categories:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleCreateCategory = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await categoriesApi.adminCreate({
        name: form.name.trim(),
        description: form.description.trim() || null,
      })
      setModalOpen(false)
      setForm({ name: '', description: '' })
      await loadCategories()
    } catch (err) {
      setError(err.message || 'Failed to create category.')
    } finally {
      setSubmitting(false)
    }
  }

  const columns = [
    { header: 'Category Name', key: 'name' },
    {
      header: 'Description',
      render: (r) => r.description || '—',
    },
    {
      header: 'Catalog Status',
      render: () => <Badge variant="success" size="sm" dot>Active Category</Badge>,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
            Device Categories
          </h1>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            Taxonomy classification for warranty rules and repair workflows.
          </p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={() => setModalOpen(true)}>
          Add Category
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      ) : (
        <Table columns={columns} data={categories} />
      )}

      {/* Add Category Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Hardware Category"
        description="Create a taxonomy category for classifying warranty hardware."
      >
        <form onSubmit={handleCreateCategory} className="space-y-4 pt-2">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-600 dark:text-rose-400">
              {error}
            </div>
          )}

          <Input
            label="Category Name"
            placeholder="e.g. Smart Watch & Wearables"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <Textarea
            label="Category Description"
            placeholder="Scope of devices included..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={submitting}>
              Create Category
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
