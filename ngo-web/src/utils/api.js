import axios from 'axios';

const API_BASE_URL = `${
  process.env.REACT_APP_API_URL || 'http://localhost:5000'
}/api`;

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        return Promise.reject(error);
      }
    );
  }
);

// 🔥 EXISTING APIs (your original code)
export const participantAPI = {
  register: (data) => apiClient.post('/participants/register', data),
  verify: (data) => apiClient.post('/participants/verify', data),
  getById: (participantId) => apiClient.get(`/participants/${participantId}`),
};

export const submissionAPI = {
  submit: (formData) => apiClient.post('/submissions/submit', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getByParticipant: (participantId) => apiClient.get(`/submissions/${participantId}`),
};

export const paymentAPI = {
  createOrder: (data) => apiClient.post('/payments/create-order', data),
  verify: (payload) => apiClient.post('/payments/verify', payload),
};

export const adminAPI = {
  login: (data) => apiClient.post('/admin/login', data),
  getStats: () => apiClient.get('/admin/stats'),
  getParticipants: () => apiClient.get('/admin/participants'),
  updateSubmissionStatus: (participantId, hasSubmitted) =>
    apiClient.patch(`/admin/participants/${participantId}/submission-status`, {
      hasSubmitted,
    }),
  getSubmissions: () => apiClient.get('/admin/submissions'),
  sendBulkEmail: (data) => apiClient.post('/admin/bulk-email', data),

  getAdminReviews: (status = 'pending') =>
    apiClient.get(`/admin/reviews?status=${status}`),
  approveReview: (id) => apiClient.put(`/admin/reviews/${id}/approve`),
  rejectReview: (id) => apiClient.put(`/admin/reviews/${id}/reject`),
  refineReview: (id, text) =>
    apiClient.put(`/admin/reviews/${id}/refine`, { refined_review_text: text }),
  featureReview: (id, featured) =>
    apiClient.put(`/admin/reviews/${id}/feature`, { is_featured: featured }),
  pinReview: (id, pinned) =>
    apiClient.put(`/admin/reviews/${id}/pin`, { is_pinned: pinned }),
  deleteReview: (id) => apiClient.delete(`/admin/reviews/${id}`),
};

export const downloadAPI = {
  allSubmissions: () => {
    return axios({
      url: `${API_BASE_URL}/download/all`,
      method: 'GET',
      responseType: 'blob',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  },
  byCategory: (category) => {
    return axios({
      url: `${API_BASE_URL}/download/category/${category}`,
      method: 'GET',
      responseType: 'blob',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  },
};

// 🔥 NEW REVIEW API
export const reviewAPI = {
  submitReview: (data) => apiClient.post('/reviews', data),
  getPublicReviews: ({ limit = 5, page = 1 } = {}) =>
    apiClient.get('/reviews', { params: { limit, page } }),
  getAdminReviews: (status = 'pending') =>
    apiClient.get(`/admin/reviews?status=${status}`),
  approveReview: (id) => apiClient.put(`/admin/reviews/${id}/approve`),
  rejectReview: (id) => apiClient.put(`/admin/reviews/${id}/reject`),
  refineReview: (id, text) =>
    apiClient.put(`/admin/reviews/${id}/refine`, { refined_review_text: text }),
  featureReview: (id, featured) =>
    apiClient.put(`/admin/reviews/${id}/feature`, { is_featured: featured }),
  pinReview: (id, pinned) =>
    apiClient.put(`/admin/reviews/${id}/pin`, { is_pinned: pinned }),
  deleteReview: (id) => apiClient.delete(`/admin/reviews/${id}`),
  getReviewVersions: (id) => apiClient.get(`/admin/reviews/${id}/versions`),
};

// 🔥 INDIVIDUAL EXPORTS for direct imports
export const {
  submitReview,
  getPublicReviews,
  getAdminReviews,
  approveReview,
  rejectReview,
  refineReview,
  featureReview,
  pinReview,
  deleteReview,
  getReviewVersions
} = reviewAPI;

export default apiClient;