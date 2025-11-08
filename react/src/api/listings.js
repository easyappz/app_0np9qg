import { instance } from './axios';

export const createListing = async (formData) => {
  const response = await instance.post('/api/listings/create/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateListing = async (id, formData) => {
  const response = await instance.patch(`/api/listings/${id}/update/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getListingById = async (id) => {
  const response = await instance.get(`/api/listings/${id}/`);
  return response.data;
};

export const getCategories = async () => {
  const response = await instance.get('/api/categories/');
  return response.data;
};
