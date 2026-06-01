import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = useCallback(async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    const { accessToken, refreshToken, user: u } = res.data;
    localStorage.setItem('accessToken',  accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(u));
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (data) => {
    const res = await api.post('/auth/register', data);
    const { accessToken, refreshToken, user: u } = res.data;
    localStorage.setItem('accessToken',  accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(u));
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    try { await api.post('/auth/logout'); } catch (_) {}
    localStorage.clear();
    setUser(null);
  }, []);

  const isAdmin     = user?.role === 'ADMIN';
  const isLibrarian = user?.role === 'LIBRARIAN' || isAdmin;

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, isLibrarian }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
