// ===== COMPONENT PRODUCTS =====
// Component quản lý danh sách sản phẩm và form thêm sản phẩm
const Products = ({
  showAddForm,
  setShowAddForm,
  newProduct,
  setNewProduct,
  addProduct,
  searchTerm,
  setSearchTerm,
  filteredProducts
}) => {
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
          <button onClick={() => setShowAddForm(!showAddForm)} className="add-btn">
            {showAddForm ? 'Cancel' : '+ Add Product'}
          </button>
        </div>
      </div>

      {/* Form thêm sản phẩm mới (hiển thị khi showAddForm = true) */}
      {showAddForm && (
        <form onSubmit={addProduct} className="add-form">
          <h3>Add New Product</h3>
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
          <button type="submit" className="submit-btn">Add Product</button>
        </form>
      )}

      {/* Grid hiển thị danh sách sản phẩm đã lọc */}
      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p className="price">${product.price}</p>
            {product.description && <p className="description">{product.description}</p>}
            <small>Added: {new Date(product.created_at).toLocaleDateString()}</small>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Products