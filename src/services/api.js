// Centralized API Client for AgriConnect

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('agriconnect_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const error = new Error(data.message || `Request failed with status ${res.status}`);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    // If network error (backend server not started yet), let caller handle fallback gracefully
    throw error;
  }
}

export const api = {
  // AUTH
  auth: {
    login: (email, password, requestedRole) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, requestedRole }),
      }),

    register: (userData) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),

    getMe: () => request('/auth/me'),
  },

  // ADMIN
  admin: {
    login: (email, password) =>
      request('/admin/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    getStats: () => request('/admin/stats'),

    getUsers: () => request('/admin/users'),

    toggleFarmerVerification: (farmerId) =>
      request(`/admin/farmers/${farmerId}/verify`, {
        method: 'PUT',
      }),

    deleteFarmer: (farmerId) =>
      request(`/admin/farmers/${farmerId}`, {
        method: 'DELETE',
      }),

    getSettings: () => request('/admin/settings'),

    updateSettings: (settings) =>
      request('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      }),
  },

  // PRODUCTS
  products: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/products${query ? `?${query}` : ''}`);
    },

    getById: (id) => request(`/products/${id}`),

    create: (productData) =>
      request('/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      }),

    update: (id, updates) =>
      request(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      }),

    delete: (id) =>
      request(`/products/${id}`, {
        method: 'DELETE',
      }),
  },

  // ORDERS
  orders: {
    getAll: () => request('/orders'),

    create: (orderData) =>
      request('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      }),

    updateStatus: (id, status) =>
      request(`/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }),
  },

  // FARMERS
  farmers: {
    getAll: () => request('/farmers'),
  },

  // CONTACT
  contact: {
    submit: (formData) =>
      request('/contact', {
        method: 'POST',
        body: JSON.stringify(formData),
      }),

    getAll: () => request('/contact'),

    updateStatus: (id, status) =>
      request(`/contact/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),

    delete: (id) =>
      request(`/contact/${id}`, {
        method: 'DELETE',
      }),
  },
};

export default api;

