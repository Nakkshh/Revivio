import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ShieldCheck,
  Wrench,
  Package,
  Activity,
  History,
  UserCheck,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  Shield,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { StatusBadge } from '@/components/ui/StatusBadge'

export function LandingPage() {
  const navigate = useNavigate()
  const [simulatedStatus, setSimulatedStatus] = useState('ASSIGNED')

  const cycleStatus = () => {
    const statuses = ['REQUESTED', 'UNDER_REVIEW', 'APPROVED', 'ASSIGNED', 'IN_REPAIR', 'COMPLETED']
    const nextIdx = (statuses.indexOf(simulatedStatus) + 1) % statuses.length
    setSimulatedStatus(statuses[nextIdx])
  }

  const features = [
    {
      icon: Package,
      title: 'Product Registration',
      description:
        'Register your hardware with serial verification and digital invoice proof in under 2 minutes.',
    },
    {
      icon: Shield,
      title: 'Automated Warranty Engine',
      description:
        'Continuous warranty tracking with exact inclusive/exclusive boundaries and clause validation.',
    },
    {
      icon: Wrench,
      title: 'Frictionless Repair Intake',
      description:
        'Submit hardware claims with high-resolution diagnostic images, urgency level, and defect tags.',
    },
    {
      icon: Activity,
      title: 'Live Workbench Telemetry',
      description:
        'Real-time transparency. Follow your device through intake, diagnosis, repair, and sign-off.',
    },
    {
      icon: History,
      title: 'Lifetime Care Passport',
      description:
        'A permanent digital record of every component replacement, battery swap, and service action.',
    },
    {
      icon: UserCheck,
      title: 'Certified Technicians Only',
      description:
        'All work performed by authorized technicians with itemized labor reports and warranty certification.',
    },
  ]

  const steps = [
    { num: '01', title: 'Register Device', desc: 'Add model number & serial with invoice attachment.' },
    { num: '02', title: 'Verify Warranty', desc: 'Automatic policy matching and coverage calculation.' },
    { num: '03', title: 'Request Service', desc: 'Specify defect symptoms and upload condition photos.' },
    { num: '04', title: 'Bench Diagnosis', desc: 'Certified technician repairs your unit with progress updates.' },
    { num: '05', title: 'Restored to Life', desc: 'Download signed completion certificate and resume usage.' },
  ]

  return (
    <div className="space-y-24 py-12 md:py-20 overflow-hidden">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#27C6A5]/30 bg-[#27C6A5]/10 text-xs font-semibold text-[#17876B] dark:text-[#27C6A5]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Product Care & Warranty Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--color-text)] leading-[1.15]">
              Your products deserve a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#27C6A5] to-[#1FA688]">
                second life.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-xl">
              Register your purchased products, verify warranty coverage, and manage every repair through one seamless, high-trust digital platform.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/register')}
                className="shadow-lg shadow-[#27C6A5]/20"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => {
                  const el = document.getElementById('how-it-works')
                  el?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Explore How It Works
              </Button>
            </div>

            {/* Platform Trust Ticker */}
            <div className="pt-6 border-t border-[var(--color-border)] grid grid-cols-3 gap-6 text-left">
              <div>
                <div className="text-2xl font-bold text-[var(--color-text)]">10,000+</div>
                <div className="text-xs text-[var(--color-text-secondary)]">Devices Guarded</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#27C6A5]">99.4%</div>
                <div className="text-xs text-[var(--color-text-secondary)]">Warranty Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--color-text)]">48 hrs</div>
                <div className="text-xs text-[var(--color-text-secondary)]">Avg Bench Turnaround</div>
              </div>
            </div>
          </div>

          {/* Right Hero: Live Interactive Repair Simulator Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-strong)] shadow-2xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-[#27C6A5]">RV-2026-00042</span>
                  <h3 className="text-sm font-semibold text-[var(--color-text)]">MacBook Pro 16" M3 Max</h3>
                </div>
                <StatusBadge status={simulatedStatus} type="repair" />
              </div>

              {/* Hardware Passport Snippet */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-[var(--color-surface-sunken)] text-xs">
                <div>
                  <span className="text-[var(--color-text-secondary)]">Serial No:</span>
                  <div className="font-mono font-medium text-[var(--color-text)]">C02G90XXMD6M</div>
                </div>
                <div>
                  <span className="text-[var(--color-text-secondary)]">Coverage Tier:</span>
                  <div className="font-semibold text-emerald-600 dark:text-emerald-400">Revivio Care+ 24M</div>
                </div>
              </div>

              {/* Reported Defect & Technician update */}
              <div className="space-y-2 text-xs">
                <span className="text-[var(--color-text-secondary)] font-medium">Reported Problem:</span>
                <p className="text-[var(--color-text)] p-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
                  "Intermittent vertical banding across Retina panel after cold boot."
                </p>
              </div>

              {/* Technician Diagnostic Note */}
              <div className="flex items-start gap-3 p-3 rounded-xl border border-blue-500/20 bg-blue-500/5 text-xs">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                  SJ
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-[var(--color-text)]">
                    Sarah Jenkins · Lead Technician
                  </div>
                  <p className="text-[var(--color-text-secondary)] text-[11px]">
                    Display flex harness replaced and calibrated. 24h burn-in test complete.
                  </p>
                </div>
              </div>

              {/* Interactive Cycle Simulator CTA */}
              <div className="pt-2 flex items-center justify-between text-xs border-t border-[var(--color-border)]">
                <span className="text-[var(--color-text-secondary)]">Interactive Simulator:</span>
                <button
                  type="button"
                  onClick={cycleStatus}
                  className="px-2.5 py-1 rounded-md bg-[var(--color-surface-sunken)] hover:bg-[var(--color-border)] text-[#27C6A5] font-semibold flex items-center gap-1 transition-colors"
                >
                  Advance State
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <Badge variant="mint">Platform Capabilities</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text)]">
            Engineered for genuine product longevity
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-text-secondary)]">
            Every feature is designed to replace chaotic email threads, lost warranty slips, and unknown repair bench delays.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[#27C6A5]/50 transition-all duration-200 shadow-sm hover:shadow-md space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-subtle)] text-[#27C6A5] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-[var(--color-text)]">
                  {feat.title}
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  {feat.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* 5-Step Lifecycle Infographic */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <Badge variant="neutral">The Revivio Cycle</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text)]">
            Five steps to total peace of mind
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            A deterministic, state-machine driven workflow that keeps everyone aligned.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((st, i) => (
            <div
              key={st.num}
              className="relative p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] space-y-2 flex flex-col justify-between"
            >
              <div>
                <span className="text-2xl font-black font-mono text-[#27C6A5]">
                  {st.num}
                </span>
                <h4 className="text-sm font-semibold text-[var(--color-text)] mt-2">
                  {st.title}
                </h4>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                  {st.desc}
                </p>
              </div>
              <div className="pt-2 text-[10px] font-semibold text-[#27C6A5] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Step Verified
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-8">
          <div className="text-center max-w-lg mx-auto space-y-2">
            <div className="flex items-center justify-center gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <h3 className="text-2xl font-bold text-[var(--color-text)]">
              Loved by consumers, trusted by technicians
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-[var(--color-surface-sunken)] text-xs space-y-3">
              <p className="text-[var(--color-text)] italic">
                "Getting my OLED TV display repaired under warranty used to take weeks of calling support. On Revivio, my claim was approved in 3 hours and fixed the next day."
              </p>
              <div className="font-semibold text-[var(--color-text)]">
                Vikram Mehta · Verified Customer
              </div>
            </div>
            <div className="p-5 rounded-xl bg-[var(--color-surface-sunken)] text-xs space-y-3">
              <p className="text-[var(--color-text)] italic">
                "As a field technician, the job detail panel gives me exact symptoms, customer photos, and parts history before I even open the chassis."
              </p>
              <div className="font-semibold text-[var(--color-text)]">
                Sarah Jenkins · Certified Technician
              </div>
            </div>
            <div className="p-5 rounded-xl bg-[var(--color-surface-sunken)] text-xs space-y-3">
              <p className="text-[var(--color-text)] italic">
                "The administrative workbench and live Recharts throughput analytics give our operations team total visibility over technician workload."
              </p>
              <div className="font-semibold text-[var(--color-text)]">
                Arun Kulkarni · Operations Director
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-b from-[#142B3B] to-[#0A161F] text-white space-y-6 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to bring your products back to life?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Join thousands of smart hardware owners and certified repair labs using Revivio today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/register')}
            >
              Create Your Free Account
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-white border-slate-600 hover:bg-slate-800"
              onClick={() => navigate('/login')}
            >
              Sign In to Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
