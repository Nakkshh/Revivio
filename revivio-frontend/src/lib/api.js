import axios from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach Bearer token to all requests if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('revivio-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for 401 handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('revivio-token')
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        window.location.href = '/login'
      }
    }
    const message =
      error.response?.data?.message || error.message || 'An unexpected error occurred'
    return Promise.reject(new Error(message))
  }
)

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
}

export const brandsApi = {
  getAll: () => api.get('/brands'),
  getById: (id) => api.get(`/brands/${id}`),
  adminCreate: (data) => api.post('/admin/brands', data),
  adminUpdate: (id, data) => api.put(`/admin/brands/${id}`, data),
  adminDelete: (id) => api.delete(`/admin/brands/${id}`),
}

export const categoriesApi = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  adminCreate: (data) => api.post('/admin/categories', data),
  adminUpdate: (id, data) => api.put(`/admin/categories/${id}`, data),
  adminDelete: (id) => api.delete(`/admin/categories/${id}`),
}

export const productsApi = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  adminCreate: (data) => api.post('/admin/products', data),
  adminUpdate: (id, data) => api.put(`/admin/products/${id}`, data),
  adminDelete: (id) => api.delete(`/admin/products/${id}`),
}

export const warrantyPoliciesApi = {
  getAll: () => api.get('/warranty-policies'),
  getById: (id) => api.get(`/warranty-policies/${id}`),
  adminCreate: (data) => api.post('/admin/warranty-policies', data),
  adminUpdate: (id, data) => api.put(`/admin/warranty-policies/${id}`, data),
  adminDelete: (id) => api.delete(`/admin/warranty-policies/${id}`),
}

export const customerProductsApi = {
  register: (data) => api.post('/customer-products/register', data),
  getMyProducts: (params) => api.get('/customer-products/my', { params }),
  getById: (id) => api.get(`/customer-products/${id}`),
}

export const warrantiesApi = {
  getByCustomerProduct: (id) => api.get(`/warranties/customer-product/${id}`),
}

export const repairsApi = {
  create: (data) => api.post('/repairs', data),
  getMy: (params) => api.get('/repairs/my', { params }),
  getById: (id) => api.get(`/repairs/${id}`),
  getHistory: (id) => api.get(`/repairs/${id}/history`),
}

export const adminRepairsApi = {
  getAll: (params) => api.get('/admin/repairs', { params }),
  getById: (id) => api.get(`/admin/repairs/${id}`),
  review: (id, data) => api.patch(`/admin/repairs/${id}/review`, data),
  assign: (id, data) => api.post(`/admin/repairs/${id}/assign`, data),
}

export const technicianJobsApi = {
  getAll: (params) => api.get('/technician/jobs', { params }),
  getById: (id) => api.get(`/technician/jobs/${id}`),
  updateStatus: (id, data) => api.patch(`/technician/jobs/${id}/status`, data),
  submitDiagnosis: (id, data) => api.post(`/technician/jobs/${id}/diagnosis`, data),
  complete: (id, data) => api.post(`/technician/jobs/${id}/complete`, data),
}

export const notificationsApi = {
  getAll: (params) => api.get('/notifications', { params }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.post('/notifications/mark-all-read'),
}

export const dashboardApi = {
  getCustomerDashboard: () => api.get('/customer/dashboard'),
  getTechnicianDashboard: () => api.get('/technician/dashboard'),
  getAdminDashboard: () => api.get('/admin/dashboard'),
  getAdminAnalyticsRepairsOverTime: (days = 30) =>
    api.get('/admin/dashboard/analytics/repairs-over-time', { params: { days } }),
  getAdminAnalyticsStatusDistribution: () =>
    api.get('/admin/dashboard/analytics/status-distribution'),
  getAdminAnalyticsCategoryBreakdown: () =>
    api.get('/admin/dashboard/analytics/category-breakdown'),
  getAdminAnalyticsTechnicianWorkload: () =>
    api.get('/admin/dashboard/analytics/technician-workload'),
}

export const adminUsersApi = {
  getCustomers: (params) => api.get('/admin/customers', { params }),
  getCustomerById: (id) => api.get(`/admin/customers/${id}`),
  updateCustomerStatus: (id, data) => api.put(`/admin/customers/${id}/status`, data),
  getTechnicians: (params) => api.get('/admin/technicians', { params }),
  createTechnician: (data) => api.post('/admin/technicians', data),
  getTechnicianById: (id) => api.get(`/admin/technicians/${id}`),
  updateTechnician: (id, data) => api.put(`/admin/technicians/${id}`, data),
}

export const attachmentsApi = {
  upload: (formData) =>
    api.post('/attachments/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getByReference: (type, id) => api.get(`/attachments/reference/${type}/${id}`),
  downloadUrl: (id) => `${API_BASE_URL}/attachments/${id}/download`,
}
