// src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.10:8000', // ajuste se precisar
  timeout: 10000,
});

export default api;
