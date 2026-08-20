import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../utils/api.js'
import { useCart } from '../context/CartContext.jsx'

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  useEffect(() => {
    setLoading(true)
    api.getProduct(id)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner spinner-dark" />
      </div>
    )
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <h2>Product not found</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '16px' }}>
          Back to Products
        </Link>
      </div>
    )
  }

  const handleAddToCart = () => {
    addItem(product, quantity)
  }

  return (
    <div>
      <Link to="/" className="back-link">← Back to Products</Link>
      <div className="product-detail">
        <img className="product-detail-image" src={product.image_url} alt={product.name} />
        <div className="product-detail-info">
          <h1>{product.name}</h1>
          <div className="product-detail-price">${product.price.toFixed(2)}</div>
          <div className={`product-detail-stock ${product.stock < 10 ? 'stock-low' : ''}`}>
            {product.stock > 0
              ? product.stock < 10
                ? `Only ${product.stock} left in stock`
                : `In Stock (${product.stock} available)`
              : 'Out of Stock'}
          </div>
          <p className="product-detail-desc">{product.description}</p>

          {product.stock > 0 && (
            <>
              <div className="quantity-selector">
                <button
                  className="quantity-btn"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="quantity-value">{quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
              <button className="btn btn-primary btn-lg" onClick={handleAddToCart}>
                Add to Cart
              </button>
            </>
          )}

          {product.stock === 0 && (
            <button className="btn btn-secondary btn-lg" disabled>
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
