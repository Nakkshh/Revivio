import React, { useState, useEffect } from 'react'
import { Package, Plus } from 'lucide-react'
import { Table } from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Skeleton } from '@/components/ui/Skeleton'
import { productsApi, brandsApi, categoriesApi } from '@/lib/api'

export function ProductsPage() {
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [products, setProducts] = useState([])
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])

  const [form, setForm] = useState({
    name: '',
    modelNumber: '',
    brandId: '',
    categoryId: '',
    description: '',
  })

  const loadData = async () => {
    try {
      const [pRes, bRes, cRes] = await Promise.all([
        productsApi.getAll({ size: 100 }),
        brandsApi.getAll(),
        categoriesApi.getAll(),
      ])

      const pList = pRes.data?.content || (Array.isArray(pRes.data) ? pRes.data : [])
      const bList = Array.isArray(bRes.data) ? bRes.data : []
      const cList = Array.isArray(cRes.data) ? cRes.data : []

      setProducts(pList)
      setBrands(bList)
      setCategories(cList)

      if (bList.length > 0 && !form.brandId) {
        setForm((prev) => ({ ...prev, brandId: String(bList[0].id) }))
      }
      if (cList.length > 0 && !form.categoryId) {
        setForm((prev) => ({ ...prev, categoryId: String(cList[0].id) }))
      }
    } catch (err) {
      console.error('Failed to load master hardware products:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCreateProduct = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await productsApi.adminCreate({
        name: form.name.trim(),
        modelNumber: form.modelNumber.trim(),
        brandId: Number(form.brandId),
        categoryId: Number(form.categoryId),
        description: form.description.trim() || null,
      })
      setModalOpen(false)
      setForm({
        name: '',
        modelNumber: '',
        brandId: brands.length > 0 ? String(brands[0].id) : '',
        categoryId: categories.length > 0 ? String(categories[0].id) : '',
        description: '',
      })
      await loadData()
    } catch (err) {
      setError(err.message || 'Failed to create product model.')
    } finally {
      setSubmitting(false)
    }
  }

  const columns = [
    {
      header: 'Model Name',
      render: (r) => (
        <div>
          <div className="font-bold text-[var(--color-text)]">{r.name}</div>
          <div className="text-xs text-[var(--color-text-secondary)] font-mono">{r.modelNumber}</div>
        </div>
      ),
    },
    {
      header: 'Brand',
      render: (r) => r.brand?.name || '—',
    },
    {
      header: 'Category',
      render: (r) => r.category?.name || '—',
    },
    {
      header: 'Status',
      render: () => <Badge variant="mint" size="sm" dot>Catalog Active</Badge>,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
            Master Hardware Catalog
          </h1>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            Official OEM models against which customers register warranty serials.
          </p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={() => setModalOpen(true)}>
          Add Product Model
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      ) : (
        <Table columns={columns} data={products} />
      )}

      {/* Add Product Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Catalog New Product Model"
        description="Add a certified hardware model with manufacturer specifications."
      >
        <form onSubmit={handleCreateProduct} className="space-y-4 pt-2">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-600 dark:text-rose-400">
              {error}
            </div>
          )}

          <Input
            label="Product Model Name"
            placeholder="e.g. MacBook Pro 16-inch M3 Max"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <Input
            label="Manufacturer Model Number"
            placeholder="e.g. A2991"
            value={form.modelNumber}
            onChange={(e) => setForm({ ...form, modelNumber: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="OEM Brand"
              value={form.brandId}
              onChange={(e) => setForm({ ...form, brandId: e.target.value })}
              options={brands.map((b) => ({ value: String(b.id), label: b.name }))}
            />
            <Select
              label="Hardware Category"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              options={categories.map((c) => ({ value: String(c.id), label: c.name }))}
            />
          </div>

          <Textarea
            label="Product Description"
            placeholder="Hardware details, chassis spec, default warranty..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={submitting}>
              Add to Catalog
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
