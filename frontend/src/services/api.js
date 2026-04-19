import axios from 'axios';

const api = axios.create({ baseURL: '/auth' });

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const sendOtp   = (email)      => api.post('/send-otp',  { email });
export const verifyOtp = (email, otp) => api.post('/verify-otp', { email, otp });
export const getMe     = ()           => api.get('/me');

export default api;
