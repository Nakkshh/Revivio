import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { User, Mail, Key, Phone, ArrowRight, ShieldCheck } from 'lucide-react'
import { RevivioLogo } from '@/components/brand/RevivioLogo'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useAuth } from '@/contexts/AuthContext'
import { authApi } from '@/lib/api'

const registerSchema = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().optional(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export function RegisterPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data) => {
    setError('')
    setLoading(true)
    try {
      const response = await authApi.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || null,
        password: data.password,
      })
      const token = response.data?.token || response.token
      login(token, response.data || response)
      navigate('/customer/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Registration failed. Email may already be in use.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--color-bg)] relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-lg bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 sm:p-10 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <RevivioLogo size="md" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
            Create your Revivio account
          </h1>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Register your devices, guard your warranties, and track bench repairs.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs font-medium text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="Alex"
              icon={User}
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            <Input
              label="Last Name"
              placeholder="Morgan"
              icon={User}
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            placeholder="alex.morgan@domain.com"
            icon={Mail}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Phone Number (Optional)"
            placeholder="+91 98765 43210"
            icon={Phone}
            error={errors.phone?.message}
            {...register('phone')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Password"
              type="password"
              placeholder="At least 8 chars"
              icon={Key}
              error={errors.password?.message}
              {...register('password')}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter password"
              icon={Key}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
            className="w-full mt-4"
          >
            Create Customer Account
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        <div className="text-center text-xs text-[var(--color-text-secondary)]">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#27C6A5] hover:underline">
            Sign in instead
          </Link>
        </div>
      </div>
    </div>
  )
}
