import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const register = async (payload) => {
    setLoading(true);
    setMessage('');
    try {
      const { ok, data } = await api.post('/user/register', payload, { headers: { 'Content-Type': 'application/json' } });
      if (ok) {
        // Do not auto-login after registration. Redirect user to login page instead.
        // Some backends return tokens on register; we intentionally ignore them here
        // so the user must explicitly login.
        setMessage(data?.message || 'Registered successfully');
        setLoading(false);
        return { ok: true, data };
      }
      if (data && data.errors && Array.isArray(data.errors)) {
        setMessage(data.errors.join(', '));
      } else {
        setMessage(data?.message || 'Registration failed');
      }
      setLoading(false);
      return { ok: false, data };
    } catch (err) {
      setMessage('Registration error');
      setLoading(false);
      return { ok: false, error: err };
    }
  };

  const login = async (payload) => {
    setLoading(true);
    setMessage('');
    try {
      const { ok, data } = await api.post('/user/login', payload, { headers: { 'Content-Type': 'application/json' } });
      if (ok) {
        if (data?.accessToken) localStorage.setItem('accessToken', data.accessToken);
        if (data?.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
        setUser(data?.user || data?.data || { email: payload.email || payload.username });
        setMessage(data?.message || 'Logged in successfully');
        setLoading(false);
        return { ok: true, data };
      }
      setMessage(data?.message || 'Login failed');
      setLoading(false);
      return { ok: false, data };
    } catch (err) {
      setMessage('Login error');
      setLoading(false);
      return { ok: false, error: err };
    }
  };

  const logout = async () => {
    setLoading(true);
    setMessage('');
    try {
      const accessToken = localStorage.getItem('accessToken');
      const headers = {};
      if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

      const { ok, status } = await api.post('/user/logout', null, { headers });
      if (ok) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('selectedUpazila');
        setUser(null);
        setMessage('Logged out successfully');
        setLoading(false);
        return { ok: true };
      }
      // If server responded with 401, or any non-ok, clear local session anyway
      // This ensures the user is logged out locally even if remote logout failed
      if (status === 401 || status === 0 || !ok) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('selectedUpazila');
        setUser(null);
        setMessage(status === 401 ? 'Logged out (token invalid)' : 'Logged out locally');
        setLoading(false);
        return { ok: false };
      }
      setMessage('Logout failed');
      setLoading(false);
      return { ok: false };
    } catch (err) {
      // Network/CORS error — clear local session so UI reflects logged out state
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('selectedUpazila');
      setUser(null);
      setMessage('Logged out locally (network error)');
      setLoading(false);
      return { ok: false, error: err };
    }
  };

  const updateProfile = async (updates) => {
    setLoading(true);
    setMessage('');
    try {
      const accessToken = localStorage.getItem('accessToken');
      const headers = { 'Content-Type': 'application/json' };
      if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

      const { ok, data } = await api.patch('/user/update', updates, { headers });
      if (ok) {
        if (data?.data) setUser(data.data);
        setMessage(data?.message || 'Profile updated');
        setLoading(false);
        return { ok: true, data };
      }
      setMessage(data?.message || 'Update failed');
      setLoading(false);
      return { ok: false, data };
    } catch (err) {
      setMessage('Update error');
      setLoading(false);
      return { ok: false, error: err };
    }
  };

  useEffect(() => {
    const tryRestore = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return;
      try {
        const { ok, data } = await api.get('/user/me', { headers: { Authorization: `Bearer ${accessToken}` } });
        if (ok && data && data.data) {
          setUser(data.data);
        } else {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      } catch (err) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    };
    tryRestore();
  }, []);

  return (
    <AuthContext.Provider value={{ user, message, loading, register, login, logout, updateProfile, setMessage }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
