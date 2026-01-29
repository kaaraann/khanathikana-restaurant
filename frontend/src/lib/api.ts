import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  login: (data: any) => api.post('/auth/login', data),
};

export const tableAPI = {
  getAll: () => api.get('/tables'),
  getById: (id: number) => api.get(`/tables/${id}`),
  getBySection: (section: string) => api.get(`/tables/section/${section}`),
  create: (data: any) => api.post('/tables', data),
  updateStatus: (id: number, status: string) => api.put(`/tables/${id}/status`, { status }),
  delete: (id: number) => api.delete(`/tables/${id}`),
};

export const menuAPI = {
  getCategories: () => api.get('/categories'),
  createCategory: (data: any) => api.post('/categories', data),
  deleteCategory: (id: number) => api.delete(`/categories/${id}`),
  getItemsByCategory: (categoryId: number) => api.get(`/menu/items/category/${categoryId}`),
  getFavorites: () => api.get('/menu/items/favorites'),
  getItemById: (id: number) => api.get(`/menu/items/${id}`),
  updateItem: (id: number, data: any) => api.put(`/menu-items/${id}`, data),
  createItem: (data: any) => api.post('/menu-items', data),
  deleteItem: (id: number) => api.delete(`/menu-items/${id}`),
};

export const orderAPI = {
  create: (data: any) => api.post('/orders', data),
  getByTable: (tableId: number) => api.get(`/orders/table/${tableId}`),
  getById: (id: number) => api.get(`/orders/${id}`),
  updateStatus: (id: number, status: string) => api.put(`/orders/${id}/status`, { status }),
  getAll: () => api.get('/orders'),
  getStats: () => api.get('/orders/stats'),
};

export const customerAPI = {
  getAll: () => api.get('/customers'),
  getById: (id: number) => api.get(`/customers/${id}`),
  create: (data: any) => api.post('/customers', data),
  update: (id: number, data: any) => api.put(`/customers/${id}`, data),
  getStats: () => api.get('/customers/stats'),
};

export const kitchenAPI = {
  getActiveOrders: () => api.get('/kitchen/orders'),
  updateOrderStatus: (id: number, status: string) => api.put(`/kitchen/orders/${id}/status`, { status }),
};

export const reportAPI = {
  getSalesReport: (params: any) => api.get('/reports/sales', { params }),
  getInventoryReport: () => api.get('/reports/inventory'),
  getStaffReport: () => api.get('/reports/staff'),
  getCustomerReport: () => api.get('/reports/customers'),
  getDashboardStats: () => api.get('/reports/dashboard'),
};
