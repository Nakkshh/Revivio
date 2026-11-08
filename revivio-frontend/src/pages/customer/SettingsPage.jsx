import React from 'react'
import { User, Lock, Bell, Moon } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useAuth } from '@/contexts/AuthContext'

export function SettingsPage() {
  const { user } = useAuth()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
          Account & Preferences
        </h1>
        <p className="text-xs text-[var(--color-text-secondary)] mt-1">
          Manage your personal profile, security credentials, and interface theme.
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2">
          <User className="w-4 h-4 text-[#27C6A5]" /> Personal Profile
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Input label="First Name" defaultValue={user?.firstName} />
          <Input label="Last Name" defaultValue={user?.lastName} />
        </div>
        <Input label="Email Address" defaultValue={user?.email} disabled />
        <div className="flex justify-end pt-2">
          <Button variant="primary" size="sm">Save Changes</Button>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2">
          <Moon className="w-4 h-4 text-[#27C6A5]" /> Appearance & Interface
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-[var(--color-text)]">
              Toggle Color Theme
            </div>
            <div className="text-[11px] text-[var(--color-text-secondary)]">
              Switch smoothly between Light and Midnight Navy Dark mode.
            </div>
          </div>
          <ThemeToggle />
        </div>
      </Card>
    </div>
  )
}
