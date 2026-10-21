import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Verify token and fetch fresh user profile on initial load
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data?.success) {
            setUser(res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session expired or invalid token:', err.response?.data?.message || err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Periodic heartbeat to maintain live online status (every 25 seconds)
  useEffect(() => {
    if (!token || !user) return;

    // Send immediate heartbeat on session start
    api.post('/chat/heartbeat').catch(() => {});

    const interval = setInterval(() => {
      api.post('/chat/heartbeat').catch(() => {});
    }, 25000);

    return () => clearInterval(interval);
  }, [token, user?.id]);

  // Login handler
  const login = async (identifier, password) => {
    try {
      const res = await api.post('/auth/login', {
        loginId: identifier,
        email: identifier,
        password,
      });
      if (res.data?.success) {
        const { token: newToken, user: userData } = res.data;
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true, user: userData };
      }
      return { success: false, message: res.data?.message || 'Login failed' };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Server connection failed';
      return { success: false, message };
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      if (token) {
        await api.post('/auth/logout');
      }
    } catch (err) {
      // Ignore network errors on logout
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  // Change password handler (for any authenticated role)
  const changePassword = async (currentPassword, newPassword, confirmPassword) => {
    try {
      const res = await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      return { success: true, message: res.data?.message || 'Password updated successfully!' };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update password.';
      return { success: false, message };
    }
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data?.success) {
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        return res.data.user;
      }
    } catch (err) {
      console.warn('Failed to refresh user:', err.message);
    }
    return null;
  };

  const updateUser = (newUserData) => {
    if (!newUserData) return;
    setUser((prev) => {
      const updated = { ...prev, ...newUserData };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  // Request password reset OTP
  const forgotPassword = async (identifier) => {
    try {
      const res = await api.post('/auth/forgot-password', {
        identifier,
        email: identifier,
      });
      return { success: true, data: res.data };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to send OTP.';
      return { success: false, message };
    }
  };

  // Verify OTP
  const verifyResetOtp = async (email, otp) => {
    try {
      const res = await api.post('/auth/verify-reset-otp', { email, otp });
      return { success: true, message: res.data?.message || 'OTP verified!' };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Invalid or expired OTP.';
      return { success: false, message };
    }
  };

  // Reset Password with OTP
  const resetPasswordWithOtp = async (email, otp, newPassword) => {
    try {
      const res = await api.post('/auth/reset-password-with-otp', {
        email,
        otp,
        newPassword,
      });
      return { success: true, message: res.data?.message || 'Password reset successfully!' };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to reset password.';
      return { success: false, message };
    }
  };

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'MANAGER';
  const isHR = user?.role === 'HR';
  const isAdminOrHR = isAdmin || isHR;
  const isEmployee = user?.role === 'EMPLOYEE';
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        isHR,
        isAdminOrHR,
        isEmployee,
        login,
        logout,
        changePassword,
        forgotPassword,
        verifyResetOtp,
        resetPasswordWithOtp,
        refreshUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
