import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import CartItem from '../components/CartItem.jsx'

export default function CartPage() {
  const { items, total, itemCount, loading } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner spinner-dark" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty</h2>
        <p>Start shopping to add items to your cart.</p>
        <Link to="/" className="btn btn-primary">Browse Products</Link>
      </div>
    )
  }

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=/checkout')
    } else {
      navigate('/checkout')
    }
  }

  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>Shopping Cart ({itemCount} items)</h1>

      <div>
        {items.map(item => (
          <CartItem key={item.product_id} item={item} />
        ))}
      </div>

      <div className="cart-summary">
        <div className="cart-summary-row">
          <span>Subtotal ({itemCount} items)</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="cart-summary-row">
          <span>Shipping</span>
          <span>$5.99</span>
        </div>
        <div className="cart-summary-row cart-summary-total">
          <span>Total</span>
          <span>${(total + 5.99).toFixed(2)}</span>
        </div>

        <div className="cart-actions">
          <Link to="/" className="btn btn-secondary">Continue Shopping</Link>
          <button className="btn btn-primary" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  )
}
