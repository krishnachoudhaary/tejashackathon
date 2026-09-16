import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('eventhub_token');
      if (token) {
        const res = await api.getMe();
        if (res.success && res.data && res.data.user) {
          setUser(res.data.user);
        } else {
          localStorage.removeItem('eventhub_token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (emailOrCredentials, maybePassword) => {
    let payload;
    if (typeof emailOrCredentials === 'string') {
      payload = { email: emailOrCredentials, password: maybePassword };
    } else {
      payload = emailOrCredentials;
    }

    const res = await api.login(payload);
    if (res.success && res.data) {
      localStorage.setItem('eventhub_token', res.data.token);
      setUser(res.data.user);
      return { success: true, user: res.data.user };
    }
    return { success: false, message: res.message || 'Login failed' };
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    if (res.success && res.data) {
      localStorage.setItem('eventhub_token', res.data.token);
      setUser(res.data.user);
      return { success: true, user: res.data.user };
    }
    return { success: false, message: res.message || 'Registration failed' };
  };

  const logout = () => {
    localStorage.removeItem('eventhub_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
