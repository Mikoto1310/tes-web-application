import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Toast from './components/Toast.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import CatalogPage from './pages/CatalogPage.jsx'
import ProductDetailPage from './pages/ProductDetailPage.jsx'
import CartPage from './pages/CartPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import OrderSuccessPage from './pages/OrderSuccessPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import OrderHistoryPage from './pages/OrderHistoryPage.jsx'

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <Toast />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/products" element={<CatalogPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          <Route path="/order-success/:orderId" element={
            <ProtectedRoute>
              <OrderSuccessPage />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <OrderHistoryPage />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  )
}
