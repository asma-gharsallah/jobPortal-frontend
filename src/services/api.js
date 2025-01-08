import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
console.log('API_URL:', API_URL);

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
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

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const auth = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => {
    localStorage.removeItem('token');
    return Promise.resolve();
  }
};

// User Profile API
export const profile = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile', data),
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    return api.post('/profile/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  getResumes: () => api.get('/profile/resumes')
};

// Jobs API
export const jobs = {
  getAll: (params) => api.get('/jobs', { params }),
  get: (id) => api.get(`/jobs/${id}`),
  apply: (jobId, applicationData) => api.post(`/jobs/${jobId}/apply`, applicationData)
};

// Applications API
export const applications = {
  getAll: () => api.get('/applications'),
  get: (id) => api.get(`/applications/${id}`),
  withdraw: (id) => api.delete(`/applications/${id}`)
};

export default {
  auth,
  profile,
  jobs,
  applications
};