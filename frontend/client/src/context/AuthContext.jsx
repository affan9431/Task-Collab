import { createContext, useContext, useMemo, useState } from 'react';
import client from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('authUser');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));

  const login = async (payload) => {
    const { data } = await client.post('/api/auth/login', payload);
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('authUser', JSON.stringify(data.user));
    localStorage.setItem('authToken', data.token);
  };

  const register = async (payload) => {
    const { data } = await client.post('/api/auth/register', payload);
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('authUser', JSON.stringify(data.user));
    localStorage.setItem('authToken', data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
  };

  const value = useMemo(
    () => ({ user, token, login, register, logout, isAuthenticated: !!token }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
