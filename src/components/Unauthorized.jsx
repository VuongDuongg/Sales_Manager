// ===== UNAUTHORIZED COMPONENT =====
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../styles/Auth.css'

const Unauthorized = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth()

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>🚫 Access Denied</h2>
          <p>You don't have permission to access this page</p>
        </div>

        <div className="unauthorized-content">
          <div className="access-icon">🔒</div>

          <div className="access-info">
            <h3>Administrator Access Required</h3>
            <p>This page is restricted to administrators only.</p>

            {isAuthenticated && !isAdmin && (
              <p className="user-info">
                You are logged in as: <strong>{useAuth().user?.email}</strong>
                <br />
                Account type: <span className="user-role">Customer</span>
              </p>
            )}
          </div>

          <div className="access-actions">
            {isAuthenticated ? (
              <>
                <Link to="/" className="auth-btn">
                  🛒 Go to Store
                </Link>
                <button onClick={logout} className="auth-btn secondary">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="auth-btn">
                  🔐 Sign In as Admin
                </Link>
                <Link to="/" className="auth-btn secondary">
                  🛒 Go to Store
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Unauthorized