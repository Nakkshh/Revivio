import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Package,
  Calendar,
  FileText,
  UploadCloud,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import {
  customerProductsApi,
  brandsApi,
  productsApi,
  warrantyPoliciesApi,
  attachmentsApi,
} from '@/lib/api'

export function RegisterProductPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [error, setError] = useState('')

  // Catalog state
  const [brands, setBrands] = useState([])
  const [products, setProducts] = useState([])
  const [policies, setPolicies] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)

  // Form State
  const [formData, setFormData] = useState({
    productId: '',
    serialNumber: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    purchasePrice: '',
    warrantyPolicyId: '',
    additionalNotes: '',
    invoiceFileName: '',
  })

  useEffect(() => {
    async function loadCatalog() {
      try {
        const [bRes, pRes, polRes] = await Promise.all([
          brandsApi.getAll(),
          productsApi.getAll({ size: 100 }),
          warrantyPoliciesApi.getAll(),
        ])
        
        const bList = Array.isArray(bRes.data) ? bRes.data : []
        const pList = pRes.data?.content || (Array.isArray(pRes.data) ? pRes.data : [])
        const polList = Array.isArray(polRes.data) ? polRes.data : []

        setBrands(bList)
        setProducts(pList)
        setPolicies(polList)

        if (pList.length > 0) {
          setFormData((prev) => ({
            ...prev,
            productId: String(pList[0].id),
          }))
        }
        if (polList.length > 0) {
          setFormData((prev) => ({
            ...prev,
            warrantyPolicyId: String(polList[0].id),
          }))
        }
      } catch (err) {
        console.error('Failed to load official product catalog:', err)
        setError('Failed to fetch hardware catalog. Please verify your connection.')
      } finally {
        setCatalogLoading(false)
      }
    }
    loadCatalog()
  }, [])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setFormData((prev) => ({ ...prev, invoiceFileName: file.name }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const regRes = await customerProductsApi.register({
        productId: Number(formData.productId),
        serialNumber: formData.serialNumber.trim(),
        purchaseDate: formData.purchaseDate,
        purchasePrice: formData.purchasePrice ? Number(formData.purchasePrice) : null,
        warrantyPolicyId: Number(formData.warrantyPolicyId),
        additionalNotes: formData.additionalNotes,
      })

      // If an invoice file was selected, upload it as an attachment
      if (selectedFile && regRes.data?.id) {
        try {
          const uploadData = new FormData()
          uploadData.append('file', selectedFile)
          uploadData.append('category', 'INVOICE')
          uploadData.append('referenceId', String(regRes.data.id))
          uploadData.append('referenceType', 'CUSTOMER_PRODUCT')
          await attachmentsApi.upload(uploadData)
        } catch (uploadErr) {
          console.warn('Invoice upload succeeded with warning:', uploadErr)
        }
      }

      navigate('/customer/products')
    } catch (err) {
      setError(err.message || 'Registration failed. Check serial number uniqueness.')
      setLoading(false)
    }
  }

  if (catalogLoading) {
    return (
      <div className="max-w-2xl mx-auto py-16 flex flex-col items-center justify-center space-y-4">
        <Spinner size="lg" />
        <div className="text-xs text-[var(--color-text-secondary)]">
          Loading hardware catalog and warranty policies...
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Step Indicator Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
          Register Purchased Product
        </h1>
        <p className="text-xs text-[var(--color-text-secondary)] mt-1">
          Add your device to Revivio's digital care network and calculate warranty eligibility.
        </p>

        {/* 3 Steps */}
        <div className="grid grid-cols-3 gap-2 mt-6">
          {[
            { num: 1, title: 'Hardware Model' },
            { num: 2, title: 'Serial & Purchase' },
            { num: 3, title: 'Invoice & Policy' },
          ].map((s) => (
            <div
              key={s.num}
              className={`p-3 rounded-lg border text-center transition-colors ${
                step === s.num
                  ? 'border-[#27C6A5] bg-[#27C6A5]/10 text-[#17876B] dark:text-[#27C6A5]'
                  : step > s.num
                  ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600'
                  : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)]'
              }`}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider">
                Step 0{s.num}
              </div>
              <div className="text-xs font-semibold">{s.title}</div>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs font-medium text-rose-600 dark:text-rose-400">
          {error}
        </div>
      )}

      {/* Card Form */}
      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: Model Selection */}
          {step === 1 && (
            <div className="space-y-5">
              <Select
                label="Product Model from Official Catalog"
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                options={products.map((p) => ({
                  value: String(p.id),
                  label: `${p.name} (Model: ${p.modelNumber} · ${p.brand?.name || 'OEM'})`,
                }))}
              />

              <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-sunken)] flex items-start gap-3">
                <Package className="w-5 h-5 text-[#27C6A5] mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-semibold text-[var(--color-text)]">
                    Official OEM Catalog Validation
                  </span>
                  <p className="text-[var(--color-text-secondary)]">
                    Selecting an authorized catalog model guarantees authentic component compatibility during any future repair services.
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  variant="primary"
                  size="md"
                  disabled={!formData.productId}
                  onClick={() => setStep(2)}
                >
                  Proceed to Serial Details
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Purchase & Serial Details */}
          {step === 2 && (
            <div className="space-y-5">
              <Input
                label="Hardware Serial Number (Unique Identifier)"
                placeholder="e.g. C02G90XXMD6M"
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                hint="Check your physical device chassis, original packaging, or invoice receipt."
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Purchase Date"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
                <Input
                  label="Purchase Price (INR, Optional)"
                  type="number"
                  placeholder="e.g. 129990"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <Button variant="ghost" size="md" onClick={() => setStep(1)} icon={ArrowLeft}>
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  disabled={!formData.serialNumber.trim()}
                  onClick={() => setStep(3)}
                >
                  Proceed to Warranty Tier
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Policy Selection & Invoice Upload */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Select Applicable Warranty Policy
                </label>
                <div className="space-y-2.5">
                  {policies.map((pol) => (
                    <label
                      key={pol.id}
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        formData.warrantyPolicyId === String(pol.id)
                          ? 'border-[#27C6A5] bg-[#27C6A5]/5 shadow-sm'
                          : 'border-[var(--color-border)] hover:border-[var(--color-border-strong)]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="warrantyPolicy"
                          value={String(pol.id)}
                          checked={formData.warrantyPolicyId === String(pol.id)}
                          onChange={(e) => setFormData({ ...formData, warrantyPolicyId: e.target.value })}
                          className="text-[#27C6A5] focus:ring-[#27C6A5]"
                        />
                        <div>
                          <div className="text-xs font-bold text-[var(--color-text)]">
                            {pol.name}
                          </div>
                          <div className="text-[11px] text-[var(--color-text-secondary)]">
                            {pol.description || `${pol.durationMonths} Months standard hardware coverage`}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-semibold text-[#27C6A5]">
                        {pol.durationMonths} Months
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Real Invoice File Upload Dropzone */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Proof of Purchase Invoice (PDF, PNG, JPG)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".pdf,image/png,image/jpeg,image/webp"
                  onChange={handleFileChange}
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-6 rounded-xl border-2 border-dashed border-[var(--color-border-strong)] hover:border-[#27C6A5] cursor-pointer text-center space-y-2 bg-[var(--color-surface-sunken)] transition-colors"
                >
                  <UploadCloud className="w-8 h-8 text-[#27C6A5] mx-auto" />
                  <div className="text-xs font-semibold text-[var(--color-text)]">
                    {formData.invoiceFileName || 'Click to select or drag and drop invoice receipt'}
                  </div>
                  <p className="text-[10px] text-[var(--color-text-secondary)]">
                    Max file size 10MB. Official store or e-commerce tax invoice.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <Button variant="ghost" size="md" onClick={() => setStep(2)} icon={ArrowLeft}>
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={loading}
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Complete Product Registration
                </Button>
              </div>
            </div>
          )}
        </form>
      </Card>
    </div>
  )
}
