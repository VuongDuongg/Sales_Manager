// ===== COMPONENT DASHBOARD =====
// Component hiển thị dashboard với các thống kê tổng quan
const Dashboard = ({ dashboardData }) => {
  return (
    <div className="content">
      {/* Header với tiêu đề và mô tả */}
      <div className="content-header">
        <h2>📊 Dashboard</h2>
        <p>Overview of your sales performance</p>
      </div>

      {/* Grid hiển thị các thống kê */}
      <div className="stats-grid">
        {/* Card thống kê tổng doanh thu */}
        <div className="stat-card sales">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Sales</h3>
            <p className="stat-value">${dashboardData.totalSales.toLocaleString()}</p>
          </div>
        </div>

        {/* Card thống kê số lượng sản phẩm */}
        <div className="stat-card products">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Products</h3>
            <p className="stat-value">{dashboardData.totalProducts}</p>
          </div>
        </div>

        {/* Card thống kê số lượng khách hàng */}
        <div className="stat-card customers">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Customers</h3>
            <p className="stat-value">{dashboardData.totalCustomers}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard