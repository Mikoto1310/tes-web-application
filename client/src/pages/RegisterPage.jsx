import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function RegisterPage() {
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { register } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      await register(form.email, form.password, form.full_name)
      toast.success('Account created successfully!')
      navigate('/')
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <h1>Create Account</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input className="form-input" name="full_name" value={form.full_name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" name="password" value={form.password} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <input className="form-input" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <div className="auth-switch">
        Already have an account? <Link to="/login">Log In</Link>
      </div>
    </div>
  )
}
