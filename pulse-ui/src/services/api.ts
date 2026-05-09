import axios from 'axios';

// Automatically use the live Render URL in production, but use localhost for local testing!
const IS_DEVELOPMENT = import.meta.env.MODE === 'development';
const LIVE_BACKEND_URL = 'https://pulse-net-s4f8.onrender.com';
const LOCAL_BACKEND_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: IS_DEVELOPMENT ? LOCAL_BACKEND_URL : LIVE_BACKEND_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;