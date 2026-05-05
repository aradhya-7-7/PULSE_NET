import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Your Spring Boot port
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // We will store the token here on login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;