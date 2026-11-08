import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  UserCheck,
  Package,
  Wrench,
  Clock,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Skeleton } from '@/components/ui/Skeleton'
import { dashboardApi } from '@/lib/api'
import { useTheme } from '@/contexts/ThemeContext'

export function AdminDashboardPage() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [loading, setLoading] = useState(true)

  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalTechnicians: 0,
    totalProducts: 0,
    totalRepairs: 0,
    pendingRepairs: 0,
    inProgressRepairs: 0,
    completedRepairs: 0,
    rejectedRepairs: 0,
    avgCompletionTimeHours: 0,
  })

  const [intakeTrends, setIntakeTrends] = useState([])
  const [categoryBreakdown, setCategoryBreakdown] = useState([])

  useEffect(() => {
    async function loadAdminData() {
      try {
        const [dashRes, trendsRes, catRes] = await Promise.all([
          dashboardApi.getAdminDashboard(),
          dashboardApi.getAdminAnalyticsRepairsOverTime(30),
          dashboardApi.getAdminAnalyticsCategoryBreakdown(),
        ])

        if (dashRes.data) {
          setStats(dashRes.data)
        }
        if (Array.isArray(trendsRes.data)) {
          setIntakeTrends(trendsRes.data)
        }
        if (Array.isArray(catRes.data)) {
          setCategoryBreakdown(catRes.data)
        }
      } catch (err) {
        console.error('Failed to load executive admin telemetry:', err)
      } finally {
        setLoading(false)
      }
    }
    loadAdminData()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text)]">
          Executive Operations Overview
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1">
          Platform-wide repair pipeline, technician capacity, and hardware warranty metrics.
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-l-4 border-l-purple-500">
          <div className="text-[var(--color-text-secondary)] text-xs font-semibold uppercase flex justify-between items-center">
            <span>Total Customers</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-3xl font-extrabold text-[var(--color-text)] mt-2">
            {loading ? <Skeleton className="h-8 w-12" /> : stats.totalCustomers}
          </div>
          <div className="text-[11px] text-purple-600 dark:text-purple-400 mt-1">
            Active verified accounts
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-[#27C6A5]">
          <div className="text-[var(--color-text-secondary)] text-xs font-semibold uppercase flex justify-between items-center">
            <span>Technician Capacity</span>
            <UserCheck className="w-4 h-4 text-[#27C6A5]" />
          </div>
          <div className="text-3xl font-extrabold text-[#27C6A5] mt-2">
            {loading ? <Skeleton className="h-8 w-12" /> : stats.totalTechnicians}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
            Certified bench staff
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-blue-500">
          <div className="text-[var(--color-text-secondary)] text-xs font-semibold uppercase flex justify-between items-center">
            <span>Active Pipeline</span>
            <Wrench className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-2">
            {loading ? <Skeleton className="h-8 w-12" /> : stats.totalRepairs}
          </div>
          <div className="text-[11px] text-[var(--color-text-secondary)] mt-1">
            Intake + Bench repairs
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-amber-500">
          <div className="text-[var(--color-text-secondary)] text-xs font-semibold uppercase flex justify-between items-center">
            <span>Avg Turnaround</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-[var(--color-text)] mt-2">
            {loading ? <Skeleton className="h-8 w-12" /> : `${Math.round(stats.avgCompletionTimeHours)}h`}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
            Mean time to resolution
          </div>
        </Card>
      </div>

      {/* Recharts Operations Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Intake Trends Area Chart */}
        <div className="lg:col-span-8">
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[var(--color-text)]">
                  Repair Intake & Resolution Velocity
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Requests submitted vs hardware repairs signed off
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/admin/analytics')}
              >
                Detailed Analytics →
              </Button>
            </div>

            <div className="h-64 w-full pt-4">
              {loading ? (
                <Skeleton className="h-full w-full rounded-xl" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={intakeTrends}>
                    <defs>
                      <linearGradient id="mintGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#27C6A5" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#27C6A5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
                      stroke={theme === 'dark' ? '#6B8294' : '#8C9EA9'}
                      fontSize={11}
                    />
                    <YAxis
                      stroke={theme === 'dark' ? '#6B8294' : '#8C9EA9'}
                      fontSize={11}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#172A3A' : '#FFFFFF',
                        borderColor: theme === 'dark' ? '#2B4050' : '#E5EAF0',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="requests"
                      stroke="#3B82F6"
                      fill="transparent"
                      strokeWidth={2}
                      name="Intake Claims"
                    />
                    <Area
                      type="monotone"
                      dataKey="completed"
                      stroke="#27C6A5"
                      fill="url(#mintGrad)"
                      strokeWidth={2}
                      name="Completed"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>
        </div>

        {/* Defect Category Donut */}
        <div className="lg:col-span-4">
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-[var(--color-text)]">
              Failure Categories
            </h3>
            <div className="h-48 w-full flex items-center justify-center">
              {loading ? (
                <Skeleton className="h-36 w-36 rounded-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryBreakdown}
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="count"
                    >
                      {categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || '#27C6A5'} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="space-y-1.5 pt-2">
              {categoryBreakdown.map((c) => (
                <div key={c.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color || '#27C6A5' }} />
                    <span className="text-[var(--color-text)]">{c.name}</span>
                  </div>
                  <span className="font-semibold text-[var(--color-text)]">{c.count}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
