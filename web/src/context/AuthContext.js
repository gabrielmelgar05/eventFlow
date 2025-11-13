// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthApi from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorage() {
      try {
        const storedToken = await AsyncStorage.getItem('@eventflow:token');
        const storedUser = await AsyncStorage.getItem('@eventflow:user');

        if (storedToken) setToken(storedToken);
        if (storedUser) setUser(JSON.parse(storedUser));
      } finally {
        setLoading(false);
      }
    }

    loadStorage();
  }, []);

  async function signIn({ email, password }) {
    try {
      console.log('AuthContext: chamando AuthApi.login...');
      const data = await AuthApi.login(email, password);
      console.log('AuthContext: resposta da API:', data);

      const accessToken = data.access_token || data.token;
      const userData = data.user || { email };

      if (!accessToken) {
        throw new Error('Token não retornado pela API');
      }

      setToken(accessToken);
      setUser(userData);

      await AsyncStorage.setItem('@eventflow:token', accessToken);
      await AsyncStorage.setItem('@eventflow:user', JSON.stringify(userData));

      return true; // ✅ indica que deu bom
    } catch (error) {
      console.log(
        'AuthContext: erro no signIn:',
        error?.response?.data || error.message
      );
      throw error; // deixa a tela tratar
    }
  }

  async function signOut() {
    setToken(null);
    setUser(null);
    await AsyncStorage.multiRemove(['@eventflow:token', '@eventflow:user']);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        signed: !!token,
        loading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return ctx;
}
