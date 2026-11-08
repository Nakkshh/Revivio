import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { LogIn, Key, Mail, ShieldCheck, ArrowRight, UserCheck, Wrench, Shield } from 'lucide-react'
import { RevivioLogo } from '@/components/brand/RevivioLogo'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useAuth } from '@/contexts/AuthContext'
import { authApi } from '@/lib/api'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export function LoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data) => {
    setError('')
    setLoading(true)
    try {
      const response = await authApi.login(data)
      const token = response.data?.token || response.token
      const role = response.data?.role || response.role

      login(token, response.data || response)

      // Direct to destination or role default
      const from = location.state?.from?.pathname
      if (from) {
        navigate(from, { replace: true })
      } else if (role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true })
      } else if (role === 'TECHNICIAN') {
        navigate('/technician/dashboard', { replace: true })
      } else {
        navigate('/customer/dashboard', { replace: true })
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemoAccount = (email, password) => {
    setValue('email', email, { shouldValidate: true })
    setValue('password', password, { shouldValidate: true })
    setError('')
  }

  return (
    <div className="min-h-screen flex bg-[var(--color-bg)]">
      {/* Left 50% Narrative Showcase (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#142B3B] p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(39,198,165,0.15),transparent_50%)]" />

        <div className="relative z-10">
          <RevivioLogo size="lg" showTagline={true} />
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#27C6A5]/30 bg-[#27C6A5]/10 text-xs font-semibold text-[#27C6A5]">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Security Standards
          </div>
          <h2 className="text-3xl font-extrabold leading-tight">
            Restoring longevity to hardware through unified service management.
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Whether you are registering your newly purchased laptop, reviewing repair diagnostic logs, or managing a field service workshop, Revivio powers your product care.
          </p>
        </div>

        <div className="relative z-10 text-xs text-slate-400">
          Revivio Non-AI Commercial Architecture · Production Release 1.0
        </div>
      </div>

      {/* Right 50% Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md space-y-8">
          <div>
            <div className="lg:hidden mb-6">
              <RevivioLogo size="md" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
              Welcome back
            </h1>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
              Sign in to your designated workspace below.
            </p>
          </div>

          {/* Quick Fast-Fill Demo Accounts */}
          <div className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-sunken)] space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-tertiary)] block">
              Quick Test Credentials
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount('customer1@revivio.com', 'cust123')}
                className="px-2.5 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[#27C6A5] text-[11px] font-semibold text-[var(--color-text)] flex items-center justify-center gap-1 transition-colors"
              >
                <UserCheck className="w-3 h-3 text-emerald-500" /> Customer
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('tech1@revivio.com', 'tech123')}
                className="px-2.5 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-blue-500 text-[11px] font-semibold text-[var(--color-text)] flex items-center justify-center gap-1 transition-colors"
              >
                <Wrench className="w-3 h-3 text-blue-500" /> Technician
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('admin@revivio.com', 'admin123')}
                className="px-2.5 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-purple-500 text-[11px] font-semibold text-[var(--color-text)] flex items-center justify-center gap-1 transition-colors"
              >
                <Shield className="w-3 h-3 text-purple-500" /> Admin
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs font-medium text-rose-600 dark:text-rose-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Work or Personal Email"
              type="email"
              placeholder="alex@revivio.com"
              icon={Mail}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Key}
              error={errors.password?.message}
              {...register('password')}
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              className="w-full mt-2"
            >
              Sign In to Workspace
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          <div className="text-center text-xs text-[var(--color-text-secondary)]">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-[#27C6A5] hover:underline">
              Create customer account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
