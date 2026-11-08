import React, { useState } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { Menu, X, ArrowRight, ShieldCheck, Wrench, RefreshCw } from 'lucide-react'
import { RevivioLogo } from '@/components/brand/RevivioLogo'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'

export function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isAuthenticated, role, logout } = useAuth()
  const navigate = useNavigate()

  const getDashboardPath = () => {
    if (role === 'ADMIN') return '/admin/dashboard'
    if (role === 'TECHNICIAN') return '/technician/dashboard'
    return '/customer/dashboard'
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)] transition-colors">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[var(--color-surface)]/80 border-b border-[var(--color-border)] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <RevivioLogo size="md" showTagline={false} />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--color-text-secondary)]">
            <a href="#features" className="hover:text-[#27C6A5] transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-[#27C6A5] transition-colors">
              How It Works
            </a>
            <a href="#testimonials" className="hover:text-[#27C6A5] transition-colors">
              Testimonials
            </a>
            <a href="#faq" className="hover:text-[#27C6A5] transition-colors">
              FAQ
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(getDashboardPath())}
                >
                  Go to Portal
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/register')}
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[var(--color-border)] bg-[var(--color-surface)] p-4 space-y-3">
            <nav className="flex flex-col gap-2 text-sm font-medium text-[var(--color-text-secondary)]">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-[#27C6A5]"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-[#27C6A5]"
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-[#27C6A5]"
              >
                Testimonials
              </a>
            </nav>
            <div className="pt-2 border-t border-[var(--color-border)] flex flex-col gap-2">
              {isAuthenticated ? (
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    navigate(getDashboardPath())
                  }}
                >
                  Go to Portal
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      navigate('/login')
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      navigate('/register')
                    }}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Public Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* SaaS Footer */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-1 space-y-3">
              <RevivioLogo size="md" showTagline={true} />
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Revivio connects consumers, certified service technicians, and brand warranty policies into a single, high-trust ecosystem.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text)] mb-3">
                Platform
              </h4>
              <ul className="space-y-2 text-xs text-[var(--color-text-secondary)]">
                <li><Link to="/customer/products" className="hover:text-[#27C6A5]">Product Registration</Link></li>
                <li><Link to="/customer/repairs" className="hover:text-[#27C6A5]">Repair Tracking</Link></li>
                <li><Link to="/customer/warranty" className="hover:text-[#27C6A5]">Warranty Engine</Link></li>
                <li><Link to="/technician/dashboard" className="hover:text-[#27C6A5]">Technician Network</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text)] mb-3">
                Security & Trust
              </h4>
              <ul className="space-y-2 text-xs text-[var(--color-text-secondary)]">
                <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#27C6A5]" /> Verified Serial Verification</li>
                <li className="flex items-center gap-1.5"><Wrench className="w-3.5 h-3.5 text-[#27C6A5]" /> Authorized Technicians Only</li>
                <li className="flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5 text-[#27C6A5]" /> Lifetime Care Passport</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text)] mb-3">
                Authentication
              </h4>
              <p className="text-xs text-[var(--color-text-secondary)] mb-3">
                Access your designated portal via secure role-based login.
              </p>
              <div className="flex flex-col gap-2">
                <Link to="/login" className="text-xs font-medium text-[#27C6A5] hover:underline">
                  Sign in with customer, tech or admin account →
                </Link>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--color-text-secondary)] gap-4">
            <p>© {new Date().getFullYear()} REVIVIO Inc. Bring products back to life. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Warranty Governance</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
