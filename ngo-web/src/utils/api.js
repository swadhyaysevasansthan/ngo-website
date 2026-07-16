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

// Response interceptor — pass errors through so every caller's
// try/catch and error.response?.data?.message receives the real error.
// Also handles 401 centrally: if the admin token is invalid/expired,
// clear it and send the user to login. Doing this here (not in every
// component's catch block) prevents the redirect loop that happens
// when a stale token is left in localStorage — PublicRoute sees it,
// bounces back to the dashboard, which fetches again, gets 401 again,
// forever.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';
    const isAdminEndpoint = url.includes('/admin/') || url.startsWith('admin/');
    if (
      error.response?.status === 401 &&
      isAdminEndpoint &&
      !window.location.pathname.startsWith('/admin/login')
    ) {
      localStorage.removeItem('token');
      localStorage.removeItem('adminUsername');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
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
  getEmailPreview: (templateType) =>
  apiClient.get(
    `/admin/email-preview?templateType=${templateType}`
  ),

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

// 🔥 SNEAC — School Access API
export const schoolAccessAPI = {
  submitRequest: (data) => apiClient.post('/school-access/request', data),

  // Admin
  listRequests: (params = {}) => apiClient.get('/school-access/admin/requests', { params }),
  getRequestById: (id) => apiClient.get(`/school-access/admin/requests/${id}`),
  approveRequest: (id) => apiClient.patch(`/school-access/admin/requests/${id}/approve`),
  rejectRequest: (id, rejectionReason) =>
    apiClient.patch(`/school-access/admin/requests/${id}/reject`, { rejectionReason }),
  resendLink: (id) => apiClient.post(`/school-access/admin/requests/${id}/resend-link`),
};

// 🔥 SNEAC — School Registration API
export const schoolRegistrationAPI = {
  validateToken: (token) =>
    apiClient.get('/school-registration/validate', {
      params: { token },
    }),

  submitPainting: (token, data) =>
    apiClient.post(
      `/school-registration/painting?token=${token}`,
      data
    ),

  submitQuiz: (token, data) =>
    apiClient.post(
      `/school-registration/quiz?token=${token}`,
      data
    ),

  // ─────────────────────────────
  // Admin
  // ─────────────────────────────

  listRegistrations: (competitionType) =>
    apiClient.get(
      `/school-registration/admin/${competitionType}`
    ),

  getRegistrationById: (id) =>
    apiClient.get(
      `/school-registration/admin/detail/${id}`
    ),

  allotPaintingDates: (id, data) =>
    apiClient.patch(
      `/school-registration/admin/${id}/allot-painting-dates`,
      data
    ),

  allotQuizDate: (id, allottedDate) =>
    apiClient.patch(
      `/school-registration/admin/${id}/allot-quiz-date`,
      { allottedDate }
    ),

  sendConfirmation: (id) =>
    apiClient.post(
      `/school-registration/admin/${id}/send-confirmation`
    ),
};

export const visitorAPI = {
  track: (visitorToken) =>
    apiClient.post('/visitors/track', {
      visitorToken
    }),

  getCount: () =>
    apiClient.get('/visitors/count')
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

// 🔥 COMMUNITIES API
export const communityAPI = {
  getAll: () => apiClient.get('/communities'),
  getBySlug: (slug) => apiClient.get(`/communities/${slug}`),
  adminGetAll: () => apiClient.get('/admin/communities'),
  adminGetById: (id) => apiClient.get(`/admin/communities/${id}`),
  adminCreate: (data) => apiClient.post('/admin/communities', data),
  adminUpdate: (id, data) => apiClient.put(`/admin/communities/${id}`, data),
  adminDelete: (id) => apiClient.delete(`/admin/communities/${id}`),
  uploadImages: (topicId, formData) => apiClient.post(`/admin/communities/${topicId}/images`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadHeroImage: (topicId, formData) => apiClient.post(`/admin/communities/${topicId}/hero-image`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteHeroImage: (topicId) => apiClient.delete(`/admin/communities/${topicId}/hero-image`),
  updateImage: (imageId, data) => apiClient.put(`/admin/communities/images/${imageId}`, data),
  deleteImage: (imageId) => apiClient.delete(`/admin/communities/images/${imageId}`),
  createEvent: (topicId, data) => apiClient.post(`/admin/communities/${topicId}/events`, data),
  updateEvent: (eventId, data) => apiClient.put(`/admin/communities/events/${eventId}`, data),
  deleteEvent: (eventId) => apiClient.delete(`/admin/communities/events/${eventId}`),
  createSection: (topicId, data) => apiClient.post(`/admin/communities/${topicId}/sections`, data),
  updateSection: (sectionId, data) => apiClient.put(`/admin/communities/sections/${sectionId}`, data),
  deleteSection: (sectionId) => apiClient.delete(`/admin/communities/sections/${sectionId}`),
  createStat: (topicId, data) => apiClient.post(`/admin/communities/${topicId}/stats`, data),
  updateStat: (statId, data) => apiClient.put(`/admin/communities/stats/${statId}`, data),
  deleteStat: (statId) => apiClient.delete(`/admin/communities/stats/${statId}`),
  // Albums
  createAlbum: (topicId, data) => apiClient.post(`/admin/communities/${topicId}/albums`, data),
  updateAlbum: (albumId, data) => apiClient.put(`/admin/communities/albums/${albumId}`, data),
  deleteAlbum: (albumId) => apiClient.delete(`/admin/communities/albums/${albumId}`),
};

export const farmerAPI = {
  getAll: () =>
    apiClient.get('/farmers'),

  getBySlug: (slug) =>
    apiClient.get(`/farmers/${slug}`),

  adminGetAll: () =>
    apiClient.get('/farmers/admin/all'),

  create: (data) =>
    apiClient.post('/farmers/admin', data),

  update: (id, data) =>
    apiClient.put(`/farmers/admin/${id}`, data),

  delete: (id) =>
    apiClient.delete(`/farmers/admin/${id}`),

  uploadProfileImage: (id, formData) =>
  apiClient.post(
    `/admin/farmers/${id}/profile-image`,
    formData,
    {
      headers: {
        'Content-Type':
          'multipart/form-data',
      },
    }
  ),

uploadCoverImage: (id, formData) =>
  apiClient.post(
    `/admin/farmers/${id}/cover-image`,
    formData,
    {
      headers: {
        'Content-Type':
          'multipart/form-data',
      },
    }
  ),

uploadGallery: (id, formData) =>
  apiClient.post(
    `/admin/farmers/${id}/gallery`,
    formData,
    {
      headers: {
        'Content-Type':
          'multipart/form-data',
      },
    }
  ),

  deleteProfileImage: (id) =>
    apiClient.delete(
      `/admin/farmers/${id}/profile-image`
    ),

  deleteCoverImage: (id) =>
    apiClient.delete(
      `/admin/farmers/${id}/cover-image`
    ),

  deleteGalleryImage: (
    id,
    imageUrl
  ) =>
    apiClient.delete(
      `/admin/farmers/${id}/gallery`,
      {
        data: {
          imageUrl,
        },
      }
    ),

  getCategories: () => apiClient.get('/farmers/categories/all'),

  createCategory: (data) => apiClient.post('/farmers/categories', data),

  updateCategory: (id, data) => apiClient.put(`/farmers/categories/${id}`, data),

  deleteCategory: (id) => apiClient.delete(`/farmers/categories/${id}`),
};


// 🔥 JUDGE MODULE — judge-facing auth + evaluation API
// Uses a separate localStorage key (judgeToken) so it never collides
// with the admin session, and a separate axios instance so judge
// requests never carry the admin Authorization header.
export const judgeApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

judgeApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('judgeToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const judgeAuthAPI = {
  login: (data) => judgeApiClient.post('/judge/login', data),
};

export const judgeAPI = {
  me: () => judgeApiClient.get('/judge/me'),
  getDashboard: () => judgeApiClient.get('/judge/dashboard'),
  getEntries: (params = {}) => judgeApiClient.get('/judge/entries', { params }),
  getNextPendingEntry: (round = 1) =>
    judgeApiClient.get('/judge/entries/next', { params: { round } }),
  getEntryDetail: (entryId, round = 1) =>
    judgeApiClient.get(`/judge/entries/${entryId}`, { params: { round } }),
  submitScore: (entryId, round, score) =>
    judgeApiClient.post(`/judge/entries/${entryId}/score`, { round, score }),
};

// 🔥 JUDGE MODULE — admin-facing evaluation management API (uses the
// existing admin apiClient/token, same as adminAPI above)
export const evaluationAdminAPI = {
  syncEntries: () => apiClient.post('/admin/evaluation/entries/sync'),
  getEntryPhoto: (entryId) => apiClient.get(`/admin/evaluation/entries/${entryId}/photo`),

  getJudges: () => apiClient.get('/admin/evaluation/judges'),
  createJudge: (fullName) => apiClient.post('/admin/evaluation/judges', { fullName }),
  updateJudge: (id, fullName) => apiClient.put(`/admin/evaluation/judges/${id}`, { fullName }),
  deleteJudge: (id) => apiClient.delete(`/admin/evaluation/judges/${id}`),
  toggleJudgeActive: (id, isActive) =>
    apiClient.patch(`/admin/evaluation/judges/${id}/active`, { isActive }),
  resetJudgePassword: (id) => apiClient.post(`/admin/evaluation/judges/${id}/reset-password`),

  getSettings: () => apiClient.get('/admin/evaluation/settings'),
  updateSettings: (data) => apiClient.put('/admin/evaluation/settings', data),

  getResults: () => apiClient.get('/admin/evaluation/results'),
  getConflicts: (level) =>
    apiClient.get('/admin/evaluation/conflicts', { params: level ? { level } : {} }),
  runQualification: () => apiClient.post('/admin/evaluation/qualify'),

  disqualifyEntry: (entryId) => apiClient.patch(`/admin/evaluation/entries/${entryId}/disqualify`),
  reinstateEntry: (entryId) => apiClient.patch(`/admin/evaluation/entries/${entryId}/reinstate`),

  getVerificationQueue: () => apiClient.get('/admin/evaluation/verification-queue'),
  updateVerificationStatus: (entryId, status) =>
    apiClient.patch(`/admin/evaluation/entries/${entryId}/verification`, { status }),

  getWinners: () => apiClient.get('/admin/evaluation/winners'),
  assignWinner: (entryId, prizeType) =>
    apiClient.post('/admin/evaluation/winners', { entryId, prizeType }),
  removeWinner: (id) => apiClient.delete(`/admin/evaluation/winners/${id}`),

  getAuditLog: (search) =>
    apiClient.get('/admin/evaluation/audit-log', { params: search ? { search } : {} }),

  resetEvaluationData: (payload) => apiClient.post('/admin/evaluation/reset', payload),

  exportResults: (format) => {
    return axios({
      url: `${API_BASE_URL}/admin/evaluation/export/${format}`,
      method: 'GET',
      responseType: 'blob',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  },
};

export default apiClient;