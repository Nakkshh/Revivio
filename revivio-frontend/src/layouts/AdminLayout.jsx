import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Wrench,
  Users,
  UserCheck,
  Package,
  Layers,
  Award,
  Shield,
  BarChart3,
  LogOut,
  Menu,
  X,
  ShieldAlert,
} from 'lucide-react'
import { RevivioLogo } from '@/components/brand/RevivioLogo'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useAuth } from '@/contexts/AuthContext'
import { cn, getInitials } from '@/lib/utils'

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const navGroups = [
    {
      group: 'Operations',
      items: [
        { label: 'Executive Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Repair Queue & Triage', to: '/admin/repairs', icon: Wrench },
        { label: 'Platform Analytics', to: '/admin/analytics', icon: BarChart3 },
      ],
    },
    {
      group: 'Personnel',
      items: [
        { label: 'Customers Directory', to: '/admin/customers', icon: Users },
        { label: 'Technician Staffing', to: '/admin/technicians', icon: UserCheck },
      ],
    },
    {
      group: 'Master Catalog',
      items: [
        { label: 'Products Master', to: '/admin/products', icon: Package },
        { label: 'Categories', to: '/admin/categories', icon: Layers },
        { label: 'OEM Brands', to: '/admin/brands', icon: Award },
        { label: 'Warranty Policies', to: '/admin/warranty-policies', icon: Shield },
      ],
    },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex bg-[var(--color-bg)] text-[var(--color-text)] transition-colors">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] flex flex-col justify-between transition-transform duration-200 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 px-6 border-b border-[var(--color-border)] flex items-center justify-between">
            <RevivioLogo size="sm" showTagline={false} />
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
            {navGroups.map((g) => (
              <div key={g.group} className="space-y-1">
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                  {g.group}
                </div>
                {g.items.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.to
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors',
                        isActive
                          ? 'bg-[var(--color-accent-subtle)] text-[#17876B] dark:text-[#27C6A5] font-semibold'
                          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-sunken)]'
                      )}
                    >
                      <Icon className={cn('w-4 h-4', isActive ? 'text-[#27C6A5]' : 'text-current')} />
                      {item.label}
                    </NavLink>
                  )
                })}
              </div>
            ))}
          </nav>

          <div className="p-3 border-t border-[var(--color-border)] bg-[var(--color-surface-sunken)]">
            <div className="flex items-center justify-between mb-3 px-2">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                  {getInitials(user?.firstName, user?.lastName)}
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-semibold text-[var(--color-text)] truncate">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    Super Administrator
                  </div>
                </div>
              </div>
              <ThemeToggle />
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 px-4 sm:px-6 lg:px-8 border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-sm flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2">
              <span>Revivio Operations Control</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-medium">
                Admin Console
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
