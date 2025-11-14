// src/api/locations.js

import api from '../utils/api';

export async function getLocations() {
  const response = await api.get('/locations');
  return response.data;
}

// Nota: A criação de Location será feita primariamente via /events/create-with-image
// Se você precisar de um formulário de localização dedicado, crie:
/*
export async function createLocation(payload) {
  const response = await api.post('/locations', payload);
  return response.data;
}
*/