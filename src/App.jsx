// Import các hook cần thiết từ React
import { useState, useEffect } from 'react'
// Import file CSS để styling
import './App.css'
// Import các component riêng biệt
import Dashboard from './components/Dashboard'
import Products from './components/Products'
import Sales from './components/Sales'

// URL cơ sở của API backend (Node.js server chạy trên port 3001)
const API_BASE_URL = 'http://localhost:3001/api'

// Component chính của ứng dụng Sales Manager
function App() {
  // ===== STATE MANAGEMENT =====
  // State để theo dõi section đang active (dashboard, products, sales)
  const [activeSection, setActiveSection] = useState('dashboard')

  // State lưu dữ liệu dashboard (tổng doanh thu, sản phẩm, khách hàng)
  const [dashboardData, setDashboardData] = useState({ totalSales: 0, totalProducts: 0, totalCustomers: 0 })

  // State lưu danh sách sản phẩm từ database
  const [products, setProducts] = useState([])

  // State lưu danh sách giao dịch bán hàng
  const [sales, setSales] = useState([])

  // State để hiển thị loading spinner khi đang fetch data
  const [loading, setLoading] = useState(false)

  // State lưu thông báo lỗi nếu có
  const [error, setError] = useState(null)

  // State kiểm soát hiển thị form thêm mới (product/sale)
  const [showAddForm, setShowAddForm] = useState(false)

  // State cho chức năng tìm kiếm
  const [searchTerm, setSearchTerm] = useState('')

  // ===== FORM STATES =====
  // State cho form thêm sản phẩm mới
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '' })

  // State cho form thêm giao dịch bán hàng mới
  const [newSale, setNewSale] = useState({ product_id: '', quantity: '', customer_name: '' })

  // ===== API FUNCTIONS =====
  // Hàm fetch dữ liệu dashboard từ backend
  const fetchDashboardData = async () => {
    setLoading(true) // Hiển thị loading
    try {
      // Gọi API GET /api/dashboard
      const response = await fetch(`${API_BASE_URL}/dashboard`)
      if (!response.ok) throw new Error('Failed to fetch dashboard data')

      const data = await response.json()
      setDashboardData(data) // Cập nhật state với dữ liệu từ server
      setError(null) // Xóa lỗi cũ nếu có
    } catch (err) {
      setError(err.message) // Lưu thông báo lỗi
    } finally {
      setLoading(false) // Ẩn loading
    }
  }

  // Hàm fetch danh sách sản phẩm từ backend
  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/products`)
      if (!response.ok) throw new Error('Failed to fetch products')

      const data = await response.json()
      setProducts(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Hàm fetch danh sách giao dịch bán hàng từ backend
  const fetchSales = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/sales`)
      if (!response.ok) throw new Error('Failed to fetch sales')

      const data = await response.json()
      setSales(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ===== USE EFFECT HOOKS =====
  // useEffect tự động fetch dữ liệu dashboard khi chuyển sang section dashboard
  useEffect(() => {
    if (activeSection === 'dashboard') {
      fetchDashboardData() // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [activeSection]) // Chạy lại khi activeSection thay đổi

  // useEffect tự động fetch dữ liệu products khi chuyển sang section products
  useEffect(() => {
    if (activeSection === 'products') {
      fetchProducts() // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [activeSection])

  // useEffect tự động fetch dữ liệu sales khi chuyển sang section sales
  useEffect(() => {
    if (activeSection === 'sales') {
      fetchSales() // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [activeSection])

  // ===== EVENT HANDLERS =====
  // Hàm xử lý thêm sản phẩm mới
  const addProduct = async (e) => {
    e.preventDefault() // Ngăn form submit mặc định
    try {
      // Gọi API POST để tạo sản phẩm mới
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct) // Chuyển object thành JSON
      })
      if (!response.ok) throw new Error('Failed to add product')

      // Reset form sau khi thêm thành công
      setNewProduct({ name: '', price: '', description: '' })
      setShowAddForm(false) // Ẩn form

      // Refresh lại dữ liệu
      fetchProducts() // Cập nhật danh sách sản phẩm
      fetchDashboardData() // Cập nhật thống kê dashboard
    } catch (err) {
      setError(err.message)
    }
  }

  // Hàm xử lý thêm giao dịch bán hàng mới
  const addSale = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_BASE_URL}/sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSale)
      })
      if (!response.ok) throw new Error('Failed to add sale')

      // Reset form
      setNewSale({ product_id: '', quantity: '', customer_name: '' })
      setShowAddForm(false)

      // Refresh dữ liệu
      fetchSales()
      fetchDashboardData() // Cập nhật thống kê
    } catch (err) {
      setError(err.message)
    }
  }

  // ===== FILTER FUNCTIONS =====
  // Lọc sản phẩm dựa trên từ khóa tìm kiếm
  const filteredProducts = products.filter(product =>
    // Tìm trong tên sản phẩm (không phân biệt hoa thường)
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    // Hoặc tìm trong mô tả sản phẩm
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Lọc giao dịch bán hàng dựa trên từ khóa tìm kiếm
  const filteredSales = sales.filter(sale =>
    // Tìm trong tên sản phẩm
    sale.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    // Hoặc tìm trong tên khách hàng
    sale.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // ===== RENDER FUNCTIONS =====
  // Hàm render nội dung chính - sử dụng các component riêng biệt thay vì JSX trực tiếp
  const renderContent = () => {
    // Hiển thị loading spinner khi đang fetch data
    if (loading) {
      return (
        <div className="content">
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
      )
    }

    // Hiển thị thông báo lỗi nếu có
    if (error) {
      return (
        <div className="content">
          <div className="error">
            <h3>⚠️ Error</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="retry-btn">
              Retry
            </button>
          </div>
        </div>
      )
    }

    // Render nội dung dựa trên section đang active
    switch (activeSection) {
      case 'dashboard':
        // Sử dụng component Dashboard riêng biệt
        return <Dashboard dashboardData={dashboardData} />
      case 'products':
        // Sử dụng component Products riêng biệt
        return (
          <Products
            showAddForm={showAddForm}
            setShowAddForm={setShowAddForm}
            newProduct={newProduct}
            setNewProduct={setNewProduct}
            addProduct={addProduct}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredProducts={filteredProducts}
          />
        )
      case 'sales':
        // Sử dụng component Sales riêng biệt
        return (
          <Sales
            showAddForm={showAddForm}
            setShowAddForm={setShowAddForm}
            newSale={newSale}
            setNewSale={setNewSale}
            addSale={addSale}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredSales={filteredSales}
            products={products}
          />
        )
      default:
        // Màn hình chào mừng mặc định khi chưa chọn section nào
        return (
          <div className="content">
            <div className="welcome">
              <h2>🏪 Welcome to Sales Manager</h2>
              <p>Select a section from the menu to get started</p>
            </div>
          </div>
        )
    }
  }

  // ===== MAIN JSX RETURN =====
  // Cấu trúc chính của ứng dụng
  return (
    <div className="app">
      {/* Header của ứng dụng */}
      <header className="header">
        <div className="header-content">
          <h1>🏪 Sales Manager</h1>
          <p>Manage your business efficiently</p>
        </div>
      </header>

      {/* Layout chính với sidebar và nội dung */}
      <div className="main-layout">
        {/* Sidebar điều hướng */}
        <nav className="sidebar">
          <div className="sidebar-header">
            <h3>Menu</h3>
          </div>
          <ul>
            {/* Nút chuyển đến Dashboard */}
            <li>
              <button
                className={activeSection === 'dashboard' ? 'active' : ''}
                onClick={() => setActiveSection('dashboard')}
              >
                📊 Dashboard
              </button>
            </li>
            {/* Nút chuyển đến Products */}
            <li>
              <button
                className={activeSection === 'products' ? 'active' : ''}
                onClick={() => setActiveSection('products')}
              >
                📦 Products
              </button>
            </li>
            {/* Nút chuyển đến Sales */}
            <li>
              <button
                className={activeSection === 'sales' ? 'active' : ''}
                onClick={() => setActiveSection('sales')}
              >
                🛒 Sales
              </button>
            </li>
          </ul>
        </nav>

        {/* Nội dung chính - render theo section đang active */}
        <main className="main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default App
