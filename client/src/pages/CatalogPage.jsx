import { useState, useEffect } from 'react'
import { api } from '../utils/api.js'
import ProductCard from '../components/ProductCard.jsx'
import SkeletonCard from '../components/SkeletonLoader.jsx'

export default function CatalogPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = { page, limit: 12 }
    if (search) params.search = search
    if (category !== 'all') params.category = category

    api.getProducts(params)
      .then(data => {
        setProducts(data.products)
        setPagination(data.pagination)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search, category, page])

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const handleCategory = (e) => {
    setCategory(e.target.value)
    setPage(1)
  }

  return (
    <div>
      <div className="products-header">
        <h1>Products</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={handleSearch}
          />
          <select className="category-filter" value={category} onChange={handleCategory}>
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="product-grid">
        {loading
          ? Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
          : products.map(p => <ProductCard key={p.id} product={p} />)
        }
      </div>

      {!loading && products.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--gray-500)' }}>
          No products found.
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px' }}>
          <button
            className="btn btn-secondary btn-sm"
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
          >
            ← Previous
          </button>
          <span style={{ padding: '6px 14px', color: 'var(--gray-600)' }}>
            Page {page} of {pagination.totalPages}
          </span>
          <button
            className="btn btn-secondary btn-sm"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
