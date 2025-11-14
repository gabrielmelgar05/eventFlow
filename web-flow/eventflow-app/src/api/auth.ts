// src/api/auth.ts
import { api } from './client';

export type User = {
  id: number;
  name: string;
  email: string;
};

export type AuthResponse = {
  token: string;
};

export async function login(email: string, password: string) {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
  return data;
}

export async function signup(name: string, email: string, password: string) {
  const { data } = await api.post<AuthResponse>('/auth/signup', { name, email, password });
  return data;
}

export async function getMe(token: string) {
  const { data } = await api.get<User>('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}
