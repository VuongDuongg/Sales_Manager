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
  Legend,
  Filler,
  TimeScale
} from 'chart.js'
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2'
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
  Legend,
  Filler,
  TimeScale
)

const Charts = ({ sales, products }) => {
  // Enhanced data calculations
  const productSalesMap = {}
  const categorySalesMap = {}
  const monthlySalesMap = {}
  const hourlySalesMap = {}

  sales.forEach(sale => {
    // Product sales
    if (!productSalesMap[sale.product_name]) {
      productSalesMap[sale.product_name] = 0
    }
    productSalesMap[sale.product_name] += sale.total_amount

    // Monthly sales
    const date = new Date(sale.sale_date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    if (!monthlySalesMap[monthKey]) {
      monthlySalesMap[monthKey] = 0
    }
    monthlySalesMap[monthKey] += sale.total_amount

    // Hourly sales (for today)
    const today = new Date()
    const saleDate = new Date(sale.sale_date)
    if (saleDate.toDateString() === today.toDateString()) {
      const hour = saleDate.getHours()
      if (!hourlySalesMap[hour]) {
        hourlySalesMap[hour] = 0
      }
      hourlySalesMap[hour] += sale.total_amount
    }
  })

  // Category analysis
  products.forEach(product => {
    if (product.category_name && productSalesMap[product.name]) {
      if (!categorySalesMap[product.category_name]) {
        categorySalesMap[product.category_name] = 0
      }
      categorySalesMap[product.category_name] += productSalesMap[product.name]
    }
  })

  // Sort and slice data
  const topProducts = Object.entries(productSalesMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)

  const topCategories = Object.entries(categorySalesMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)

  const sortedMonths = Object.keys(monthlySalesMap).sort()
  const monthlyValues = sortedMonths.map(month => monthlySalesMap[month])

  const hours = Array.from({length: 24}, (_, i) => i)
  const hourlyValues = hours.map(hour => hourlySalesMap[hour] || 0)

  // Color schemes
  const colorSchemes = {
    primary: ['#3b82f6', '#1e40af', '#60a5fa', '#93c5fd'],
    success: ['#10b981', '#059669', '#34d399', '#6ee7b7'],
    warning: ['#f59e0b', '#d97706', '#fbbf24', '#fcd34d'],
    danger: ['#ef4444', '#dc2626', '#f87171', '#fca5a5'],
    purple: ['#8b5cf6', '#7c3aed', '#a78bfa', '#c4b5fd'],
    pink: ['#ec4899', '#db2777', '#f472b6', '#fb7185']
  }

  // Enhanced chart configurations with auto-scaling and markers
  const topProductsChartData = {
    labels: topProducts.map(p => p[0].length > 15 ? p[0].substring(0, 15) + '...' : p[0]),
    datasets: [{
      label: 'Revenue ($)',
      data: topProducts.map(p => p[1]),
      backgroundColor: colorSchemes.primary[0],
      borderColor: colorSchemes.primary[1],
      borderWidth: 2,
      borderRadius: 6,
      borderSkipped: false,
      hoverBackgroundColor: colorSchemes.primary[2],
      hoverBorderColor: colorSchemes.primary[3],
      hoverBorderWidth: 3
    }]
  }

  const topProductsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: '🏆 Top Products by Revenue',
        font: { size: 16, weight: 'bold' }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        callbacks: {
          label: (context) => `$${context.parsed.y.toLocaleString()}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.1)',
          borderDash: [5, 5]
        },
        ticks: {
          callback: (value) => `$${value.toLocaleString()}`,
          font: { size: 12 }
        }
      },
      x: {
        grid: { display: false },
        ticks: {
          font: { size: 11 },
          maxRotation: 45,
          minRotation: 45
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    }
  }

  const monthlySalesChartData = {
    labels: sortedMonths.map(month => {
      const [year, monthNum] = month.split('-')
      return `${new Date(year, monthNum - 1).toLocaleString('default', { month: 'short' })} ${year}`
    }),
    datasets: [{
      label: 'Monthly Revenue ($)',
      data: monthlyValues,
      borderColor: colorSchemes.success[1],
      backgroundColor: colorSchemes.success[0],
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointRadius: 6,
      pointBackgroundColor: colorSchemes.success[1],
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointHoverRadius: 8,
      pointHoverBackgroundColor: colorSchemes.success[2]
    }]
  }

  const monthlySalesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: '📈 Monthly Sales Trend',
        font: { size: 16, weight: 'bold' }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        callbacks: {
          label: (context) => `$${context.parsed.y.toLocaleString()}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.1)',
          borderDash: [5, 5]
        },
        ticks: {
          callback: (value) => `$${value.toLocaleString()}`,
          font: { size: 12 }
        }
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } }
      }
    },
    animation: {
      duration: 2500,
      easing: 'easeInOutQuart'
    }
  }

  const categoryChartData = {
    labels: topCategories.map(([name]) => name),
    datasets: [{
      label: 'Revenue by Category ($)',
      data: topCategories.map(([, revenue]) => revenue),
      backgroundColor: [
        colorSchemes.primary[0],
        colorSchemes.success[0],
        colorSchemes.warning[0],
        colorSchemes.danger[0],
        colorSchemes.purple[0],
        colorSchemes.pink[0]
      ],
      borderColor: [
        colorSchemes.primary[1],
        colorSchemes.success[1],
        colorSchemes.warning[1],
        colorSchemes.danger[1],
        colorSchemes.purple[1],
        colorSchemes.pink[1]
      ],
      borderWidth: 2,
      hoverOffset: 10
    }]
  }

  const categoryChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 20, usePointStyle: true }
      },
      title: {
        display: true,
        text: '🏷️ Revenue by Category',
        font: { size: 16, weight: 'bold' }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        callbacks: {
          label: (context) => `${context.label}: $${context.parsed.toLocaleString()}`
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 2000
    }
  }

  const hourlySalesChartData = {
    labels: hours.map(hour => `${hour}:00`),
    datasets: [{
      label: 'Today\'s Hourly Sales ($)',
      data: hourlyValues,
      backgroundColor: colorSchemes.warning[0],
      borderColor: colorSchemes.warning[1],
      borderWidth: 2,
      borderRadius: 4,
      hoverBackgroundColor: colorSchemes.warning[2]
    }]
  }

  const hourlySalesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: '🕐 Today\'s Hourly Performance',
        font: { size: 16, weight: 'bold' }
      },
      tooltip: {
        callbacks: {
          label: (context) => `$${context.parsed.y.toLocaleString()}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.1)' },
        ticks: {
          callback: (value) => `$${value.toLocaleString()}`,
          font: { size: 12 }
        }
      },
      x: {
        grid: { display: false },
        ticks: {
          font: { size: 10 },
          maxTicksLimit: 12
        }
      }
    },
    animation: {
      duration: 1500,
      easing: 'easeOutBounce'
    }
  }

  const performanceMetrics = [
    {
      title: 'Total Revenue',
      value: `$${sales.reduce((sum, sale) => sum + sale.total_amount, 0).toLocaleString()}`,
      icon: '💰',
      color: 'primary'
    },
    {
      title: 'Avg Transaction',
      value: `$${Math.round(sales.reduce((sum, sale) => sum + sale.total_amount, 0) / Math.max(sales.length, 1)).toLocaleString()}`,
      icon: '📊',
      color: 'success'
    },
    {
      title: 'Products Sold',
      value: sales.reduce((sum, sale) => sum + sale.quantity, 0).toLocaleString(),
      icon: '📦',
      color: 'warning'
    },
    {
      title: 'Active Products',
      value: products.length.toString(),
      icon: '🔥',
      color: 'danger'
    }
  ]

  return (
    <div className="charts-container">
      <div className="charts-header">
        <h2>📊 Advanced Analytics Dashboard</h2>
        <p className="charts-subtitle">Comprehensive business insights with auto-scaling charts and real-time metrics</p>
      </div>

      {/* Performance Metrics Cards */}
      <div className="metrics-grid">
        {performanceMetrics.map((metric, index) => (
          <div key={metric.title} className={`metric-card metric-${metric.color}`} style={{animationDelay: `${index * 0.1}s`}}>
            <div className="metric-icon">{metric.icon}</div>
            <div className="metric-content">
              <h4>{metric.title}</h4>
              <p className="metric-value">{metric.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Top Products */}
        <div className="chart-card chart-large">
          <Bar data={topProductsChartData} options={topProductsOptions} />
        </div>

        {/* Monthly Sales Trend */}
        <div className="chart-card chart-large">
          <Line data={monthlySalesChartData} options={monthlySalesOptions} />
        </div>

        {/* Category Distribution */}
        <div className="chart-card chart-medium">
          <Pie data={categoryChartData} options={categoryChartOptions} />
        </div>

        {/* Hourly Performance */}
        <div className="chart-card chart-medium">
          <Bar data={hourlySalesChartData} options={hourlySalesOptions} />
        </div>

        {/* Sales Distribution by Product (Doughnut) */}
        <div className="chart-card chart-medium">
          <Doughnut
            data={{
              labels: Object.keys(productSalesMap).slice(0, 6),
              datasets: [{
                data: Object.values(productSalesMap).slice(0, 6),
                backgroundColor: [
                  colorSchemes.primary[0],
                  colorSchemes.success[0],
                  colorSchemes.warning[0],
                  colorSchemes.danger[0],
                  colorSchemes.purple[0],
                  colorSchemes.pink[0]
                ],
                borderWidth: 3,
                borderColor: '#fff',
                hoverOffset: 15
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'bottom', labels: { padding: 15 } },
                title: {
                  display: true,
                  text: '🥧 Product Sales Distribution',
                  font: { size: 16, weight: 'bold' }
                }
              },
              animation: { animateScale: true, animateRotate: true }
            }}
          />
        </div>

        {/* Product Price Analysis */}
        <div className="chart-card chart-medium">
          <Bar
            data={{
              labels: products.slice(0, 8).map(p => p.name.length > 12 ? p.name.substring(0, 12) + '...' : p.name),
              datasets: [{
                label: 'Price ($)',
                data: products.slice(0, 8).map(p => p.price),
                backgroundColor: colorSchemes.purple[0],
                borderColor: colorSchemes.purple[1],
                borderWidth: 2,
                borderRadius: 6,
                hoverBackgroundColor: colorSchemes.purple[2]
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                title: {
                  display: true,
                  text: '💎 Product Price Analysis',
                  font: { size: 16, weight: 'bold' }
                },
                tooltip: {
                  callbacks: {
                    label: (context) => `$${context.parsed.y.toLocaleString()}`
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: { callback: (value) => `$${value}` }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Summary Insights */}
      <div className="insights-section">
        <h3>🔍 Key Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <h4>📈 Growth Trend</h4>
            <p>Monthly sales show {monthlyValues.length > 1 && monthlyValues[monthlyValues.length - 1] > monthlyValues[monthlyValues.length - 2] ? 'upward' : 'variable'} trend</p>
          </div>
          <div className="insight-card">
            <h4>🏆 Best Performer</h4>
            <p>{topProducts[0]?.[0] || 'N/A'} leads with ${topProducts[0]?.[1]?.toLocaleString() || 0} in revenue</p>
          </div>
          <div className="insight-card">
            <h4>🎯 Category Focus</h4>
            <p>{topCategories[0]?.[0] || 'N/A'} category generates ${topCategories[0]?.[1]?.toLocaleString() || 0}</p>
          </div>
          <div className="insight-card">
            <h4>⚡ Peak Hours</h4>
            <p>Best sales hour: {hourlyValues.indexOf(Math.max(...hourlyValues))}:00</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Charts
