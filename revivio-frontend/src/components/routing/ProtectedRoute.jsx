import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to their appropriate portal
    if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />
    if (role === 'TECHNICIAN') return <Navigate to="/technician/dashboard" replace />
    return <Navigate to="/customer/dashboard" replace />
  }

  return children
}
