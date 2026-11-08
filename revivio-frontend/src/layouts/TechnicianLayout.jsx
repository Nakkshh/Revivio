import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Briefcase,
  CheckCircle2,
  LogOut,
  Menu,
  X,
  Wrench,
} from 'lucide-react'
import { RevivioLogo } from '@/components/brand/RevivioLogo'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useAuth } from '@/contexts/AuthContext'
import { cn, getInitials } from '@/lib/utils'

export function TechnicianLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { label: 'Workbench Overview', to: '/technician/dashboard', icon: LayoutDashboard },
    { label: 'Assigned Jobs', to: '/technician/jobs', icon: Briefcase },
    { label: 'Completed Archive', to: '/technician/completed', icon: CheckCircle2 },
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

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-tertiary)] flex items-center gap-1.5">
              <Wrench className="w-3 h-3 text-[#27C6A5]" />
              Technician Workspace
            </div>
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.to
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
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
          </nav>

          <div className="p-3 border-t border-[var(--color-border)] bg-[var(--color-surface-sunken)]">
            <div className="flex items-center justify-between mb-3 px-2">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                  {getInitials(user?.firstName, user?.lastName)}
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-semibold text-[var(--color-text)] truncate">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                    Certified Technician
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
              <span>Workbench Diagnostics</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium">
                Field Tech
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
