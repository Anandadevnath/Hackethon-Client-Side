import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);
// ... rest of the file will need updates to use authService

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const register = async (payload) => {
    setLoading(true);
    setMessage('');
    try {
      const { ok, data } = await authService.register(payload);
      if (ok) {
        setMessage(data?.message || 'Registered successfully');
        setLoading(false);
        return { ok: true, data };
      }
      if (data && data.errors && Array.isArray(data.errors)) {
        setMessage(data.errors.join(', '));
      } else if (data && data.message) {
        setMessage(data.message);
      } else {
        setMessage('Registration failed');
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
      const { ok, data } = await authService.login(payload);
      if (ok) {
        if (data?.accessToken) localStorage.setItem('accessToken', data.accessToken);
        if (data?.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
        const userData = data?.user || data?.data || { email: payload.email || payload.username };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setMessage(data?.message || 'Logged in successfully');
        setLoading(false);
        return { ok: true, data };
      }
      if (data && data.message) {
        setMessage(data.message);
      } else {
        setMessage('Login failed');
      }
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

      const { ok, status } = await authService.logout(accessToken);
      if (ok) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('selectedUpazila');
        localStorage.removeItem('user');
        setUser(null);
        setMessage('Logged out successfully');
        setLoading(false);
        return { ok: true };
      }
      if (status === 401 || status === 0 || !ok) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('selectedUpazila');
        localStorage.removeItem('user');
        setUser(null);
        setMessage(status === 401 ? 'Logged out (token invalid)' : 'Logged out locally');
        setLoading(false);
        return { ok: false };
      }
      setMessage('Logout failed');
      setLoading(false);
      return { ok: false };
    } catch (err) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('selectedUpazila');
      localStorage.removeItem('user');
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

      const { ok, data } = await authService.updateProfile(updates, accessToken);
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
      // 1. Try to restore from localStorage first
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse stored user", e);
        }
      }

      // 2. Then verify/refresh from server
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
          setUser(null);
          return;
      }
      try {
        const { ok, data } = await api.get('/user/me', { headers: { Authorization: `Bearer ${accessToken}` } });
        if (ok && data) {
          const userData = data.data || data; // Handle both cases for API response structure
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData)); // Sync with server
        } else {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          setUser(null);
        }
      } catch (err) {
        console.error("Failed to verify user", err);
        // Do not clear storage immediately on network error, keep current state (if parsed from local)
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
