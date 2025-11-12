// web/src/hook/useEvent.js
import { useEffect, useState, useCallback } from 'react';
import client from '../api/client';

// Filtro simples por busca (nome) e categoria opcional
export default function useEvent({ search = '', categoryId = null } = {}) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (search) params.q = search;
      if (categoryId) params.category_id = categoryId;

      const { data } = await client.get('/events', { params });
      setEvents(Array.isArray(data) ? data : (data?.items ?? []));
    } catch (err) {
      setError(err?.response?.data ?? err?.message ?? 'Erro ao buscar eventos');
    } finally {
      setLoading(false);
    }
  }, [search, categoryId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, error, refetch: fetchEvents };
}
