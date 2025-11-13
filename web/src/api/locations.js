import api from './client';

export async function fetchLocations(params = {}) {
  const response = await api.get('/locations', { params });
  return response.data;
}

export async function fetchLocationById(id) {
  const response = await api.get(`/locations/${id}`);
  return response.data;
}

export async function createLocation(payload) {
  const response = await api.post('/locations', payload);
  return response.data;
}

export async function updateLocation(id, payload) {
  const response = await api.put(`/locations/${id}`, payload);
  return response.data;
}

export async function deleteLocation(id) {
  const response = await api.delete(`/locations/${id}`);
  return response.data;
}
