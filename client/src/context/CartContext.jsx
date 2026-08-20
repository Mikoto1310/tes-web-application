import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../utils/api.js'
import { useAuth } from './AuthContext.jsx'
import { useToast } from './ToastContext.jsx'

const CartContext = createContext(null)

const GUEST_CART_KEY = 'guest_cart'

function getGuestCart() {
  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || []
  } catch {
    return []
  }
}

function setGuestCart(items) {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items))
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const toast = useToast()

  useEffect(() => {
    if (user) {
      setLoading(true)
      api.getCart()
        .then(data => setItems(data.items || []))
        .catch(() => setItems([]))
        .finally(() => setLoading(false))
    } else {
      setItems(getGuestCart())
    }
  }, [user])

  useEffect(() => {
    if (user) return
    setGuestCart(items)
  }, [items, user])

  useEffect(() => {
    if (!user) return
    const guestItems = getGuestCart()
    if (guestItems.length > 0) {
      api.mergeCart(guestItems)
        .then(data => {
          setItems(data.items || [])
          localStorage.removeItem(GUEST_CART_KEY)
        })
        .catch(() => {})
    }
  }, [user])

  const addItem = async (product, quantity = 1) => {
    if (user) {
      const data = await api.addToCart(product.id, quantity)
      setItems(data.items)
    } else {
      setItems(prev => {
        const existing = prev.find(i => i.product_id === product.id)
        if (existing) {
          return prev.map(i =>
            i.product_id === product.id
              ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock || 99) }
              : i
          )
        }
        return [{ ...product, product_id: product.id, quantity }, ...prev]
      })
    }
    toast.success(`${product.name} added to cart`)
  }

  const updateQuantity = async (productId, quantity) => {
    if (user) {
      const data = await api.updateCartItem(productId, quantity)
      setItems(data.items)
    } else {
      if (quantity <= 0) {
        setItems(prev => prev.filter(i => i.product_id !== productId))
      } else {
        setItems(prev => prev.map(i =>
          i.product_id === productId ? { ...i, quantity } : i
        ))
      }
    }
  }

  const removeItem = async (productId) => {
    if (user) {
      const data = await api.removeCartItem(productId)
      setItems(data.items)
    } else {
      setItems(prev => prev.filter(i => i.product_id !== productId))
    }
    toast.info('Item removed from cart')
  }

  const clearCart = async () => {
    if (user) {
      await api.clearCart()
    }
    setItems([])
  }

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const total = items.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0)

  return (
    <CartContext.Provider value={{
      items, loading, itemCount, total: Math.round(total * 100) / 100,
      addItem, updateQuantity, removeItem, clearCart, setItems
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
