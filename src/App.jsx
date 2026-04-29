// Import các hook cần thiết từ React
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// Import CSS files - modularized styles
import './styles/variables.css'
import './styles/common.css'
import './styles/App.css'
// Import các component
import { AuthProvider } from './contexts/AuthContext'
import Navigation from './components/Navigation'
import Store from './components/Store'
import AdminPanel from './components/AdminPanel'
import Login from './components/Login'
import Register from './components/Register'
import Unauthorized from './components/Unauthorized'
import ProtectedRoute from './components/ProtectedRoute'

// Component chính của ứng dụng Sales Manager
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-wrapper">
          <Navigation />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Store />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />

            {/* Error Routes */}
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App