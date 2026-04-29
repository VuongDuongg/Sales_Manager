// ===== AUTH CONTEXT =====
import { createContext, useContext, useState, useEffect } from 'react'

// Tạo Auth Context
const AuthContext = createContext()

// Custom hook để sử dụng Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  // Kiểm tra authentication khi app khởi động
  useEffect(() => {
    checkAuthStatus()
  }, [])

  // Hàm kiểm tra trạng thái đăng nhập
  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (token) {
        // Verify token với backend
        const response = await fetch('http://localhost:3001/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const userData = await response.json()
          setUser(userData.user)
          setIsAuthenticated(true)
          setIsAdmin(userData.user.role === 'admin')
        } else {
          // Token không hợp lệ, xóa
          localStorage.removeItem('authToken')
          setUser(null)
          setIsAuthenticated(false)
          setIsAdmin(false)
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
      setIsAuthenticated(false)
      setIsAdmin(false)
    } finally {
      setLoading(false)
    }
  }

  // Hàm đăng nhập
  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('authToken', data.token)
        setUser(data.user)
        setIsAuthenticated(true)
        setIsAdmin(data.user.role === 'admin')
        return { success: true }
      } else {
        const error = await response.json()
        return { success: false, error: error.message }
      }
    } catch (error) {
      console.error('Login failed:', error)
      return { success: false, error: 'Network error' }
    }
  }

  // Hàm đăng ký
  const register = async (userData) => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('authToken', data.token)
        setUser(data.user)
        setIsAuthenticated(true)
        setIsAdmin(data.user.role === 'admin')
        return { success: true }
      } else {
        const error = await response.json()
        return { success: false, error: error.message }
      }
    } catch (error) {
      console.error('Register failed:', error)
      return { success: false, error: 'Network error' }
    }
  }

  // Hàm đăng xuất
  const logout = () => {
    localStorage.removeItem('authToken')
    setUser(null)
    setIsAuthenticated(false)
    setIsAdmin(false)
  }

  // Hàm kiểm tra quyền admin
  const requireAdmin = () => {
    if (!isAuthenticated) {
      throw new Error('Authentication required')
    }
    if (!isAdmin) {
      throw new Error('Admin access required')
    }
  }

  // Context value
  const value = {
    user,
    isAuthenticated,
    isAdmin,
    loading,
    login,
    register,
    logout,
    requireAdmin,
    checkAuthStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}