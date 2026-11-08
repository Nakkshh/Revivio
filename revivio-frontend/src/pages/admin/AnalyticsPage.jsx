import React, { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { dashboardApi } from '@/lib/api'
import { useTheme } from '@/contexts/ThemeContext'

export function AnalyticsPage() {
  const { theme } = useTheme()
  const [loading, setLoading] = useState(true)

  const [repairsOverTime, setRepairsOverTime] = useState([])
  const [statusDistribution, setStatusDistribution] = useState([])
  const [categoryBreakdown, setCategoryBreakdown] = useState([])

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const [timeRes, statusRes, catRes] = await Promise.all([
          dashboardApi.getAdminAnalyticsRepairsOverTime(30),
          dashboardApi.getAdminAnalyticsStatusDistribution(),
          dashboardApi.getAdminAnalyticsCategoryBreakdown(),
        ])

        if (Array.isArray(timeRes.data)) {
          setRepairsOverTime(timeRes.data)
        }
        if (Array.isArray(statusRes.data)) {
          setStatusDistribution(statusRes.data)
        }
        if (Array.isArray(catRes.data)) {
          setCategoryBreakdown(catRes.data)
        }
      } catch (err) {
        console.error('Failed to load operations analytics:', err)
      } finally {
        setLoading(false)
      }
    }
    loadAnalytics()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text)]">
          Operations & Reliability Analytics
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1">
          Mean Time To Resolution (MTTR), service claim volume trends, and failure categorization.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Service Volume Trends */}
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-[var(--color-text)]">
            Service Requests & Resolutions (30 Days)
          </h3>
          <div className="h-64 w-full pt-4">
            {loading ? (
              <Skeleton className="h-full w-full rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={repairsOverTime}>
                  <XAxis dataKey="date" stroke={theme === 'dark' ? '#6B8294' : '#8C9EA9'} fontSize={11} />
                  <YAxis stroke={theme === 'dark' ? '#6B8294' : '#8C9EA9'} fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#172A3A' : '#FFFFFF',
                      borderColor: theme === 'dark' ? '#2B4050' : '#E5EAF0',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="requests" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Intake Requests" />
                  <Bar dataKey="completed" fill="#27C6A5" radius={[4, 4, 0, 0]} name="Completed Repairs" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Global Status Distribution */}
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-[var(--color-text)]">
            Lifecycle Status Distribution
          </h3>
          <div className="h-56 w-full flex items-center justify-center">
            {loading ? (
              <Skeleton className="h-36 w-36 rounded-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || '#27C6A5'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs pt-2">
            {statusDistribution.map((s) => (
              <div key={s.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color || '#27C6A5' }} />
                <span className="text-[var(--color-text)]">{s.name}: {s.count} tickets</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
