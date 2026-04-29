// ===== PRODUCT CARD COMPONENT =====
import { useState } from 'react'
import '../styles/ProductCard.css'

const ProductCard = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async () => {
    if (quantity <= 0 || quantity > product.stock_quantity) return

    setIsAdding(true)

    // Simulate API call delay
    setTimeout(() => {
      onAddToCart(product, quantity)
      setIsAdding(false)
      setQuantity(1) // Reset quantity after adding
    }, 500)
  }

  const incrementQuantity = () => {
    if (quantity < product.stock_quantity) {
      setQuantity(prev => prev + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  const isOutOfStock = product.stock_quantity <= 0
  const isLowStock = product.stock_quantity <= 5

  return (
    <div className={`product-card ${isOutOfStock ? 'out-of-stock' : ''}`}>
      {/* Product Image */}
      <div className="product-image">
        <div className="product-placeholder">
          {product.category_name ? product.category_name.charAt(0).toUpperCase() : '📦'}
        </div>
        {isOutOfStock && <div className="out-of-stock-badge">Out of Stock</div>}
        {isLowStock && !isOutOfStock && <div className="low-stock-badge">Low Stock</div>}
      </div>

      {/* Product Info */}
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category_name || 'Uncategorized'}</p>
        <p className="product-description">
          {product.description || 'No description available'}
        </p>

        <div className="product-price">
          <span className="price">${product.price.toFixed(2)}</span>
          <span className="stock">Stock: {product.stock_quantity}</span>
        </div>
      </div>

      {/* Quantity Selector */}
      {!isOutOfStock && (
        <div className="quantity-selector">
          <button
            className="quantity-btn"
            onClick={decrementQuantity}
            disabled={quantity <= 1}
          >
            −
          </button>
          <input
            type="number"
            min="1"
            max={product.stock_quantity}
            value={quantity}
            onChange={(e) => {
              const value = parseInt(e.target.value)
              if (value >= 1 && value <= product.stock_quantity) {
                setQuantity(value)
              }
            }}
            className="quantity-input"
          />
          <button
            className="quantity-btn"
            onClick={incrementQuantity}
            disabled={quantity >= product.stock_quantity}
          >
            +
          </button>
        </div>
      )}

      {/* Add to Cart Button */}
      <button
        className={`add-to-cart-btn ${isAdding ? 'adding' : ''}`}
        onClick={handleAddToCart}
        disabled={isOutOfStock || isAdding}
      >
        {isAdding ? (
          <>
            <div className="loading-spinner-small"></div>
            Adding...
          </>
        ) : isOutOfStock ? (
          'Out of Stock'
        ) : (
          <>
            🛒 Add to Cart
          </>
        )}
      </button>

      {/* Stock Warning */}
      {isLowStock && !isOutOfStock && (
        <div className="stock-warning">
          ⚠️ Only {product.stock_quantity} left in stock!
        </div>
      )}
    </div>
  )
}

export default ProductCard