import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user_data');
    return saved ? JSON.parse(saved) : null;
  });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Global Toast state
  const [toast, setToast] = useState({ message: '', type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast({ message: '', type: 'info' });
  };

  // Fetch current user profile if logged in
  const loadProfile = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get('/accounts/profile/');
      setProfile(res.data);
    } catch (err) {
      console.error('Failed to load user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const login = async (username, password) => {
    try {
      const res = await api.post('/accounts/login/', { username, password });
      const { access, refresh, user: userData } = res.data;

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user_data', JSON.stringify(userData));

      setUser(userData);
      await loadProfile();
      showToast(`Welcome back, ${userData.first_name || userData.username}!`, 'success');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.detail || err.response?.data?.non_field_errors?.[0] || 'Invalid credentials. Please try again.';
      showToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  const register = async (formData) => {
    try {
      const res = await api.post('/accounts/register/', formData);
      showToast('Registration successful! You can now log in.', 'success');
      return { success: true, data: res.data };
    } catch (err) {
      const errData = err.response?.data;
      let msg = 'Registration failed. Please check your inputs.';
      if (errData) {
        if (typeof errData === 'string') msg = errData;
        else if (errData.password) msg = `Password error: ${errData.password[0]}`;
        else if (errData.email) msg = `Email error: ${errData.email[0]}`;
        else if (errData.username) msg = `Username error: ${errData.username[0]}`;
      }
      showToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    setUser(null);
    setProfile(null);
    showToast('Logged out successfully.', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        register,
        logout,
        loadProfile,
        toast,
        showToast,
        hideToast,
        isAuthenticated: !!user,
        role: user?.role || profile?.Role || 'Candidate',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
