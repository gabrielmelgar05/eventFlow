// src/api/categories.js
import api from './client'

export async function fetchCategories() {
  const { data } = await api.get('/categories')
  return data
}
