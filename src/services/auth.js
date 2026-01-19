import api from './api';

export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response;
};

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response;
};

export const logoutUser = async () => {
  const response = await api.post('/auth/logout');
  return response;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.user;
};

export const updateProfile = async (profileData) => {
  const response = await api.patch('/users/profile', profileData);
  return response;
};

export const changePassword = async (passwordData) => {
  const response = await api.post('/users/change-password', passwordData);
  return response;
};
