import React, { useState, useEffect } from 'react'
import { Users, Search, UserCheck } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Table } from '@/components/ui/Table'
import { SearchInput } from '@/components/ui/SearchInput'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { adminUsersApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'

export function CustomersPage() {
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [customers, setCustomers] = useState([])

  const loadCustomers = async () => {
    try {
      const res = await adminUsersApi.getCustomers({ size: 100 })
      const list = res.data?.content || (Array.isArray(res.data) ? res.data : [])
      setCustomers(list)
    } catch (err) {
      console.error('Failed to load registered customers:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  const toggleStatus = async (id, currentEnabled) => {
    try {
      await adminUsersApi.updateCustomerStatus(id, { enabled: !currentEnabled })
      await loadCustomers()
    } catch (err) {
      console.error('Failed to update customer status:', err)
    }
  }

  const filtered = customers.filter((c) => {
    const term = search.toLowerCase()
    return (
      c.firstName?.toLowerCase().includes(term) ||
      c.lastName?.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term) ||
      c.phone?.toLowerCase().includes(term)
    )
  })

  const columns = [
    {
      header: 'Customer',
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
      header: 'Phone Number',
      render: (row) => row.phone || '—',
    },
    {
      header: 'Account Status',
      render: (row) => (
        <Badge variant={row.enabled ? 'success' : 'error'} size="sm" dot>
          {row.enabled ? 'Active Account' : 'Suspended'}
        </Badge>
      ),
    },
    {
      header: 'Member Since',
      render: (row) => formatDate(row.createdAt),
    },
    {
      header: 'Actions',
      render: (row) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => toggleStatus(row.id, row.enabled)}
        >
          {row.enabled ? 'Deactivate' : 'Activate'}
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
          Registered Customers
        </h1>
        <p className="text-xs text-[var(--color-text-secondary)] mt-1">
          Direct customer directory, verified contacts, and account statuses.
        </p>
      </div>

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search customers by name, email, or phone..."
      />

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      ) : (
        <Table columns={columns} data={filtered} />
      )}
    </div>
  )
}
