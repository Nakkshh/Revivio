import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, PlusCircle, Search, ShieldCheck, Calendar, ArrowRight, ShieldAlert } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/SearchInput'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { customerProductsApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'

export function MyProductsPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [products, setProducts] = useState([])

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await customerProductsApi.getMyProducts({ size: 100 })
        if (res.data?.content) {
          setProducts(res.data.content)
        } else if (Array.isArray(res.data)) {
          setProducts(res.data)
        }
      } catch (e) {
        console.error('Failed to load registered customer products:', e)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  const filtered = products.filter((p) => {
    const term = search.toLowerCase()
    const matchesSearch =
      p.product?.name?.toLowerCase().includes(term) ||
      p.serialNumber?.toLowerCase().includes(term) ||
      p.product?.brand?.name?.toLowerCase().includes(term)
    const matchesStatus =
      statusFilter === 'ALL' || p.warranty?.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
            My Registered Products
          </h1>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            All devices verified and under Revivio warranty management.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/customer/products/register')}
          icon={PlusCircle}
        >
          Register New Device
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by device, serial, or brand..."
        />
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'ACTIVE', 'EXPIRED'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === s
                  ? 'bg-[var(--color-text)] text-[var(--color-surface)]'
                  : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
              }`}
            >
              {s === 'ALL' ? 'All Hardware' : s === 'ACTIVE' ? 'Active Coverage' : 'Expired'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Product Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No registered products found"
          description={search ? "No devices match your search query." : "You have not registered any hardware yet."}
          actionText="Register Product Now"
          onAction={() => navigate('/customer/products/register')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <Card
              key={item.id}
              hover
              onClick={() => navigate(`/customer/products/${item.id}`)}
              className="cursor-pointer flex flex-col justify-between"
            >
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#27C6A5]">
                    {item.product?.brand?.name || 'Brand'}
                  </span>
                  <StatusBadge status={item.warranty?.status} type="warranty" size="sm" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-[var(--color-text)] leading-snug">
                    {item.product?.name}
                  </h3>
                  <div className="text-xs text-[var(--color-text-secondary)] font-mono mt-1">
                    Serial: {item.serialNumber}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-surface-sunken)] text-xs space-y-1.5">
                  <div className="flex justify-between text-[var(--color-text-secondary)]">
                    <span>Purchased:</span>
                    <span className="font-medium text-[var(--color-text)]">
                      {formatDate(item.purchaseDate)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[var(--color-text-secondary)]">
                    <span>Warranty Until:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatDate(item.warranty?.endDate)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-surface-sunken)]/50 flex items-center justify-between text-xs font-semibold text-[var(--color-text)]">
                <span>View Coverage & Care</span>
                <ArrowRight className="w-4 h-4 text-[#27C6A5]" />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
