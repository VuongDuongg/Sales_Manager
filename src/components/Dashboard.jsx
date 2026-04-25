// ===== COMPONENT DASHBOARD =====
// Component hiển thị dashboard với các thống kê tổng quan
import '../styles/Dashboard.css'

const Dashboard = ({ dashboardData }) => {
  return (
    <div className="content">
      {/* Header với tiêu đề và mô tả */}
      <div className="content-header">
        <div>
          <h2>📊 Dashboard</h2>
          <p>Overview of your sales performance</p>
        </div>
      </div>

      {/* Grid hiển thị các thống kê */}
      <div className="stats-grid">
        {/* Card thống kê tổng doanh thu */}
        <div className="stat-card sales">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Sales</h3>
            <p className="stat-value">${dashboardData.totalSales?.toLocaleString() || 0}</p>
            <small className="stat-change">All time</small>
          </div>
        </div>

        {/* Card thống kê số lượng sản phẩm */}
        <div className="stat-card products">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Products</h3>
            <p className="stat-value">{dashboardData.totalProducts || 0}</p>
            <small className="stat-change">Available</small>
          </div>
        </div>

        {/* Card thống kê số lượng khách hàng */}
        <div className="stat-card customers">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Customers</h3>
            <p className="stat-value">{dashboardData.totalCustomers || 0}</p>
            <small className="stat-change">Active</small>
          </div>
        </div>
      </div>

      {/* Summary section */}
      <div className="summary-section">
        <h3>Quick Summary</h3>
        <p>You have a total of <strong>${dashboardData.totalSales?.toLocaleString() || 0}</strong> in sales across <strong>{dashboardData.totalProducts || 0}</strong> products, serving <strong>{dashboardData.totalCustomers || 0}</strong> customers.</p>
      </div>
    </div>
  )
}

export default Dashboard