import { instance } from './axios';

export const getAdminStats = async () => {
  const response = await instance.get('/api/admin/stats/');
  return response.data;
};

export const getAdminListings = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.status) {
    params.append('status', filters.status);
  }
  if (filters.search) {
    params.append('search', filters.search);
  }
  if (filters.ordering) {
    params.append('ordering', filters.ordering);
  }
  if (filters.page) {
    params.append('page', filters.page);
  }
  
  const response = await instance.get(`/api/admin/listings/?${params.toString()}`);
  return response.data;
};

export const moderateListing = async (id, status) => {
  const response = await instance.patch(`/api/admin/listings/${id}/moderate/`, {
    status
  });
  return response.data;
};

export const getAdminUsers = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.search) {
    params.append('search', filters.search);
  }
  if (filters.ordering) {
    params.append('ordering', filters.ordering);
  }
  if (filters.page) {
    params.append('page', filters.page);
  }
  
  const response = await instance.get(`/api/admin/users/?${params.toString()}`);
  return response.data;
};
