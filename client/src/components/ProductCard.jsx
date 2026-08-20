import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

export default function ProductCard({ product }) {
  const navigate = useNavigate()
  const { addItem } = useCart()

  const handleAddToCart = (e) => {
    e.stopPropagation()
    addItem(product, 1)
  }

  return (
    <div className="product-card" onClick={() => navigate(`/products/${product.id}`)}>
      <img
        className="product-card-image"
        src={product.image_url}
        alt={product.name}
        loading="lazy"
      />
      <div className="product-card-body">
        <div className="product-card-name">{product.name}</div>
        <div className="product-card-price">${product.price.toFixed(2)}</div>
        <div className={`product-card-stock ${product.stock < 10 ? 'stock-low' : ''}`}>
          {product.stock < 10 ? `Only ${product.stock} left` : 'In Stock'}
        </div>
        <button className="btn btn-primary btn-sm btn-block" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  )
}
