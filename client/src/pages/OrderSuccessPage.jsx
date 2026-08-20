import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../utils/api.js'

export default function OrderSuccessPage() {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getOrder(orderId)
      .then(data => setOrder(data.order))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false))
  }, [orderId])

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner spinner-dark" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="order-success">
        <h2>Order not found</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '16px' }}>
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="order-success">
      <div className="order-success-icon">✓</div>
      <h1>Order Successful!</h1>
      <p className="order-id">Order #{order.id}</p>
      <p className="order-total">${order.total_price.toFixed(2)}</p>
      <p style={{ color: 'var(--gray-500)', marginBottom: '24px' }}>
        Estimated delivery: 3-5 business days
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-primary">Continue Shopping</Link>
        <Link to="/orders" className="btn btn-secondary">View My Orders</Link>
      </div>
    </div>
  )
}
