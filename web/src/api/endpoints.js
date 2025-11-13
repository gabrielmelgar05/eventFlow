// src/api/endpoints.js
export const ENDPOINTS = {
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  ME: '/auth/me',

  EVENTS: '/events',
  EVENT_DETAIL: id => `/events/${id}`,

  CATEGORIES: '/categories',
  CATEGORY_DETAIL: id => `/categories/${id}`,

  LOCATIONS: '/locations',
  LOCATION_DETAIL: id => `/locations/${id}`,
};
