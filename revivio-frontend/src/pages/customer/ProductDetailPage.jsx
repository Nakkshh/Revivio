import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Package,
  ShieldCheck,
  Calendar,
  FileText,
  Wrench,
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { customerProductsApi } from '@/lib/api'
import { formatDate, formatCurrency } from '@/lib/utils'

export function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [device, setDevice] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadDetail() {
      try {
        const res = await customerProductsApi.getById(id)
        if (res.data) {
          setDevice(res.data)
        }
      } catch (e) {
        console.error('Failed to load registered product details:', e)
        setError(e.message || 'Product could not be retrieved.')
      } finally {
        setLoading(false)
      }
    }
    loadDetail()
  }, [id])

  const calculateDaysLeft = (endDateStr) => {
    if (!endDateStr) return 0
    const end = new Date(endDateStr)
    const now = new Date()
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24))
    return Math.max(0, diff)
  }

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  if (!device || error) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <EmptyState
          icon={AlertCircle}
          title="Hardware Record Not Found"
          description={error || "The requested registered device could not be located in your account."}
          actionText="Back to My Products"
          onAction={() => navigate('/customer/products')}
        />
      </div>
    )
  }

  const daysRemaining = calculateDaysLeft(device.warranty?.endDate)

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/customer/products')}
            icon={ArrowLeft}
          >
            Back to Products
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#27C6A5]">
                {device.product?.brand?.name}
              </span>
              <StatusBadge status={device.warranty?.status} type="warranty" size="sm" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text)]">
              {device.product?.name}
            </h1>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/customer/repairs/create')}
          icon={Wrench}
        >
          Request Repair for this Device
        </Button>
      </div>

      {/* 2-Column Hardware Passport & Warranty Engine */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Device Passport */}
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-[var(--color-text)] flex items-center gap-2">
            <Package className="w-4 h-4 text-[#27C6A5]" />
            Hardware Passport
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-[var(--color-border)]">
              <span className="text-[var(--color-text-secondary)]">Serial Number:</span>
              <span className="font-mono font-semibold text-[var(--color-text)]">
                {device.serialNumber}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[var(--color-border)]">
              <span className="text-[var(--color-text-secondary)]">Model Number:</span>
              <span className="font-mono text-[var(--color-text)]">
                {device.product?.modelNumber}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[var(--color-border)]">
              <span className="text-[var(--color-text-secondary)]">Category:</span>
              <span className="font-medium text-[var(--color-text)]">
                {device.product?.category?.name}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[var(--color-border)]">
              <span className="text-[var(--color-text-secondary)]">Purchase Date:</span>
              <span className="font-medium text-[var(--color-text)]">
                {formatDate(device.purchaseDate)}
              </span>
            </div>
            {device.purchasePrice != null && (
              <div className="flex justify-between py-1.5 border-b border-[var(--color-border)]">
                <span className="text-[var(--color-text-secondary)]">Purchase Price:</span>
                <span className="font-semibold text-[var(--color-text)]">
                  {formatCurrency(device.purchasePrice)}
                </span>
              </div>
            )}
            <div className="flex justify-between py-1.5">
              <span className="text-[var(--color-text-secondary)]">Invoice Verification:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {device.invoiceVerified ? 'Verified' : 'Pending Verification'}
              </span>
            </div>
          </div>
        </Card>

        {/* Warranty Coverage Engine Card */}
        <Card className="p-6 space-y-4 border-l-4 border-l-[#27C6A5]">
          <h3 className="text-sm font-bold text-[var(--color-text)] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#27C6A5]" />
            Warranty Coverage Engine
          </h3>

          <div className="p-4 rounded-xl bg-[var(--color-surface-sunken)] text-center space-y-1">
            <div className="text-3xl font-extrabold text-[#27C6A5]">
              {daysRemaining} Days
            </div>
            <div className="text-xs text-[var(--color-text-secondary)]">
              Remaining in active coverage period
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[var(--color-text-secondary)]">Policy Tier:</span>
              <span className="font-bold text-[var(--color-text)]">
                {device.warranty?.policyName || 'Standard'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-secondary)]">Coverage Start:</span>
              <span className="font-medium text-[var(--color-text)]">
                {formatDate(device.warranty?.startDate)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-secondary)]">Coverage Expiry:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {formatDate(device.warranty?.endDate)}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-[var(--color-border)] space-y-1.5 text-xs">
            <span className="font-semibold text-[var(--color-text)]">Covered Perils:</span>
            <ul className="space-y-1 text-[var(--color-text-secondary)]">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Genuine OEM hardware failures
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Battery capacity degradation &lt; 80%
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Authorized labor & bench inspection
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  )
}
