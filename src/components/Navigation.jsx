// ===== NAVIGATION COMPONENT =====
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../styles/Navigation.css'

const Navigation = () => {
  const location = useLocation()
  const { isAuthenticated, isAdmin, user, logout } = useAuth()

  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <nav className="main-navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/" className="brand-link">
            <h2>🛍️ Sales Manager</h2>
          </Link>
        </div>

        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            🛒 Store
          </Link>

          {isAuthenticated && isAdmin && (
            <Link
              to="/admin"
              className={`nav-link ${isAdminRoute ? 'active' : ''}`}
            >
              ⚙️ Admin Panel
            </Link>
          )}

          {!isAuthenticated && (
            <Link
              to="/login"
              className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
            >
              🔐 Admin Login
            </Link>
          )}
        </div>

        <div className="nav-user">
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-info">
                👤 {user?.name || user?.email}
                {isAdmin && <span className="admin-badge">Admin</span>}
              </span>
              <button onClick={logout} className="logout-btn">
                Sign Out
              </button>
            </div>
          ) : (
            <div className="nav-info">
              <span className="nav-badge store">Customer Store</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navigation