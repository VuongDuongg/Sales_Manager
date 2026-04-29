// ===== COMPONENT PRODUCTS =====
// Component quản lý danh sách sản phẩm và form thêm sản phẩm
import '../styles/Products.css'
import { useState } from 'react'

const Products = ({
  showAddForm,
  setShowAddForm,
  newProduct,
  setNewProduct,
  addProduct,
  searchTerm,
  setSearchTerm,
  filteredProducts,
  deleteProduct,
  startEditProduct,
  editingId,
  editingType,
  cancelEdit,
  categories
}) => {
  const [sortBy, setSortBy] = useState('name')
  const [filterPrice, setFilterPrice] = useState('all')

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