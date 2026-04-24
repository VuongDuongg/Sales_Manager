# Sales Manager - Cấu trúc Component

## 📁 Cấu trúc thư mục

```
src/
├── components/           # Các component riêng biệt
│   ├── Dashboard.jsx     # Component hiển thị thống kê dashboard
│   ├── Products.jsx      # Component quản lý sản phẩm
│   └── Sales.jsx         # Component quản lý giao dịch bán hàng
├── App.jsx              # Component chính - chứa logic và state management
├── App.css              # Styling cho toàn bộ ứng dụng
├── index.css            # CSS reset và global styles
└── main.jsx             # Entry point của React app
```

## 🔧 Refactoring đã thực hiện

### Trước khi refactor:
- Tất cả JSX code nằm trong file `App.jsx` duy nhất
- Hàm `renderContent()` rất dài với nhiều switch cases
- Khó maintain và test từng phần riêng biệt

### Sau khi refactor:
- **App.jsx**: Chỉ chứa logic state management, API calls, và event handlers
- **Dashboard.jsx**: Component riêng cho phần dashboard
- **Products.jsx**: Component riêng cho phần quản lý sản phẩm
- **Sales.jsx**: Component riêng cho phần quản lý bán hàng

## 📋 Props được truyền cho từng component:

### Dashboard
- `dashboardData`: Object chứa thống kê (totalSales, totalProducts, totalCustomers)

### Products
- `showAddForm`: Boolean để hiển thị/ẩn form thêm sản phẩm
- `setShowAddForm`: Function để toggle form
- `newProduct`: Object chứa dữ liệu form sản phẩm mới
- `setNewProduct`: Function để update form data
- `addProduct`: Function xử lý submit form
- `searchTerm`: String cho tìm kiếm
- `setSearchTerm`: Function update search term
- `filteredProducts`: Array sản phẩm đã được lọc

### Sales
- `showAddForm`: Boolean để hiển thị/ẩn form thêm sale
- `setShowAddForm`: Function để toggle form
- `newSale`: Object chứa dữ liệu form sale mới
- `setNewSale`: Function để update form data
- `addSale`: Function xử lý submit form
- `searchTerm`: String cho tìm kiếm
- `setSearchTerm`: Function update search term
- `filteredSales`: Array sales đã được lọc
- `products`: Array danh sách sản phẩm (để populate dropdown)

## ✅ Lợi ích của việc refactor:

1. **Tách biệt concerns**: Logic và UI được tách riêng
2. **Dễ maintain**: Mỗi component có trách nhiệm riêng
3. **Dễ test**: Có thể test từng component độc lập
4. **Tái sử dụng**: Components có thể được sử dụng lại
5. **Code clarity**: Code dễ đọc và hiểu hơn

## 🚀 Cách chạy ứng dụng:

```bash
# Frontend
npm run dev

# Backend (terminal riêng)
cd backend && npm start
```

Ứng dụng sẽ chạy trên:
- Frontend: http://localhost:5175
- Backend API: http://localhost:3001