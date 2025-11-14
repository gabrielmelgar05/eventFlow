// src/context/AuthContext.tsx
import React, { createContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '@/api/client';
import { getMe, login, signup, User } from '@/api/auth';

type AuthContextData = {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (data: { email: string; password: string }) => Promise<void>;
  signUp: (data: { name: string; email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

type Props = { children: ReactNode };

const TOKEN_KEY = '@eventflow_token';

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const stored = await AsyncStorage.getItem(TOKEN_KEY);
        if (stored) {
          api.defaults.headers.common.Authorization = `Bearer ${stored}`;
          try {
            const me = await getMe(stored);
            setUser(me);
            setToken(stored);
          } catch {
            await AsyncStorage.removeItem(TOKEN_KEY);
          }
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function signIn({ email, password }: { email: string; password: string }) {
    const { token: jwt } = await login(email, password);
    setToken(jwt);
    api.defaults.headers.common.Authorization = `Bearer ${jwt}`;
    await AsyncStorage.setItem(TOKEN_KEY, jwt);
    const me = await getMe(jwt);
    setUser(me);
  }

  async function signUp({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) {
    const { token: jwt } = await signup(name, email, password);
    setToken(jwt);
    api.defaults.headers.common.Authorization = `Bearer ${jwt}`;
    await AsyncStorage.setItem(TOKEN_KEY, jwt);
    const me = await getMe(jwt);
    setUser(me);
  }

  async function signOut() {
    setUser(null);
    setToken(null);
    delete api.defaults.headers.common.Authorization;
    await AsyncStorage.removeItem(TOKEN_KEY);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
