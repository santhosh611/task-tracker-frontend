
import axios from 'axios';

const api = axios.create({
  // baseURL: 'https://task-tracker-backend-2jqf.onrender.com/api',
  baseURL: process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5000/api'   // Local development
  : 'https://task-tracker-backend-aeaf.onrender.com/api',  // New Render URL
 
  withCredentials: true, // If you need cookies for CORS, otherwise can remove
});

// Request interceptor: adds token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Token being sent:', token); // Debug log
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.error('No token found for request');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handles 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized access');
      // Optionally clear localStorage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;
