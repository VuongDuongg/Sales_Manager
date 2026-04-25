// ===== COMPONENT SALES =====
// Component quản lý danh sách giao dịch bán hàng và form thêm sale
import '../styles/Sales.css'
import { useState } from 'react'

const Sales = ({
  showAddForm,
  setShowAddForm,
  newSale,
  setNewSale,
  addSale,
  searchTerm,
  setSearchTerm,
  filteredSales,
  products,
  deleteSale,
  startEditSale,
  editingId,
  editingType,
  cancelEdit
}) => {
  const [sortBy, setSortBy] = useState('newest')
  const [filterAmount, setFilterAmount] = useState('all')

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