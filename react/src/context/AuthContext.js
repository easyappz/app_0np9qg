import React, { createContext, useState, useEffect, useContext } from 'react';
import { instance } from '../api/axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is moderator
  const isModerator = user?.is_staff || user?.is_superuser || false;

  // Load user data on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          await loadUserData();
        } catch (error) {
          console.error('Failed to load user data:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Update localStorage when tokens change
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('token', accessToken);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    } else {
      localStorage.removeItem('refreshToken');
    }
  }, [refreshToken]);

  // Load user data
  const loadUserData = async () => {
    try {
      const response = await instance.get('/api/auth/me/');
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error loading user data:', error);
      throw error;
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const response = await instance.post('/api/auth/login/', {
        email,
        password,
      });

      const { access, refresh, user: userData } = response.data;

      setAccessToken(access);
      setRefreshToken(refresh);
      setUser(userData);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Ошибка входа',
      };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await instance.post('/api/auth/register/', userData);

      const { access, refresh, user: newUser } = response.data;

      setAccessToken(access);
      setRefreshToken(refresh);
      setUser(newUser);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.response?.data || 'Ошибка регистрации',
      };
    }
  };

  // Logout function
  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('token');
  };

  // Refresh access token
  const refreshAccessToken = async () => {
    try {
      const response = await instance.post('/api/auth/refresh/', {
        refresh: refreshToken,
      });

      const { access } = response.data;
      setAccessToken(access);

      return access;
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
      throw error;
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const response = await instance.patch('/api/auth/me/', profileData);
      setUser(response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        error: error.response?.data || 'Ошибка обновления профиля',
      };
    }
  };

  const value = {
    user,
    accessToken,
    refreshToken,
    loading,
    isAuthenticated,
    isModerator,
    login,
    register,
    logout,
    refreshAccessToken,
    updateProfile,
    loadUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;