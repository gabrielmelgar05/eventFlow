// src/hooks/useEvents.js

import { useEffect, useState, useCallback } from 'react';
import { getEvents, getEventById } from '../api/events'; // Importa getEventById

export function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log('Erro ao carregar eventos', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const fetchEventById = useCallback(async (eventId) => {
    try {
      const data = await getEventById(eventId);
      return data;
    } catch (err) {
      console.log(`Erro ao carregar evento ${eventId}`, err);
      throw err;
    }
  }, []);

  return {
    events,
    loading,
    error,
    reload: fetchEvents,
    getEventById: fetchEventById, // Adicionado
  };
}