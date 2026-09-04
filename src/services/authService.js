import api from './api';

export const login = async (identity, password) => {
  const response = await api.post('/auth/login', { identity, password });
  return response.data;
};

export const register = async (nama, email, password) => {
  const response = await api.post('/auth/register', { nama, email, password });
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me', { _skipAuthRedirect: true });
  return response.data;
};

export const getGoogleRedirectUrl = async () => {
  const response = await api.get('/auth/google/redirect');
  return response.data;
};
