import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, logoutUser, getCurrentUser } from '../services/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const userData = await getCurrentUser(token);
          setUser(userData);
        } catch (error) {
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const { token: newToken, user: userData } = await loginUser(email, password);
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      toast.success('Login successful!');
      navigate('/');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const { token: newToken, user: userData } = await registerUser(userData);
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      toast.success('Registration successful!');
      navigate('/');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
      return false;
    }
  };

  const logout = async () => {
    try {
      await logoutUser(token);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  // Add these functions to the AuthContext value

const updateProfile = async (profileData) => {
  try {
    const response = await updateProfile(profileData);
    setUser(prev => ({ ...prev, ...response.user }));
    toast.success('Profile updated successfully');
    return true;
  } catch (error) {
    toast.error(error.response?.data?.error || 'Failed to update profile');
    return false;
  }
};

const changePassword = async (currentPassword, newPassword) => {
  try {
    await changePassword(currentPassword, newPassword);
    toast.success('Password changed successfully');
    return true;
  } catch (error) {
    toast.error(error.response?.data?.error || 'Failed to change password');
    return false;
  }
};

// Add these to the context value
const value = {
  user,
  token,
  loading,
  login,
  register,
  logout,
  updateProfile,
  changePassword,
  isAuthenticated: !!token
};

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
