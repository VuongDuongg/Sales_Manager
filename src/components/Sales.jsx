// ===== COMPONENT SALES =====
// Component quản lý danh sách giao dịch bán hàng và form thêm sale
import '../styles/Sales.css'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

const Sales = ({ sales, products, onSalesUpdate, socket }) => {
  const { token } = useAuth()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newSale, setNewSale] = useState({
    product_id: '',
    quantity: '',
    customer_name: ''
  })
  const [editingId, setEditingId] = useState(null)
  const [editingType, setEditingType] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [filterAmount, setFilterAmount] = useState('all')

  // API base URL
  const API_BASE_URL = 'http://localhost:3001/api'

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

  // Add or update sale
  const addSale = async (e) => {
    e.preventDefault()

    if (!newSale.product_id || !newSale.quantity || !newSale.customer_name) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const url = editingId
        ? `${API_BASE_URL}/sales/${editingId}`
        : `${API_BASE_URL}/sales`

      const method = editingId ? 'PUT' : 'POST'

      const response = await authenticatedFetch(url, {
        method,
        body: JSON.stringify({
          product_id: parseInt(newSale.product_id),
          quantity: parseInt(newSale.quantity),
          customer_name: newSale.customer_name
        })
      })

      if (response.ok) {
        setNewSale({
          product_id: '',
          quantity: '',
          customer_name: ''
        })
        setShowAddForm(false)
        setEditingId(null)
        setEditingType(null)
        onSalesUpdate() // Refresh sales list
      } else {
        const error = await response.json()
        alert(`Error: ${error.error || 'Failed to save sale'}`)
      }
    } catch (error) {
      console.error('Error saving sale:', error)
      alert('Failed to save sale')
    }
  }

  // Delete sale
  const deleteSale = async (id) => {
    if (!confirm('Are you sure you want to delete this sale?')) return

    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/sales/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        onSalesUpdate() // Refresh sales list
      } else {
        const error = await response.json()
        alert(`Error: ${error.error || 'Failed to delete sale'}`)
      }
    } catch (error) {
      console.error('Error deleting sale:', error)
      alert('Failed to delete sale')
    }
  }

  // Start editing sale
  const startEditSale = (sale) => {
    setNewSale({
      product_id: sale.product_id.toString(),
      quantity: sale.quantity.toString(),
      customer_name: sale.customer_name
    })
    setEditingId(sale.id)
    setEditingType('sale')
    setShowAddForm(true)
  }

  // Cancel editing
  const cancelEdit = () => {
    setNewSale({
      product_id: '',
      quantity: '',
      customer_name: ''
    })
    setEditingId(null)
    setEditingType(null)
    setShowAddForm(false)
  }

  // Filter sales based on search term
  const filteredSales = sales.filter(sale =>
    sale.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    products.find(prod => prod.id === sale.product_id)?.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Sắp xếp giao dịch
  const sortedSales = [...filteredSales].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.sale_date) - new Date(a.sale_date)
      case 'oldest':
        return new Date(a.sale_date) - new Date(b.sale_date)
      case 'amount-high':
        return b.total_amount - a.total_amount
      case 'amount-low':
        return a.total_amount - b.total_amount
      case 'customer':
        return a.customer_name.localeCompare(b.customer_name)
      default:
        return 0
    }
  })

  // Lọc theo số tiền
  const finalSales = sortedSales.filter(sale => {
    if (filterAmount === 'under-1000') return sale.total_amount < 1000
    if (filterAmount === '1000-5000') return sale.total_amount >= 1000 && sale.total_amount <= 5000
    if (filterAmount === 'over-5000') return sale.total_amount > 5000
    return true
  })

  return (
    <div className="content">
      {/* Header với tiêu đề và thanh công cụ */}
      <div className="content-header">
        <h2>🛒 Sales</h2>
        <div className="content-actions">
          {/* Thanh tìm kiếm giao dịch bán hàng */}
          <input
            type="text"
            placeholder="Search sales..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {/* Nút thêm giao dịch bán hàng mới */}
          <button 
            onClick={() => {
              if (showAddForm) {
                cancelEdit()
              } else {
                setShowAddForm(true)
              }
            }} 
            className="add-btn"
          >
            {showAddForm ? 'Cancel' : '+ Add Sale'}
          </button>
        </div>
      </div>

      {/* Filter & Sort Section */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="amount-high">Highest Amount</option>
            <option value="amount-low">Lowest Amount</option>
            <option value="customer">Customer Name</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Filter by amount:</label>
          <select value={filterAmount} onChange={(e) => setFilterAmount(e.target.value)}>
            <option value="all">All Amounts</option>
            <option value="under-1000">Under $1,000</option>
            <option value="1000-5000">$1,000 - $5,000</option>
            <option value="over-5000">Over $5,000</option>
          </select>
        </div>

        <div className="filter-info">
          <small>Showing {finalSales.length} of {filteredSales.length} sales</small>
        </div>
      </div>

      {/* Form thêm/chỉnh sửa giao dịch bán hàng */}
      {showAddForm && (
        <form onSubmit={addSale} className="add-form">
          <h3>{editingId && editingType === 'sale' ? 'Edit Sale' : 'Add New Sale'}</h3>
          <div className="form-group">
            <label>Product:</label>
            {/* Dropdown chọn sản phẩm từ danh sách có sẵn */}
            <select
              value={newSale.product_id}
              onChange={(e) => setNewSale({...newSale, product_id: e.target.value})}
              required
            >
              <option value="">Select a product</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} - ${product.price}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Quantity:</label>
            <input
              type="number"
              min="1"
              value={newSale.quantity}
              onChange={(e) => setNewSale({...newSale, quantity: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Customer Name:</label>
            <input
              type="text"
              value={newSale.customer_name}
              onChange={(e) => setNewSale({...newSale, customer_name: e.target.value})}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {editingId && editingType === 'sale' ? 'Update Sale' : 'Add Sale'}
            </button>
            {editingId && editingType === 'sale' && (
              <button type="button" onClick={cancelEdit} className="cancel-btn">
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      )}

      {/* Bảng hiển thị danh sách giao dịch bán hàng */}
      <div className="table-container">
        <table className="sales-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Amount</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {finalSales.length > 0 ? (
              finalSales.map(sale => (
                <tr key={sale.id} className="table-row-animate">
                  <td>{sale.id}</td>
                  <td>{sale.product_name}</td>
                  <td>{sale.quantity}</td>
                  <td className="amount">${sale.total_amount.toLocaleString()}</td>
                  <td>{sale.customer_name}</td>
                  <td>{new Date(sale.sale_date).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    <button 
                      onClick={() => startEditSale(sale)} 
                      className="edit-btn"
                    >
                      ✎
                    </button>
                    <button 
                      onClick={() => deleteSale(sale.id)} 
                      className="delete-btn"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="empty-state">No sales found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Sales