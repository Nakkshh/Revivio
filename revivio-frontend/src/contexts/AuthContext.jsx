import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (e) {
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('revivio-token'))
  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem('revivio-token')
    if (!savedToken) return null
    const payload = parseJwt(savedToken)
    if (!payload || (payload.exp && payload.exp * 1000 < Date.now())) {
      localStorage.removeItem('revivio-token')
      return null
    }
    const rawRole = payload.role || 'CUSTOMER'
    return {
      userId: payload.userId,
      email: payload.sub,
      role: rawRole.replace(/^ROLE_/, ''),
      firstName: payload.firstName || 'User',
      lastName: payload.lastName || '',
    }
  })

  const login = (jwtToken, userProfile = null) => {
    localStorage.setItem('revivio-token', jwtToken)
    setToken(jwtToken)
    const payload = parseJwt(jwtToken)
    const rawRole = userProfile?.role || payload?.role || 'CUSTOMER'
    setUser({
      userId: userProfile?.userId || payload?.userId,
      email: userProfile?.email || payload?.sub,
      role: rawRole.replace(/^ROLE_/, ''),
      firstName: userProfile?.firstName || payload?.firstName || 'User',
      lastName: userProfile?.lastName || payload?.lastName || '',
    })
  }

  const logout = () => {
    localStorage.removeItem('revivio-token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        role: user?.role,
        isAuthenticated: !!token && !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
