// src/api/events.js

import api from '../utils/api';

export async function getEvents() {
  const response = await api.get('/events');
  return response.data;
}

export async function getEventById(eventId) {
  const response = await api.get(`/events/${eventId}`);
  return response.data;
}

export async function createEvent(payload) {
  // JSON simples, sem imagem
  const response = await api.post('/events', payload);
  return response.data;
}

export async function createEventWithImage(formData) {
  // Note que o backend agora espera Content-Type: multipart/form-data
  const response = await api.post('/events/create-with-image', formData, {
    headers: {
      // O 'Content-Type' é geralmente setado automaticamente
      // pelo FormData, mas pode ser explicitado para clareza
      'Content-Type': 'multipart/form-data', 
    },
  });
  return response.data;
}