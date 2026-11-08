import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Package,
  ShieldCheck,
  Wrench,
  CheckCircle2,
  PlusCircle,
  FilePlus,
  ArrowRight,
  Clock,
  AlertTriangle,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { useAuth } from '@/contexts/AuthContext'
import { dashboardApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'

export function CustomerDashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    totalProducts: 0,
    activeWarranties: 0,
    expiredWarranties: 0,
    openRepairs: 0,
    completedRepairs: 0,
    recentRepairs: [],
  })

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await dashboardApi.getCustomerDashboard()
        if (res.data) {
          setData(res.data)
        }
      } catch (err) {
        console.error('Failed to load customer dashboard telemetry:', err)
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [])

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text)]">
            Welcome back, {user?.firstName || 'Customer'}!
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1">
            Manage your registered hardware, check warranty terms, and track repairs.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/customer/products/register')}
            icon={PlusCircle}
          >
            Register Device
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/customer/repairs/create')}
            icon={FilePlus}
          >
            Request Service
          </Button>
        </div>
      </div>

      {/* KPI Stats Row (4 Metric Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-l-4 border-l-slate-500">
          <div className="flex items-center justify-between text-[var(--color-text-secondary)] text-xs font-semibold uppercase">
            <span>Registered Devices</span>
            <Package className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-3xl font-extrabold text-[var(--color-text)] mt-3">
            {loading ? <Skeleton className="h-8 w-12" /> : data.totalProducts}
          </div>
          <div className="text-[11px] text-[var(--color-text-secondary)] mt-1">
            Total active in inventory
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-[#27C6A5]">
          <div className="flex items-center justify-between text-[var(--color-text-secondary)] text-xs font-semibold uppercase">
            <span>Active Warranties</span>
            <ShieldCheck className="w-4 h-4 text-[#27C6A5]" />
          </div>
          <div className="text-3xl font-extrabold text-[#27C6A5] mt-3">
            {loading ? <Skeleton className="h-8 w-12" /> : data.activeWarranties}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
            Fully covered & verified
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between text-[var(--color-text-secondary)] text-xs font-semibold uppercase">
            <span>In-Progress Repairs</span>
            <Wrench className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-3">
            {loading ? <Skeleton className="h-8 w-12" /> : data.openRepairs}
          </div>
          <div className="text-[11px] text-[var(--color-text-secondary)] mt-1">
            Active workbench tickets
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between text-[var(--color-text-secondary)] text-xs font-semibold uppercase">
            <span>Completed Repairs</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-[var(--color-text)] mt-3">
            {loading ? <Skeleton className="h-8 w-12" /> : data.completedRepairs}
          </div>
          <div className="text-[11px] text-[var(--color-text-secondary)] mt-1">
            Restored & certified
          </div>
        </Card>
      </div>

      {/* Main Grid: Active Repairs & Quick Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Repair Activity */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[var(--color-text)]">
              Recent Service Activity
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/customer/repairs')}
            >
              View All Repairs →
            </Button>
          </div>

          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : data.recentRepairs?.length === 0 ? (
            <EmptyState
              icon={Wrench}
              title="No service requests yet"
              description="Your devices are currently in healthy operating condition."
              actionText="Submit Repair Request"
              onAction={() => navigate('/customer/repairs/create')}
            />
          ) : (
            <div className="space-y-3">
              {data.recentRepairs.map((rep) => (
                <div
                  key={rep.id}
                  onClick={() => navigate(`/customer/repairs/${rep.id}`)}
                  className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[#27C6A5] transition-all cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#27C6A5]">
                        {rep.referenceNumber}
                      </span>
                      <StatusBadge status={rep.status} type="repair" size="sm" />
                    </div>
                    <div className="text-sm font-semibold text-[var(--color-text)] truncate">
                      {rep.customerProduct?.product?.name || 'Registered Unit'}
                    </div>
                    <div className="text-xs text-[var(--color-text-secondary)] truncate">
                      {rep.issueTitle}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs text-[var(--color-text-tertiary)]">
                      {formatDate(rep.createdAt)}
                    </div>
                    <ArrowRight className="w-4 h-4 text-[var(--color-text-secondary)] ml-auto mt-2" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Quick Care Actions */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-base font-semibold text-[var(--color-text)]">
            Quick Actions
          </h2>
          <Card className="p-4 divide-y divide-[var(--color-border)]">
            <div
              onClick={() => navigate('/customer/products/register')}
              className="py-3 flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-lg bg-[var(--color-accent-subtle)] text-[#27C6A5] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <PlusCircle className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-[var(--color-text)] group-hover:text-[#27C6A5] transition-colors">
                  Register a Product
                </div>
                <div className="text-[11px] text-[var(--color-text-secondary)]">
                  Upload invoice and start coverage
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--color-text-tertiary)]" />
            </div>

            <div
              onClick={() => navigate('/customer/products')}
              className="py-3 flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Package className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-[var(--color-text)] group-hover:text-blue-500 transition-colors">
                  View My Hardware
                </div>
                <div className="text-[11px] text-[var(--color-text-secondary)]">
                  Check active warranty expiration
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--color-text-tertiary)]" />
            </div>

            <div
              onClick={() => navigate('/customer/repairs/create')}
              className="py-3 flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <FilePlus className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-[var(--color-text)] group-hover:text-emerald-500 transition-colors">
                  Request Service Bench
                </div>
                <div className="text-[11px] text-[var(--color-text-secondary)]">
                  Fast claim intake with photos
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--color-text-tertiary)]" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
