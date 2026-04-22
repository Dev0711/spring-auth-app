import axios from 'axios';

const api = axios.create({
  baseURL: '/auth',
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Auth endpoints ──────────────────────────────

export const sendOtp = (email) =>
  api.post('/send-otp', { email });

export const verifyOtp = (email, otp) =>
  api.post('/verify-otp', { email, otp });

// Accepts an optional token override (used right after OAuth2 callback
// before the token is stored in sessionStorage)
export const getMe = (tokenOverride) =>
  api.get('/me', {
    headers: tokenOverride
      ? { Authorization: `Bearer ${tokenOverride}` }
      : undefined,
  });

export default api;
