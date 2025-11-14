// src/screens/Events/EventListScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import Header from '@/components/Header';
import EventCard from '@/components/EventCard';
import { colors } from '@/styles/colors';
import type { MainStackParamList } from '@/navigation/MainStack';
import { getEvents, Event } from '@/api/events';
import { getCategories } from '@/api/categories';

type Props = NativeStackScreenProps<MainStackParamList, 'EventList'>;

type Category = {
  id: number;
  name: string;
};

export default function EventListScreen({ navigation }: Props) {
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadEvents() {
    try {
      setLoading(true);
      const [evts, cats] = await Promise.all([getEvents(), getCategories()]);
      setEvents(evts);
      setCategories(cats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    if (!search.trim()) return events;
    const term = search.toLowerCase();
    return events.filter(e =>
      e.name.toLowerCase().includes(term) ||
      (e.description ?? '').toLowerCase().includes(term),
    );
  }, [events, search]);

  function getCategoryName(categoryId: number) {
    return categories.find(c => c.id === categoryId)?.name ?? `Categoria ID: ${categoryId}`;
  }

  function handleCreate() {
    navigation.navigate('EventForm');
  }

  function handleView(event: Event) {
    navigation.navigate('EventDetail', { event });
  }

  function handleEdit(event: Event) {
    navigation.navigate('EventForm', { event });
  }

  async function handleDelete(event: Event) {
    // você já tem deleteEvent em outro lugar; aqui só chama a tela que faz isso
    navigation.navigate('EventDetail', { event }); // ou chamar uma confirmação + deleteEvent
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header />

      <View style={styles.inner}>
        <Text style={styles.title}>Listagem de Eventos</Text>

        {/* Busca */}
        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquise Eventos"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Botão criar */}
        <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
          <Text style={styles.createButtonText}>Criar Evento +</Text>
        </TouchableOpacity>

        {/* Explore pelo mapa */}
        <View style={styles.mapExploreContainer}>
          <Text style={styles.mapExploreTitle}>Explore os Eventos</Text>
          <TouchableOpacity
            style={styles.mapExploreButton}
            onPress={() => navigation.navigate('EventMap')}
          >
            <Text style={styles.mapExploreButtonText}>Explore pelo Mapa</Text>
          </TouchableOpacity>
        </View>

        {/* Contador */}
        <Text style={styles.counterText}>
          Mostrando {filteredEvents.length} de {events.length} Eventos
        </Text>

        {/* Nenhum evento */}
        {!loading && events.length === 0 && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Nenhum evento localizado</Text>
          </View>
        )}

        {/* Lista */}
        {loading && events.length === 0 ? (
          <ActivityIndicator style={{ marginTop: 24 }} />
        ) : (
          <FlatList
            data={filteredEvents}
            keyExtractor={item => String(item.id)}
            style={{ flex: 1 }}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={loadEvents} />
            }
            renderItem={({ item }) => (
              <EventCard
                event={item}
                categoryName={getCategoryName(item.category_id)}
                onView={() => handleView(item)}
                onEdit={() => handleEdit(item)}
                onDelete={() => handleDelete(item)}
              />
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 20,
    fontWeight: '700',
  },
  searchBox: {
    marginBottom: 8,
  },
  searchInput: {
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  createButton: {
    marginTop: 8,
    marginBottom: 4,
    backgroundColor: colors.primaryBlue,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  mapExploreContainer: {
    marginTop: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    padding: 12,
  },
  mapExploreTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  mapExploreButton: {
    backgroundColor: '#d9d9d9',
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: 'center',
  },
  mapExploreButtonText: {
    fontWeight: '600',
  },
  counterText: {
    textAlign: 'right',
    marginVertical: 8,
  },
});
