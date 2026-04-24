// ===== COMPONENT SALES =====
// Component quản lý danh sách giao dịch bán hàng và form thêm sale
const Sales = ({
  showAddForm,
  setShowAddForm,
  newSale,
  setNewSale,
  addSale,
  searchTerm,
  setSearchTerm,
  filteredSales,
  products
}) => {
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
          <button onClick={() => setShowAddForm(!showAddForm)} className="add-btn">
            {showAddForm ? 'Cancel' : '+ Add Sale'}
          </button>
        </div>
      </div>

      {/* Form thêm giao dịch bán hàng mới */}
      {showAddForm && (
        <form onSubmit={addSale} className="add-form">
          <h3>Add New Sale</h3>
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
          <button type="submit" className="submit-btn">Add Sale</button>
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
            </tr>
          </thead>
          <tbody>
            {filteredSales.map(sale => (
              <tr key={sale.id}>
                <td>{sale.id}</td>
                <td>{sale.product_name}</td>
                <td>{sale.quantity}</td>
                <td className="amount">${sale.total_amount}</td>
                <td>{sale.customer_name}</td>
                <td>{new Date(sale.sale_date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Sales