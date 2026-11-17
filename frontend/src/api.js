const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const TOKEN_KEY = 'shopease_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY));

async function request(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${BASE}/api${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });
  } catch {
    throw new Error('Cannot reach the server. If the backend is on Render free tier, give it ~30s to wake up and retry.');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || 'Request failed');
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  signup: (body) => request('/auth/signup', { method: 'POST', body }),
  login: (body) => request('/auth/login', { method: 'POST', body }),
  me: () => request('/auth/me'),

  products: (params = {}) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString();
    return request(`/products${qs ? `?${qs}` : ''}`);
  },
  categories: () => request('/products/categories'),
  product: (id) => request(`/products/${id}`),

  cart: () => request('/cart'),
  addToCart: (productId, qty = 1) => request('/cart', { method: 'POST', body: { productId, qty } }),
  setQty: (productId, qty) => request(`/cart/${productId}`, { method: 'PATCH', body: { qty } }),
  removeFromCart: (productId) => request(`/cart/${productId}`, { method: 'DELETE' }),

  placeOrder: (address) => request('/orders', { method: 'POST', body: { address } }),
  orders: () => request('/orders')
};

export const formatPrice = (n) => `₹${Number(n).toLocaleString('en-IN')}`;
