import axios from 'axios';

const getBaseURL = () => {
  const savedURL = localStorage.getItem('site_api_url');
  if (savedURL) return savedURL;
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
});

// Request interceptor to attach the JWT token
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

// Response interceptor to handle errors (e.g., auto-logout on 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login if unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
