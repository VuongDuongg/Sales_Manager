// ===== COMPONENT DASHBOARD =====
// Component hiển thị dashboard với các thống kê tổng quan
import '../styles/Dashboard.css'

const Dashboard = ({ dashboardData }) => {
  // Dynamic stats configuration
  const statsConfig = [
    {
      key: 'totalSales',
      title: 'Total Sales',
      icon: '💰',
      value: `$${dashboardData.totalSales?.toLocaleString() || 0}`,
      description: 'All time revenue',
      color: 'sales'
    },
    {
      key: 'totalProducts',
      title: 'Products',
      icon: '📦',
      value: dashboardData.totalProducts || 0,
      description: 'Available products',
      color: 'products'
    },
    {
      key: 'totalCustomers',
      title: 'Customers',
      icon: '👥',
      value: dashboardData.totalCustomers || 0,
      description: 'Active customers',
      color: 'customers'
    },
    {
      key: 'totalCategories',
      title: 'Categories',
      icon: '🏷️',
      value: dashboardData.totalCategories || 0,
      description: 'Product categories',
      color: 'categories'
    },
    {
      key: 'averageSale',
      title: 'Avg Sale',
      icon: '📊',
      value: `$${Math.round(dashboardData.averageSale || 0).toLocaleString()}`,
      description: 'Average transaction',
      color: 'average'
    },
    {
      key: 'totalTransactions',
      title: 'Transactions',
      icon: '🔄',
      value: dashboardData.totalTransactions || 0,
      description: 'Total sales count',
      color: 'transactions'
    },
    {
      key: 'recentSales',
      title: 'Recent Sales',
      icon: '📈',
      value: dashboardData.recentSales || 0,
      description: 'Last 7 days',
      color: 'recent'
    },
    {
      key: 'topCategory',
      title: 'Top Category',
      icon: '🏆',
      value: dashboardData.topCategory?.category_name || 'N/A',
      description: `$${Math.round(dashboardData.topCategory?.revenue || 0).toLocaleString()} revenue`,
      color: 'top'
    }
  ];

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
        {statsConfig.map(stat => (
          <div key={stat.key} className={`stat-card ${stat.color}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <h3>{stat.title}</h3>
              <p className="stat-value">{stat.value}</p>
              <small className="stat-change">{stat.description}</small>
            </div>
          </div>
        ))}
      </div>

      {/* Summary section */}
      <div className="summary-section">
        <h3>Quick Summary</h3>
        <p>You have a total of <strong>${dashboardData.totalSales?.toLocaleString() || 0}</strong> in sales across <strong>{dashboardData.totalProducts || 0}</strong> products, serving <strong>{dashboardData.totalCustomers || 0}</strong> customers in <strong>{dashboardData.totalCategories || 0}</strong> categories.</p>
        {dashboardData.recentSales > 0 && (
          <p>In the last 7 days, you've made <strong>{dashboardData.recentSales}</strong> sales with an average transaction value of <strong>${Math.round(dashboardData.averageSale || 0).toLocaleString()}</strong>.</p>
        )}
        {dashboardData.topCategory?.category_name !== 'N/A' && (
          <p>Your top performing category is <strong>{dashboardData.topCategory.category_name}</strong> with <strong>${Math.round(dashboardData.topCategory.revenue || 0).toLocaleString()}</strong> in revenue.</p>
        )}
      </div>
    </div>
  )
}

export default Dashboard