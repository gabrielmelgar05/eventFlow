// src/api/events.ts
import { api } from './client';

export type Location = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  address?: string | null;
};

export type Category = {
  id: number;
  name: string;
};

export type Event = {
  id: number;
  name: string;
  description?: string | null;
  event_date: string; // yyyy-mm-dd
  event_time: string; // hh:mm:ss
  end_time?: string | null;
  price: number;
  image_path?: string | null;
  category_id: number;
  location_id: number;
  location: Location;
};

export async function getEvents() {
  const { data } = await api.get<Event[]>('/events');
  return data;
}

export type EventCreatePayload = {
  name: string;
  description?: string;
  event_date: string;
  event_time: string;
  end_time?: string;
  price: number;
  category_id: number;
  location_id?: number;
  latitude?: number;
  longitude?: number;
  new_location_name?: string;
  address?: string;
};

export async function createEventWithImage(
  payload: EventCreatePayload,
  imageUris: string[],
) {
  const formData = new FormData();

  formData.append('name', payload.name);
  if (payload.description) formData.append('description', payload.description);
  formData.append('event_date', payload.event_date);
  formData.append('event_time', payload.event_time);
  if (payload.end_time) formData.append('end_time', payload.end_time);
  formData.append('price', String(payload.price));
  formData.append('category_id', String(payload.category_id));

  if (payload.location_id) {
    formData.append('location_id', String(payload.location_id));
  } else if (
    payload.latitude !== undefined &&
    payload.longitude !== undefined &&
    payload.new_location_name
  ) {
    formData.append('latitude', String(payload.latitude));
    formData.append('longitude', String(payload.longitude));
    formData.append('new_location_name', payload.new_location_name);
    if (payload.address) formData.append('address', payload.address);
  }

  // backend aceita 1 file; enviamos a primeira imagem, se existir
  if (imageUris[0]) {
    const uri = imageUris[0];
    const ext = uri.split('.').pop() || 'jpg';

    formData.append('file', {
      uri,
      name: `event.${ext}`,
      type: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
    } as any);
  }

  const { data } = await api.post<Event>('/events/create-with-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data;
}

export async function updateEvent(id: number, payload: EventCreatePayload) {
  const { data } = await api.put<Event>(`/events/${id}`, payload);
  return data;
}

export async function deleteEvent(id: number) {
  await api.delete(`/events/${id}`);
}

/**
 * Monta a URL completa da imagem do evento.
 * Se já vier http/https, só devolve.
 * Se vier só o caminho (/uploads/...), prefixa com a baseURL do axios.
 */
export function resolveEventImageUrl(imagePath?: string | null): string | null {
  if (!imagePath) return null;

  if (imagePath.startsWith('http')) return imagePath;

  const baseURL = api.defaults.baseURL ?? '';
  if (!baseURL) return imagePath;

  if (imagePath.startsWith('/')) return `${baseURL}${imagePath}`;
  return `${baseURL}/${imagePath}`;
}
