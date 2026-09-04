import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as authLogin, register as authRegister, logout as authLogout, getMe, getGoogleRedirectUrl } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = user !== null;

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const data = await getMe();
          setUser(data.user);
        } catch (error) {
          localStorage.removeItem('auth_token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (identity, password) => {
    const data = await authLogin(identity, password);
    localStorage.setItem('auth_token', data.access_token);
    setUser(data.user);
    return data.user;
  };

  const register = async (nama, email, password) => {
    const data = await authRegister(nama, email, password);
    localStorage.setItem('auth_token', data.access_token);
    setUser(data.user);
    return data.user;
  };

  const loginWithGoogle = async () => {
    const data = await getGoogleRedirectUrl();
    window.location.href = data.redirect_url;
  };

  const handleAuthCallback = async (token) => {
    localStorage.setItem('auth_token', token);
    const data = await getMe();
    console.debug('Google callback /auth/me response', data);
    if (!data?.user) {
      throw new Error('User session is missing after Google login.');
    }
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    try {
      await authLogout();
    } catch (error) {
      console.warn('Backend token cleanup notice:', error);
    }
  };

  const hasRole = (roleName) => {
    return user?.role?.nama_role === roleName;
  };

  const refreshUser = async () => {
    try {
      const data = await getMe();
      if (data?.user) {
        setUser(data.user);
        return data.user;
      }
    } catch (error) {
      console.warn('Failed to refresh user:', error);
    }
    return null;
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated,
      login,
      register,
      loginWithGoogle,
      handleAuthCallback,
      logout,
      hasRole,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
