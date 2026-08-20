import { useCart } from '../context/CartContext.jsx'

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart()

  return (
    <div className="cart-item">
      <img className="cart-item-image" src={item.image_url} alt={item.name} />
      <div className="cart-item-info">
        <div className="cart-item-name">{item.name}</div>
        <div className="cart-item-price">${item.price.toFixed(2)}</div>
      </div>
      <div className="cart-item-controls">
        <div className="quantity-selector">
          <button
            className="quantity-btn"
            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
          >
            −
          </button>
          <span className="quantity-value">{item.quantity}</span>
          <button
            className="quantity-btn"
            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
            disabled={item.quantity >= item.stock}
          >
            +
          </button>
        </div>
        <strong>${(item.price * item.quantity).toFixed(2)}</strong>
        <button className="cart-item-remove" onClick={() => removeItem(item.product_id)}>
          ✕
        </button>
      </div>
    </div>
  )
}
