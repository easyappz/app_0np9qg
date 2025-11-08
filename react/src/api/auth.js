import instance from './axios';

export const login = async (username, password) => {
  const response = await instance.post('/api/auth/login/', {
    username,
    password
  });
  return response.data;
};

export const register = async (userData) => {
  const response = await instance.post('/api/auth/register/', userData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await instance.get('/api/auth/me/');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await instance.patch('/api/auth/profile/', profileData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const getProfile = async () => {
  const response = await instance.get('/api/auth/profile/');
  return response.data;
};