import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { api } from '../utils/api.js'
import { useToast } from '../context/ToastContext.jsx'

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const toast = useToast()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    shipping_name: '',
    shipping_address: '',
    shipping_city: '',
    shipping_zip: '',
    shipping_phone: '',
  })

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const shippingCost = 5.99
  const grandTotal = total + shippingCost

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const { shipping_name, shipping_address, shipping_city, shipping_zip, shipping_phone } = form
    if (!shipping_name || !shipping_address || !shipping_city || !shipping_zip || !shipping_phone) {
      setError('Please fill in all shipping fields.')
      return
    }

    setLoading(true)
    try {
      const data = await api.createOrder(form)
      clearCart()
      toast.success('Order placed successfully!')
      navigate(`/order-success/${data.orderId}`)
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <h2>No items to checkout</h2>
        <p>Add some products to your cart first.</p>
      </div>
    )
  }

  return (
    <div className="checkout-form">
      <h1>Checkout</h1>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="checkout-section">
          <h2>Shipping Details</h2>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" name="shipping_name" value={form.shipping_name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <input className="form-input" name="shipping_address" value={form.shipping_address} onChange={handleChange} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">City</label>
              <input className="form-input" name="shipping_city" value={form.shipping_city} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">ZIP Code</label>
              <input className="form-input" name="shipping_zip" value={form.shipping_zip} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input className="form-input" name="shipping_phone" value={form.shipping_phone} onChange={handleChange} required />
          </div>
        </div>

        <div className="checkout-section">
          <h2>Order Review</h2>
          {items.map(item => (
            <div key={item.product_id} className="order-review-item">
              <span>{item.name} × {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="order-review-item">
            <span>Shipping</span>
            <span>${shippingCost.toFixed(2)}</span>
          </div>
          <div className="order-review-total">
            <span>Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="checkout-section">
          <h2>Payment (Dummy)</h2>
          <div className="form-group">
            <label className="form-label">Card Number</label>
            <input className="form-input" placeholder="4242 4242 4242 4242" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Expiry</label>
              <input className="form-input" placeholder="12/28" />
            </div>
            <div className="form-group">
              <label className="form-label">CVV</label>
              <input className="form-input" placeholder="123" />
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-success btn-lg btn-block" disabled={loading}>
          {loading ? <><div className="spinner" /> Processing...</> : 'Place Order'}
        </button>
      </form>
    </div>
  )
}
