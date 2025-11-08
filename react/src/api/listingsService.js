import { instance } from './axios';

/**
 * Get paginated listings with filters and sorting
 * @param {number} page - Page number
 * @param {object} filters - Filter parameters {category, min_price, max_price, search}
 * @param {string} sort - Sort parameter (created_at, -created_at, price, -price)
 * @returns {Promise} API response with listings data
 */
export const getListings = async (page = 1, filters = {}, sort = '-created_at') => {
  const params = {
    page,
    ordering: sort,
  };

  if (filters.category) {
    params.category = filters.category;
  }

  if (filters.min_price) {
    params.min_price = filters.min_price;
  }

  if (filters.max_price) {
    params.max_price = filters.max_price;
  }

  if (filters.search) {
    params.search = filters.search;
  }

  const response = await instance.get('/api/listings/', { params });
  return response.data;
};

/**
 * Get all categories
 * @returns {Promise} API response with categories list
 */
export const getCategories = async () => {
  const response = await instance.get('/api/categories/');
  return response.data;
};

/**
 * Get single listing by ID
 * @param {number} id - Listing ID
 * @returns {Promise} API response with listing details
 */
export const getListingById = async (id) => {
  const response = await instance.get(`/api/listings/${id}/`);
  return response.data;
};

/**
 * Get current user's listings (all statuses)
 * @returns {Promise} API response with user's listings
 */
export const getMyListings = async () => {
  const response = await instance.get('/api/listings/my/');
  return response.data;
};

/**
 * Delete listing by ID
 * @param {number} id - Listing ID
 * @returns {Promise} API response
 */
export const deleteListing = async (id) => {
  const response = await instance.delete(`/api/listings/${id}/delete/`);
  return response.data;
};
