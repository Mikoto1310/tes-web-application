const API_BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    credentials: 'include',
    ...options,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  return data;
}

export const api = {
  // Auth
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getMe: () => request('/auth/me'),

  // Products
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/products?${query}`);
  },
  getProduct: (id) => request(`/products/${id}`),
  getCategories: () => request('/products/categories'),

  // Cart
  getCart: () => request('/cart'),
  addToCart: (product_id, quantity = 1) =>
    request('/cart', { method: 'POST', body: JSON.stringify({ product_id, quantity }) }),
  updateCartItem: (productId, quantity) =>
    request(`/cart/${productId}`, { method: 'PATCH', body: JSON.stringify({ quantity }) }),
  removeCartItem: (productId) =>
    request(`/cart/${productId}`, { method: 'DELETE' }),
  clearCart: () => request('/cart', { method: 'DELETE' }),
  mergeCart: (guestItems) =>
    request('/cart/merge', { method: 'POST', body: JSON.stringify({ guestItems }) }),

  // Orders
  getOrders: () => request('/orders'),
  getOrder: (id) => request(`/orders/${id}`),
  createOrder: (body) => request('/orders', { method: 'POST', body: JSON.stringify(body) }),
};
