import api from './api';

export const authService = {
  register: (data) => api.post('/user/register', data),
  login: (data) => api.post('/user/login', data),
  logout: (token) => api.post('/user/logout', null, { headers: { Authorization: `Bearer ${token}` } }),
  getMe: (token) => api.get('/user/me', { headers: { Authorization: `Bearer ${token}` } }),
  updateProfile: (data, token) => api.patch('/user/update', data, { headers: { Authorization: `Bearer ${token}` } }),
};

export const cropService = {
  // Add crop related endpoints here
};

export const smartAlertService = {
  // Add alert related endpoints here
};
