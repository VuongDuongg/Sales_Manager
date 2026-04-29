// ===== PROTECTED ROUTE COMPONENT =====
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const location = useLocation()

  // Hiển thị loading khi đang kiểm tra auth
  if (loading) {
    return (
      <div className="auth-loading">
        <div className="loading-spinner"></div>
        <p>Checking authentication...</p>
      </div>
    )
  }

  // Nếu chưa đăng nhập, chuyển về trang login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Nếu yêu cầu quyền admin nhưng user không phải admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/unauthorized" replace />
  }

  // Nếu đã authenticated và có quyền, render children
  return children
}

export default ProtectedRoute