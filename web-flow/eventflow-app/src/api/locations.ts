// src/api/locations.ts
import { api } from './client';
import type { Location } from './events';

export async function getLocations() {
  const { data } = await api.get<Location[]>('/locations');
  return data;
}

export type LocationCreatePayload = {
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
};

export async function createLocation(payload: LocationCreatePayload) {
  const { data } = await api.post<Location>('/locations', payload);
  return data;
}

export async function updateLocation(id: number, payload: LocationCreatePayload) {
  const { data } = await api.put<Location>(`/locations/${id}`, payload);
  return data;
}

export async function deleteLocation(id: number) {
  await api.delete(`/locations/${id}`);
}
