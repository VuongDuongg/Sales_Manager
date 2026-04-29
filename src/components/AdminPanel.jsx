// ===== ADMIN PANEL COMPONENT =====
import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from '../contexts/AuthContext'
// Import CSS files - modularized styles
import '../styles/variables.css'
import '../styles/common.css'
import '../styles/App.css'
// Import các component riêng biệt
import Dashboard from './Dashboard'
import Products from './Products'
import Sales from './Sales'
import Charts from './Charts'
import Categories from './Categories'

// URL cơ sở của API backend (Node.js server chạy trên port 3001)
const API_BASE_URL = 'http://localhost:3001/api'
const SOCKET_URL = 'http://localhost:3001'

function AdminPanel() {
  const { token } = useAuth()
  // ===== STATE MANAGEMENT =====
  // State để theo dõi section đang active (dashboard, products, sales)
  const [activeSection, setActiveSection] = useState('dashboard')

  // State lưu dữ liệu dashboard (tổng doanh thu, sản phẩm, khách hàng)
  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalCategories: 0,
    averageSale: 0,
    recentSales: 0,
    topCategory: { category_name: 'N/A', revenue: 0 },
    totalTransactions: 0
  })

  // State lưu danh sách sản phẩm từ database
  const [products, setProducts] = useState([])

  // State lưu danh sách giao dịch bán hàng
  const [sales, setSales] = useState([])

  // State lưu danh sách categories
  const [categories, setCategories] = useState([])

  // State cho socket connection
  const [socket, setSocket] = useState(null)

  // State để hiển thị loading spinner khi đang fetch data
  const [loading, setLoading] = useState(false)

  // ===== FUNCTIONS =====
  // Helper function for authenticated API calls
  const authenticatedFetch = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return fetch(url, {
      ...options,
      headers
    })
  }

  // Hàm fetch dashboard data từ API
 const fetchDashboardData = async () => {
  try {
    setLoading(true)

    const response = await authenticatedFetch(`${API_BASE_URL}/dashboard`)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const data = await response.json()

    setDashboardData(prev => ({
      ...prev,
      ...data,
      topCategory: data.topCategory || {
        category_name: 'N/A',
        revenue: 0
      }
    }))
  } catch (error) {
    console.error('Error fetching dashboard:', error)
  } finally {
    setLoading(false)
  }
}

  // Hàm fetch products từ API
  const fetchProducts = async () => {
    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/products`)
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  // Hàm fetch sales từ API
  const fetchSales = async () => {
    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/sales`)
      const data = await response.json()
      setSales(data)
    } catch (error) {
      console.error('Error fetching sales:', error)
    }
  }

  // Hàm fetch categories từ API
  const fetchCategories = async () => {
    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/categories`)
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  // ===== EFFECTS =====
  // useEffect để fetch data khi component mount
useEffect(() => {
  if (!token) return

  fetchDashboardData()
  fetchProducts()
  fetchSales()
  fetchCategories()

  const socketConnection = io(SOCKET_URL, {
    auth: { token }
  })

  setSocket(socketConnection)

  socketConnection.on('dashboardUpdate', (data) => {
    setDashboardData(prev => ({ ...prev, ...data }))
  })

  socketConnection.on('productsUpdate', fetchProducts)
  socketConnection.on('salesUpdate', () => {
    fetchSales()
    fetchDashboardData()
  })
  socketConnection.on('categoriesUpdate', fetchCategories)

  return () => {
    socketConnection.disconnect()
  }
}, [token])
  // ===== RENDER =====
  return (
    <div className="app">
      {/* Header với navigation */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">📊 Sales Manager - Admin Panel</h1>
          <p className="app-subtitle">Manage your business with real-time insights</p>
        </div>

        {/* Navigation tabs */}
        <nav className="app-navigation">
          <button
            className={`nav-btn ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveSection('dashboard')}
          >
            📈 Dashboard
          </button>
          <button
            className={`nav-btn ${activeSection === 'products' ? 'active' : ''}`}
            onClick={() => setActiveSection('products')}
          >
            📦 Products
          </button>
          <button
            className={`nav-btn ${activeSection === 'sales' ? 'active' : ''}`}
            onClick={() => setActiveSection('sales')}
          >
            💰 Sales
          </button>
          <button
            className={`nav-btn ${activeSection === 'charts' ? 'active' : ''}`}
            onClick={() => setActiveSection('charts')}
          >
            📊 Charts
          </button>
          <button
            className={`nav-btn ${activeSection === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveSection('categories')}
          >
            🏷️ Categories
          </button>
        </nav>
      </header>

      {/* Main content area */}
      <main className="app-main">
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Loading data...</p>
          </div>
        )}

        {/* Render component dựa trên activeSection */}
        {activeSection === 'dashboard' && (
          <Dashboard
            dashboardData={dashboardData}
            products={products}
            sales={sales}
            categories={categories}
          />
        )}

        {activeSection === 'products' && (
          <Products
            products={products}
            categories={categories}
            onProductsUpdate={fetchProducts}
            socket={socket}
          />
        )}

        {activeSection === 'sales' && (
          <Sales
            sales={sales}
            products={products}
            onSalesUpdate={() => {
              fetchSales()
              fetchDashboardData()
            }}
            socket={socket}
          />
        )}

        {activeSection === 'charts' && (
          <Charts sales={sales} products={products} />
        )}

        {activeSection === 'categories' && (
          <Categories
            categories={categories}
            onCategoriesUpdate={fetchCategories}
            socket={socket}
          />
        )}
      </main>
    </div>
  )
}

export default AdminPanel