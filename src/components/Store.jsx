// ===== STORE COMPONENT - CUSTOMER FACING HOMEPAGE =====
import { useState, useEffect } from 'react'
import ProductCard from './ProductCard'
import Cart from './Cart'
import '../styles/Store.css'

const Store = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch products and categories
  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  // Filter products based on category and search
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category_name === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Cart functions
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        return [...prevCart, { ...product, quantity }]
      }
    })
  }

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  if (loading) {
    return (
      <div className="store-loading">
        <div className="loading-spinner"></div>
        <p>Loading our amazing products...</p>
      </div>
    )
  }

  return (
    <div className="store-container">
      {/* Header */}
      <header className="store-header">
        <div className="store-logo">
          <h1>🛍️ ShopHub</h1>
          <p>Your one-stop shopping destination</p>
        </div>

        <div className="store-controls">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-btn">🔍</button>
          </div>

          <button
            className="cart-btn"
            onClick={() => setShowCart(!showCart)}
          >
            🛒 Cart ({getTotalItems()})
          </button>
        </div>
      </header>

      {/* Category Filter */}
      <nav className="category-nav">
        <button
          className={selectedCategory === 'all' ? 'active' : ''}
          onClick={() => setSelectedCategory('all')}
        >
          All Products
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            className={selectedCategory === category.name ? 'active' : ''}
            onClick={() => setSelectedCategory(category.name)}
          >
            {category.name}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="store-main">
        <div className="products-section">
          <div className="section-header">
            <h2>
              {selectedCategory === 'all' ? 'All Products' : `${selectedCategory} Products`}
              <span className="product-count">({filteredProducts.length})</span>
            </h2>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="no-products">
              <p>😔 No products found matching your criteria.</p>
              <button onClick={() => {
                setSelectedCategory('all')
                setSearchTerm('')
              }}>
                Show All Products
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          )}
        </div>

        {/* Cart Sidebar */}
        {showCart && (
          <Cart
            cart={cart}
            onClose={() => setShowCart(false)}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            totalPrice={getTotalPrice()}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="store-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>🛍️ ShopHub</h3>
            <p>Your trusted online shopping partner</p>
          </div>
          <div className="footer-section">
            <h3>📞 Contact</h3>
            <p>support@shophub.com</p>
            <p>+1 (555) 123-4567</p>
          </div>
          <div className="footer-section">
            <h3>📍 Address</h3>
            <p>123 Shopping Street</p>
            <p>Commerce City, CC 12345</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 ShopHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Store