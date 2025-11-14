// src/api/categories.ts
import { api } from './client';
import type { Category } from './events';

export async function getCategories() {
  const { data } = await api.get<Category[]>('/categories');
  return data;
}
