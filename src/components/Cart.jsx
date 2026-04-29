// ===== CART COMPONENT =====
import { useState } from 'react'
import '../styles/Cart.css'

const Cart = ({ cart, onClose, onUpdateQuantity, onRemoveItem, totalPrice }) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleCheckout = () => {
    setIsCheckingOut(true)
    // Simulate checkout process
    setTimeout(() => {
      alert('🎉 Order placed successfully! Thank you for shopping with us.')
      // Clear cart and close
      cart.forEach(item => onRemoveItem(item.id))
      onClose()
      setIsCheckingOut(false)
    }, 2000)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  if (cart.length === 0) {
    return (
      <div className="cart-sidebar">
        <div className="cart-header">
          <h3>🛒 Your Cart</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="cart-empty">
          <div className="empty-cart-icon">🛒</div>
          <p>Your cart is empty</p>
          <p>Add some products to get started!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-sidebar">
      <div className="cart-header">
        <h3>🛒 Your Cart ({getTotalItems()} items)</h3>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="cart-items">
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <div className="item-info">
              <h4>{item.name}</h4>
              <p className="item-category">{item.category_name || 'Uncategorized'}</p>
              <p className="item-price">${item.price.toFixed(2)} each</p>
            </div>

            <div className="item-controls">
              <div className="quantity-controls">
                <button
                  className="qty-btn"
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  −
                </button>
                <span className="qty-display">{item.quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  disabled={item.quantity >= item.stock_quantity}
                >
                  +
                </button>
              </div>

              <div className="item-total">
                ${(item.price * item.quantity).toFixed(2)}
              </div>

              <button
                className="remove-btn"
                onClick={() => onRemoveItem(item.id)}
                title="Remove item"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <div className="cart-summary">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <button
          className={`checkout-btn ${isCheckingOut ? 'checking-out' : ''}`}
          onClick={handleCheckout}
          disabled={isCheckingOut}
        >
          {isCheckingOut ? (
            <>
              <div className="loading-spinner-small"></div>
              Processing...
            </>
          ) : (
            <>
              💳 Checkout (${totalPrice.toFixed(2)})
            </>
          )}
        </button>

        <div className="cart-notice">
          <p>🚚 Free shipping on all orders</p>
          <p>🔒 Secure checkout</p>
        </div>
      </div>
    </div>
  )
}

export default Cart