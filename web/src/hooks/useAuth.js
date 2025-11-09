import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as loginApi, me as meApi } from '../api/auth';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const bootstrap = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const u = await meApi();
        setUser(u);
      }
    } catch (_) {}
    setLoading(false);
  }, []);

  useEffect(() => { bootstrap(); }, [bootstrap]);

  const login = async (email, password) => {
    const { access_token } = await loginApi(email, password);
    await AsyncStorage.setItem('token', access_token);
    const u = await meApi();
    setUser(u);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
  };

  return { user, loading, login, logout };
}
