import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/routing/ProtectedRoute'

// Layouts
import { PublicLayout } from '@/layouts/PublicLayout'
import { CustomerLayout } from '@/layouts/CustomerLayout'
import { TechnicianLayout } from '@/layouts/TechnicianLayout'
import { AdminLayout } from '@/layouts/AdminLayout'

// Public Pages
import { LandingPage } from '@/pages/public/LandingPage'
import { LoginPage } from '@/pages/public/LoginPage'
import { RegisterPage } from '@/pages/public/RegisterPage'

// Customer Pages
import { CustomerDashboardPage } from '@/pages/customer/DashboardPage'
import { MyProductsPage } from '@/pages/customer/MyProductsPage'
import { RegisterProductPage } from '@/pages/customer/RegisterProductPage'
import { ProductDetailPage } from '@/pages/customer/ProductDetailPage'
import { MyRepairsPage } from '@/pages/customer/MyRepairsPage'
import { CreateRepairPage } from '@/pages/customer/CreateRepairPage'
import { RepairDetailPage } from '@/pages/customer/RepairDetailPage'
import { NotificationsPage } from '@/pages/customer/NotificationsPage'
import { SettingsPage } from '@/pages/customer/SettingsPage'

// Technician Pages
import { TechnicianDashboardPage } from '@/pages/technician/DashboardPage'
import { TechnicianJobsPage } from '@/pages/technician/JobsPage'
import { TechnicianJobDetailPage } from '@/pages/technician/JobDetailPage'
import { CompletedPage } from '@/pages/technician/CompletedPage'

// Admin Pages
import { AdminDashboardPage } from '@/pages/admin/DashboardPage'
import { AdminRepairsPage } from '@/pages/admin/RepairsPage'
import { AdminRepairDetailPage } from '@/pages/admin/RepairDetailPage'
import { CustomersPage } from '@/pages/admin/CustomersPage'
import { TechniciansPage } from '@/pages/admin/TechniciansPage'
import { ProductsPage } from '@/pages/admin/ProductsPage'
import { CategoriesPage } from '@/pages/admin/CategoriesPage'
import { BrandsPage } from '@/pages/admin/BrandsPage'
import { WarrantyPoliciesPage } from '@/pages/admin/WarrantyPoliciesPage'
import { AnalyticsPage } from '@/pages/admin/AnalyticsPage'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Customer Portal */}
            <Route
              path="/customer"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
                  <CustomerLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/customer/dashboard" replace />} />
              <Route path="dashboard" element={<CustomerDashboardPage />} />
              <Route path="products" element={<MyProductsPage />} />
              <Route path="products/register" element={<RegisterProductPage />} />
              <Route path="products/:id" element={<ProductDetailPage />} />
              <Route path="repairs" element={<MyRepairsPage />} />
              <Route path="repairs/create" element={<CreateRepairPage />} />
              <Route path="repairs/:id" element={<RepairDetailPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Technician Portal */}
            <Route
              path="/technician"
              element={
                <ProtectedRoute allowedRoles={['TECHNICIAN', 'ADMIN']}>
                  <TechnicianLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/technician/dashboard" replace />} />
              <Route path="dashboard" element={<TechnicianDashboardPage />} />
              <Route path="jobs" element={<TechnicianJobsPage />} />
              <Route path="jobs/:id" element={<TechnicianJobDetailPage />} />
              <Route path="completed" element={<CompletedPage />} />
            </Route>

            {/* Admin Portal */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="repairs" element={<AdminRepairsPage />} />
              <Route path="repairs/:id" element={<AdminRepairDetailPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="technicians" element={<TechniciansPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="brands" element={<BrandsPage />} />
              <Route path="warranty-policies" element={<WarrantyPoliciesPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
            </Route>

            {/* Catch-all redirect to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
