import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('coffeeguard_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('coffeeguard_token');
  });
  const [isLoading, setIsLoading] = useState(true);

  // Validate the token against the backend on mount
  useEffect(() => {
    const validateSession = async () => {
      const token = localStorage.getItem('coffeeguard_token');
      if (token) {
        try {
          // If this fails, the Axios interceptor will catch the 401 and handle logout/redirect naturally
          await api.get('/auth/me');
          setIsAuthenticated(true);
        } catch (error) {
          // Token is invalid/expired. Interceptor removes token, but we ensure local state reflects it here.
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };
    validateSession();
  }, []);

  const login = async (email, otp) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/verify-otp', { email, otp });
      const { access_token } = response.data;
      
      localStorage.setItem('coffeeguard_token', access_token);
      
      // Since we don't have a /me endpoint yet, we will just store the email as user info
      const userInfo = { email };
      localStorage.setItem('coffeeguard_user', JSON.stringify(userInfo));
      
      setUser(userInfo);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.detail || 'Invalid OTP. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const requestOtp = async (email) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/request-otp', { email });
      return { success: true, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.detail || 'Failed to request OTP.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('coffeeguard_token');
    localStorage.removeItem('coffeeguard_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, requestOtp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
