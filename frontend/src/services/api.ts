import axios from 'axios';

// Axios instance with shared config
const api = axios.create({
  baseURL:  'http://localhost:3000/api',
  withCredentials: true, // CRITICAL: sends cookies with every request
});

// Response interceptor — handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login if session expired
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;