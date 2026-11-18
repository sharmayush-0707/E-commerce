import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const { token } = JSON.parse(userInfo);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.error('Error parsing token from storage', e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

export const productAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  getFilters: () => api.get('/products/filters'),
  createReview: (id, review) => api.post(`/products/${id}/reviews`, review)
};

export const orderAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getOrderById: (id) => api.get(`/orders/${id}`),
  getMyOrders: () => api.get('/orders/myorders'),
  payOrder: (id, paymentResult) => api.put(`/orders/${id}/pay`, paymentResult)
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getProducts: () => api.get('/admin/products'),
  createProduct: (data) => api.post('/admin/products', data),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  getOrders: () => api.get('/admin/orders'),
  updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status }),
  getUsers: () => api.get('/admin/users'),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role })
};

export const aiAPI = {
  getPersonalized: (params) => api.get('/recommendations/personalized', { params }),
  getBundle: (productId) => api.get(`/recommendations/bundle/${productId}`),
  searchAssistant: (query) => api.get('/recommendations/search-assistant', { params: { q: query } })
};

export const paymentAPI = {
  createPaymentIntent: (data) => api.post('/payment/create-payment-intent', data),
  getStripeConfig: () => api.get('/payment/config')
};

export default api;
