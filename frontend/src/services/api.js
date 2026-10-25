import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach JWT token from localStorage to outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token invalid or expired
      if (localStorage.getItem('token')) {
        console.warn('Session expired. Logging out.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  uploadAvatar: (formData) =>
    api.post('/auth/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// Listing Services
export const listingService = {
  getListings: (params) => api.get('/listings', { params }),
  getListingById: (id) => api.get(`/listings/${id}`),
  createListing: (data) => api.post('/listings', data),
  updateListing: (id, data) => api.put(`/listings/${id}`, data),
  deleteListing: (id) => api.delete(`/listings/${id}`),
  getMyListings: () => api.get('/listings/my/listings'),
  uploadPhotos: (formData) =>
    api.post('/listings/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// Roommate Seeker Services
export const userService = {
  getRoommates: (params) => api.get('/users/roommates', { params }),
  getUserProfile: (id) => api.get(`/users/${id}`),
};

// Roommate Match Request Services
export const matchService = {
  sendRequest: (data) => api.post('/matches', data),
  getReceivedRequests: () => api.get('/matches/received'),
  getSentRequests: () => api.get('/matches/sent'),
  updateStatus: (id, status) => api.put(`/matches/${id}/status`, { status }),
  getConnections: () => api.get('/matches/connections'),
};

// Chat Services
export const chatService = {
  getThreads: () => api.get('/chat/threads'),
  getMessages: (targetUserId) => api.get(`/chat/${targetUserId}`),
  sendMessage: (data) => api.post('/chat', data),
};

// Review Services
export const reviewService = {
  createReview: (data) => api.post('/reviews', data),
  getListingReviews: (listingId) => api.get(`/reviews/listing/${listingId}`),
  getUserReviews: (userId) => api.get(`/reviews/user/${userId}`),
};

// Safety & Report Services
export const reportService = {
  createReport: (data) => api.post('/reports', data),
  getAllReports: () => api.get('/reports'),
  updateReportStatus: (id, data) => api.put(`/reports/${id}`, data),
};

// Admin Services
export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getAllUsers: (params) => api.get('/admin/users', { params }),
  toggleUserBan: (id) => api.put(`/admin/users/${id}/ban`),
  toggleUserVerify: (id) => api.put(`/admin/users/${id}/verify`),
  deleteListing: (id) => api.delete(`/admin/listings/${id}`),
};

export default api;
