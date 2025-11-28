import React, { createContext, useContext, useState, useEffect } from 'react';

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || 'http://localhost:8000';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const register = async (payload) => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${API_BASE}/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        if (data.accessToken) localStorage.setItem('accessToken', data.accessToken);
        if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
        setMessage(data.message || 'Registered successfully');
        if (data.data) setUser(data.data);
        if (data.user) setUser(data.user);
        setLoading(false);
        return { ok: true, data };
      }
      if (data && data.errors && Array.isArray(data.errors)) {
        setMessage(data.errors.join(', '));
      } else {
        setMessage(data.message || 'Registration failed');
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
      const res = await fetch(`${API_BASE}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        if (data.accessToken) localStorage.setItem('accessToken', data.accessToken);
        if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
        setUser(data.user || data.data || { email: payload.email || payload.username });
        setMessage(data.message || 'Logged in successfully');
        setLoading(false);
        return { ok: true, data };
      }
      setMessage(data.message || 'Login failed');
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

      const res = await fetch(`${API_BASE}/user/logout`, {
        method: 'POST',
        credentials: 'include',
        headers
      });
      if (res.ok) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setMessage('Logged out successfully');
        setLoading(false);
        return { ok: true };
      }
      if (res.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
      }
      setMessage('Logout failed');
      setLoading(false);
      return { ok: false };
    } catch (err) {
      setMessage('Logout error');
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

      const res = await fetch(`${API_BASE}/user/update`, {
        method: 'PATCH',
        credentials: 'include',
        headers,
        body: JSON.stringify(updates)
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        if (data.data) setUser(data.data);
        setMessage(data.message || 'Profile updated');
        setLoading(false);
        return { ok: true, data };
      }
      setMessage(data.message || 'Update failed');
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
        const res = await fetch(`${API_BASE}/user/me`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${accessToken}` },
          credentials: 'include'
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data && data.data) {
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
