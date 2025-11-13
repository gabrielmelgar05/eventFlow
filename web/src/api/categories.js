// src/api/categories.js
import api from './client';
import { ENDPOINTS } from './endpoints';

export async function listCategories() {
  const { data } = await api.get(ENDPOINTS.CATEGORIES);
  return data;
}

export async function createCategory(payload) {
  const { data } = await api.post(ENDPOINTS.CATEGORIES, payload);
  return data;
}

export async function updateCategory(id, payload) {
  const { data } = await api.put(ENDPOINTS.CATEGORY_DETAIL(id), payload);
  return data;
}

export async function deleteCategory(id) {
  await api.delete(ENDPOINTS.CATEGORY_DETAIL(id));
}
