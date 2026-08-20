import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../utils/api.js'

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getOrders()
      .then(data => setOrders(data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner spinner-dark" />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="cart-empty">
        <h2>No orders yet</h2>
        <p>Start shopping to place your first order.</p>
        <Link to="/" className="btn btn-primary">Browse Products</Link>
      </div>
    )
  }

  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>My Orders</h1>
      {orders.map(order => (
        <div key={order.id} className="order-history-item">
          <div className="order-history-header">
            <span className="order-history-id">Order #{order.id}</span>
            <span className="order-history-date">
              {new Date(order.created_at).toLocaleDateString()}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="order-history-status">{order.status}</span>
            <span className="order-history-total">${order.total_price.toFixed(2)}</span>
          </div>
          <div style={{ marginTop: '8px', fontSize: '0.85rem', color: 'var(--gray-500)' }}>
            {order.shipping_address}, {order.shipping_city} {order.shipping_zip}
          </div>
        </div>
      ))}
    </div>
  )
}
