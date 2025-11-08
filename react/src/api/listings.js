import instance from './axios';

export const getListing = async (id) => {
  const response = await instance.get(`/api/listings/${id}/`);
  return response.data;
};

export const deleteListing = async (id) => {
  const response = await instance.delete(`/api/listings/${id}/delete/`);
  return response.data;
};

export const getListings = async (params) => {
  const response = await instance.get('/api/listings/', { params });
  return response.data;
};

export const createListing = async (data) => {
  const formData = new FormData();
  
  Object.keys(data).forEach(key => {
    if (key === 'images' && Array.isArray(data[key])) {
      data[key].forEach(image => {
        formData.append('images', image);
      });
    } else {
      formData.append(key, data[key]);
    }
  });
  
  const response = await instance.post('/api/listings/create/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateListing = async (id, data) => {
  const formData = new FormData();
  
  Object.keys(data).forEach(key => {
    if (key === 'images' && Array.isArray(data[key])) {
      data[key].forEach(image => {
        formData.append('images', image);
      });
    } else if (key === 'delete_image_ids' && Array.isArray(data[key])) {
      data[key].forEach(id => {
        formData.append('delete_image_ids', id);
      });
    } else {
      formData.append(key, data[key]);
    }
  });
  
  const response = await instance.patch(`/api/listings/${id}/update/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};