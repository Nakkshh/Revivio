import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wrench, AlertCircle, UploadCloud, CheckCircle2, ArrowRight, Package } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { repairsApi, customerProductsApi, attachmentsApi } from '@/lib/api'

export function CreateRepairPage() {
  const navigate = useNavigate()
  const photoInputRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [fetchingDevices, setFetchingDevices] = useState(true)
  const [error, setError] = useState('')
  const [myProducts, setMyProducts] = useState([])
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  const [form, setForm] = useState({
    customerProductId: '',
    issueCategory: 'HARDWARE',
    issueTitle: '',
    issueDescription: '',
    priority: 'MEDIUM',
    additionalComments: '',
  })

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await customerProductsApi.getMyProducts({ size: 100 })
        const list = res.data?.content || (Array.isArray(res.data) ? res.data : [])
        if (list.length > 0) {
          const mapped = list.map((p) => ({
            id: p.id,
            name: `${p.product?.name || 'Device'} (S/N: ${p.serialNumber})`,
          }))
          setMyProducts(mapped)
          setForm((prev) => ({ ...prev, customerProductId: String(mapped[0].id) }))
        }
      } catch (err) {
        console.error('Failed to load owned devices:', err)
        setError('Failed to load your registered hardware. Please verify your connection.')
      } finally {
        setFetchingDevices(false)
      }
    }
    loadProducts()
  }, [])

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedPhoto(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.customerProductId) {
      setError('Please select a registered device.')
      return
    }
    if (form.issueDescription.trim().length < 20) {
      setError('Problem description must be at least 20 characters long.')
      return
    }

    setError('')
    setLoading(true)
    try {
      const res = await repairsApi.create({
        customerProductId: Number(form.customerProductId),
        issueCategory: form.issueCategory,
        issueTitle: form.issueTitle.trim(),
        issueDescription: form.issueDescription.trim(),
        priority: form.priority,
        additionalComments: form.additionalComments || null,
      })

      // If a defect photo was selected, upload it
      if (selectedPhoto && res.data?.id) {
        try {
          const photoData = new FormData()
          photoData.append('file', selectedPhoto)
          photoData.append('category', 'DEFECT_IMAGE')
          photoData.append('referenceId', String(res.data.id))
          photoData.append('referenceType', 'REPAIR_REQUEST')
          await attachmentsApi.upload(photoData)
        } catch (uploadErr) {
          console.warn('Defect image upload succeeded with warning:', uploadErr)
        }
      }

      navigate('/customer/repairs')
    } catch (err) {
      setError(err.message || 'Failed to submit repair request. Please check that no open ticket already exists for this unit.')
      setLoading(false)
    }
  }

  if (fetchingDevices) {
    return (
      <div className="max-w-2xl mx-auto py-16 flex flex-col items-center justify-center space-y-4">
        <Spinner size="lg" />
        <div className="text-xs text-[var(--color-text-secondary)]">
          Checking your registered hardware inventory...
        </div>
      </div>
    )
  }

  if (myProducts.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <EmptyState
          icon={Package}
          title="No Registered Hardware Found"
          description="You must register a purchased device before requesting warranty service or bench repair."
          actionText="Register Product Now"
          onAction={() => navigate('/customer/products/register')}
        />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
          Request Service & Repair
        </h1>
        <p className="text-xs text-[var(--color-text-secondary)] mt-1">
          Provide diagnostic details and defect photos to initialize your service claim.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs font-medium text-rose-600 dark:text-rose-400">
          {error}
        </div>
      )}

      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Select
            label="Select Registered Device"
            value={form.customerProductId}
            onChange={(e) => setForm({ ...form, customerProductId: e.target.value })}
            options={myProducts.map((p) => ({ value: String(p.id), label: p.name }))}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Issue Category"
              value={form.issueCategory}
              onChange={(e) => setForm({ ...form, issueCategory: e.target.value })}
              options={[
                { value: 'HARDWARE', label: 'Hardware / Power' },
                { value: 'BATTERY', label: 'Battery / Charging' },
                { value: 'DISPLAY', label: 'Display / Glass Panel' },
                { value: 'CONNECTIVITY', label: 'Connectivity / Wi-Fi / BT' },
                { value: 'SOFTWARE', label: 'Firmware / OS Glitch' },
                { value: 'PHYSICAL_DAMAGE', label: 'Chassis / Physical Drop' },
                { value: 'OTHER', label: 'Other Symptoms' },
              ]}
            />

            <Select
              label="Urgency / Priority"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              options={[
                { value: 'LOW', label: 'Low (General maintenance)' },
                { value: 'MEDIUM', label: 'Medium (Standard service)' },
                { value: 'HIGH', label: 'High (Primary device unusable)' },
                { value: 'URGENT', label: 'Urgent (Critical failure)' },
              ]}
            />
          </div>

          <Input
            label="Summary / Defect Title"
            placeholder="e.g. Display backlight flickering intermittently"
            value={form.issueTitle}
            onChange={(e) => setForm({ ...form, issueTitle: e.target.value })}
            required
          />

          <Textarea
            label="Detailed Problem Description (Min 20 characters)"
            placeholder="Describe what happened, when the defect occurs, any troubleshooting steps already attempted..."
            value={form.issueDescription}
            onChange={(e) => setForm({ ...form, issueDescription: e.target.value })}
            rows={4}
            required
          />

          {/* Photo Dropzone with Real File Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
              Product Images / Defect Photos
            </label>
            <input
              type="file"
              ref={photoInputRef}
              className="hidden"
              accept="image/png,image/jpeg,image/webp"
              onChange={handlePhotoSelect}
            />
            <div
              onClick={() => photoInputRef.current?.click()}
              className="p-6 rounded-xl border-2 border-dashed border-[var(--color-border-strong)] hover:border-[#27C6A5] cursor-pointer text-center space-y-2 bg-[var(--color-surface-sunken)] transition-colors"
            >
              <UploadCloud className="w-8 h-8 text-[#27C6A5] mx-auto" />
              <div className="text-xs font-semibold text-[var(--color-text)]">
                {selectedPhoto ? selectedPhoto.name : 'Click to select defect photos (PNG, JPG)'}
              </div>
              <p className="text-[10px] text-[var(--color-text-secondary)]">
                Up to 10MB photo showing damage, serial label, or error screen.
              </p>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              disabled={!form.issueTitle || form.issueDescription.trim().length < 20}
            >
              Submit Service Ticket
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
