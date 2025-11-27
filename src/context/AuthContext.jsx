import React, { createContext, useContext, useState } from 'react';

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
        // persist tokens if returned
        if (data.accessToken) localStorage.setItem('accessToken', data.accessToken);
        if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
        setMessage(data.message || 'Registered successfully');
        // Optionally set user from response (controller returns payload in `data`)
        if (data.data) setUser(data.data);
        if (data.user) setUser(data.user);
        setLoading(false);
        return { ok: true, data };
      }
      // surface validation errors if present
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
        // persist tokens
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
        // clear stored tokens
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setMessage('Logged out successfully');
        setLoading(false);
        return { ok: true };
      }
      // if unauthorized, also clear local tokens to avoid stale state
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

  return (
    <AuthContext.Provider value={{ user, message, loading, register, login, logout, setMessage }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
