import axios from 'axios';

const API_BASE_URL = `${
  process.env.REACT_APP_API_URL || 'http://localhost:5000'
}/api`;


// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
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
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    return Promise.reject({ message, ...error.response?.data });
  }
);

// API methods
export const participantAPI = {
  register: (data) => api.post('/participants/register', data),
  verify: (data) => api.post('/participants/verify', data),
  getById: (participantId) => api.get(`/participants/${participantId}`),
};

export const submissionAPI = {
  submit: (formData) => api.post('/submissions/submit', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getByParticipant: (participantId) => api.get(`/submissions/${participantId}`),
};

export const paymentAPI = {
  createOrder: (data) => api.post('/payments/create-order', data),
  verify: (payload) => api.post('/payments/verify', payload),
};


export const adminAPI = {
  login: (data) => api.post('/admin/login', data),
  getStats: () => api.get('/admin/stats'),
  getParticipants: () => api.get('/admin/participants'),
  updateSubmissionStatus: (participantId, hasSubmitted) =>
    api.patch(`/admin/participants/${participantId}/submission-status`, {
      hasSubmitted,
    }),
  getSubmissions: () => api.get('/admin/submissions'),
  sendBulkEmail: (data) => api.post('/admin/bulk-email', data),
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

export default api;
