// ===== CHARTS COMPONENT =====
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line, Bar, Pie } from 'react-chartjs-2'
import '../styles/Charts.css'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const Charts = ({ sales, products }) => {
  // Tính toán dữ liệu cho biểu đồ
  // 1. Top products by sales
  const productSalesMap = {}
  sales.forEach(sale => {
    if (!productSalesMap[sale.product_name]) {
      productSalesMap[sale.product_name] = 0
    }
    productSalesMap[sale.product_name] += sale.total_amount
  })

  const topProducts = Object.entries(productSalesMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // 2. Sales by product (pie chart)
  const totalProductSales = Object.values(productSalesMap)
  const productLabels = Object.keys(productSalesMap)

  // 3. Daily sales trend (last 7 days)
  const dailySalesMap = {}
  sales.forEach(sale => {
    const date = new Date(sale.sale_date).toLocaleDateString()
    if (!dailySalesMap[date]) {
      dailySalesMap[date] = 0
    }
    dailySalesMap[date] += sale.total_amount
  })

  const sortedDates = Object.keys(dailySalesMap).sort()
  const dailySalesValues = sortedDates.map(date => dailySalesMap[date])

  // 4. Product inventory vs Price
  const productNames = products.slice(0, 5).map(p => p.name)
  const productPrices = products.slice(0, 5).map(p => p.price)

  // Chart configurations
  const topProductsChartData = {
    labels: topProducts.map(p => p[0]),
    datasets: [
      {
        label: 'Sales Revenue',
        data: topProducts.map(p => p[1]),
        backgroundColor: '#3b82f6',
        borderColor: '#1e40af',
        borderWidth: 2,
        borderRadius: 8
      }
    ]
  }

  const topProductsOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Top 5 Products by Revenue'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }

  const dailySalesChartData = {
    labels: sortedDates,
    datasets: [
      {
        label: 'Daily Sales',
        data: dailySalesValues,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }
    ]
  }

  const dailySalesOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Sales Trend'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }

  const productDistributionData = {
    labels: productLabels.slice(0, 5),
    datasets: [
      {
        label: 'Sales Amount',
        data: totalProductSales.slice(0, 5),
        backgroundColor: [
          '#3b82f6',
          '#8b5cf6',
          '#10b981',
          '#f59e0b',
          '#ef4444'
        ],
        borderColor: '#fff',
        borderWidth: 2
      }
    ]
  }

  const productDistributionOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom'
      },
      title: {
        display: true,
        text: 'Sales Distribution by Product'
      }
    }
  }

  const priceComparisonData = {
    labels: productNames,
    datasets: [
      {
        label: 'Product Price',
        data: productPrices,
        backgroundColor: '#8b5cf6',
        borderColor: '#6d28d9',
        borderWidth: 2,
        borderRadius: 8
      }
    ]
  }

  const priceComparisonOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Product Prices'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }

  return (
    <div className="charts-container">
      <h2>📊 Analytics & Statistics</h2>
      <p className="charts-subtitle">Visualize your business performance with detailed charts</p>

      <div className="charts-grid">
        {/* Top Products Bar Chart */}
        <div className="chart-card">
          <Bar data={topProductsChartData} options={topProductsOptions} />
        </div>

        {/* Daily Sales Line Chart */}
        <div className="chart-card">
          <Line data={dailySalesChartData} options={dailySalesOptions} />
        </div>

        {/* Product Distribution Pie Chart */}
        <div className="chart-card chart-card-full">
          <div className="pie-wrapper">
            <Pie data={productDistributionData} options={productDistributionOptions} />
          </div>
        </div>

        {/* Product Prices Bar Chart */}
        <div className="chart-card chart-card-full">
          <Bar data={priceComparisonData} options={priceComparisonOptions} />
        </div>
      </div>
    </div>
  )
}

export default Charts
