// ===== COMPONENT PRODUCTS =====
// Component quản lý danh sách sản phẩm và form thêm sản phẩm
import '../styles/Products.css'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

const Products = ({ products, categories, onProductsUpdate, socket }) => {
  const { token } = useAuth()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category_id: ''
  })
  const [editingId, setEditingId] = useState(null)
  const [editingType, setEditingType] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [filterPrice, setFilterPrice] = useState('all')

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

  // Add or update product
  const addProduct = async (e) => {
    e.preventDefault()

    if (!newProduct.name || !newProduct.price) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const url = editingId
        ? `${API_BASE_URL}/products/${editingId}`
        : `${API_BASE_URL}/products`

      const method = editingId ? 'PUT' : 'POST'

      const response = await authenticatedFetch(url, {
        method,
        body: JSON.stringify({
          name: newProduct.name,
          price: parseFloat(newProduct.price),
          description: newProduct.description,
          category_id: newProduct.category_id ? parseInt(newProduct.category_id) : null
        })
      })

      if (response.ok) {
        setNewProduct({
          name: '',
          price: '',
          description: '',
          category_id: ''
        })
        setShowAddForm(false)
        setEditingId(null)
        setEditingType(null)
        onProductsUpdate() // Refresh products list
      } else {
        const error = await response.json()
        alert(`Error: ${error.error || 'Failed to save product'}`)
      }
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Failed to save product')
    }
  }

  // Delete product
  const deleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        onProductsUpdate() // Refresh products list
      } else {
        const error = await response.json()
        alert(`Error: ${error.error || 'Failed to delete product'}`)
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product')
    }
  }

  // Start editing product
  const startEditProduct = (product) => {
    setNewProduct({
      name: product.name,
      price: product.price.toString(),
      description: product.description || '',
      category_id: product.category_id?.toString() || ''
    })
    setEditingId(product.id)
    setEditingType('product')
    setShowAddForm(true)
  }

  // Cancel editing
  const cancelEdit = () => {
    setNewProduct({
      name: '',
      price: '',
      description: '',
      category_id: ''
    })
    setEditingId(null)
    setEditingType(null)
    setShowAddForm(false)
  }

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    categories.find(cat => cat.id === product.category_id)?.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Sắp xếp sản phẩm
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'newest':
        return new Date(b.created_at) - new Date(a.created_at)
      default:
        return 0
    }
  })

  // Lọc theo giá
  const finalProducts = sortedProducts.filter(product => {
    if (filterPrice === 'under-100') return product.price < 100
    if (filterPrice === '100-500') return product.price >= 100 && product.price <= 500
    if (filterPrice === 'over-500') return product.price > 500
    return true
  })

  return (
    <div className="content">
      {/* Header với tiêu đề và thanh công cụ */}
      <div className="content-header">
        <h2>📦 Products</h2>
        <div className="content-actions">
          {/* Thanh tìm kiếm sản phẩm */}
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {/* Nút thêm sản phẩm mới */}
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
            {showAddForm ? 'Cancel' : '+ Add Product'}
          </button>
        </div>
      </div>

      {/* Filter & Sort Section */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Name (A-Z)</option>
            <option value="price-low">Price (Low to High)</option>
            <option value="price-high">Price (High to Low)</option>
            <option value="newest">Newest</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Filter by price:</label>
          <select value={filterPrice} onChange={(e) => setFilterPrice(e.target.value)}>
            <option value="all">All Prices</option>
            <option value="under-100">Under $100</option>
            <option value="100-500">$100 - $500</option>
            <option value="over-500">Over $500</option>
          </select>
        </div>

        <div className="filter-info">
          <small>Showing {finalProducts.length} of {filteredProducts.length} products</small>
        </div>
      </div>

      {/* Form thêm/chỉnh sửa sản phẩm */}
      {showAddForm && (
        <form onSubmit={addProduct} className="add-form">
          <h3>{editingId && editingType === 'product' ? 'Edit Product' : 'Add New Product'}</h3>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Price:</label>
            <input
              type="number"
              step="0.01"
              value={newProduct.price}
              onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              value={newProduct.description}
              onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Category:</label>
            <select
              value={newProduct.category_id}
              onChange={(e) => setNewProduct({...newProduct, category_id: e.target.value})}
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {editingId && editingType === 'product' ? 'Update Product' : 'Add Product'}
            </button>
            {editingId && editingType === 'product' && (
              <button type="button" onClick={cancelEdit} className="cancel-btn">
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      )}

      {/* Grid hiển thị danh sách sản phẩm đã lọc */}
      <div className="products-grid">
        {finalProducts.length > 0 ? (
          finalProducts.map(product => (
            <div key={product.id} className="product-card">
              <h3>{product.name}</h3>
              <p className="price">${product.price}</p>
              {product.category_name && <p className="category">Category: {product.category_name}</p>}
              {product.description && <p className="description">{product.description}</p>}
              <small>Added: {new Date(product.created_at).toLocaleDateString()}</small>
              <div className="card-actions">
                <button 
                  onClick={() => startEditProduct(product)} 
                  className="edit-btn"
                >
                  ✎ Edit
                </button>
                <button 
                  onClick={() => deleteProduct(product.id)} 
                  className="delete-btn"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>No products found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Products