import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          🛒 MiniStore
        </Link>

        <div className="navbar-links">
          <Link to="/" className="navbar-link">Products</Link>

          <Link to="/cart" className="navbar-link navbar-cart">
            🛍️ Cart
            {itemCount > 0 && (
              <span className="cart-badge" key={itemCount}>{itemCount}</span>
            )}
          </Link>

          {user ? (
            <div className="navbar-auth">
              <span className="navbar-user">Hi, {user.full_name.split(' ')[0]}</span>
              <Link to="/orders" className="navbar-link">Orders</Link>
              <button className="btn btn-sm btn-outline" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="btn btn-sm btn-outline">Login</Link>
              <Link to="/register" className="btn btn-sm btn-primary">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
