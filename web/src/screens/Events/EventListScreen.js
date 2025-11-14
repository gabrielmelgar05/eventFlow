// src/screens/Events/EventListScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  TextInput,
  SafeAreaView,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { useEvents } from '../../hooks/useEvents';

import EventCard from '../../components/EventCard';

export default function EventListScreen() {
  const navigation = useNavigation();
  const { events, loading, reload } = useEvents();

  function handleOpenMap() {
    // assume que 'Mapa' é o nome da rota para EventMapScreen no TabNavigator
    navigation.navigate('EventMap'); 
  }

  function handleCreate() {
    navigation.navigate('EventForm');
  }

  function handleOpenDetail(eventId) {
    navigation.navigate('EventDetail', { eventId });
  }

  const total = events.length;
  
  // Região inicial para o mapa do topo
  const initialRegion = {
    latitude: -8.76077, // Porto Velho (padrão)
    longitude: -63.8999,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* TOPO (logo, título, menu) */}
        <View style={styles.header}>
          <Text style={styles.logoText}>Logo</Text>
          <Text style={styles.menuIcon}>≡</Text>
        </View>

        <Text style={styles.welcome}>Bem vindo ao Aplicativo</Text>

        {/* SEARCH */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquise Eventos, Show e etc.."
            placeholderTextColor="#888"
          />
        </View>

        {/* MAPA NO TOPO */}
        <Text style={styles.sectionTitle}>Explore os Eventos</Text>

        <TouchableOpacity
          style={styles.mapCard}
          activeOpacity={0.9}
          onPress={handleOpenMap}
        >
          <MapView
            style={styles.map}
            pointerEvents="none" // Desativa interações no mapa
            initialRegion={initialRegion}
          >
            {events
              .filter(event => event.location) // Só eventos com localização
              .slice(0, 3) // Limita o número de markers para a prévia
              .map((event) => (
              <Marker
                key={event.id}
                coordinate={{
                  latitude: event.location.latitude,
                  longitude: event.location.longitude,
                }}
                title={event.name}
              />
            ))}
          </MapView>

          <View style={styles.mapButton}>
            <Text style={styles.mapButtonText}>Explore pelo Mapa</Text>
          </View>
        </TouchableOpacity>

        {/* CONTADOR + BOTÃO CRIAR */}
        <View style={styles.listHeaderRow}>
            <Text style={styles.counterText}>
                Mostrando {total} de {total} Eventos
            </Text>
            <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
                <Text style={styles.createButtonText}>Criar Evento +</Text>
            </TouchableOpacity>
        </View>

        {/* LISTA / EMPTY / LOADING */}
        <View style={styles.listContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#0011FF" style={{marginTop: 50}}/>
          ) : total === 0 ? (
            <View style={styles.emptyWrapper}>
              <Text style={styles.emptyText}>Nenhum evento localizado</Text>
            </View>
          ) : (
            <FlatList
              data={events}
              keyExtractor={(item) => String(item.id)}
              onRefresh={reload}
              refreshing={loading}
              contentContainerStyle={{ paddingBottom: 24 }}
              renderItem={({ item }) => (
                <EventCard
                  event={item}
                  onPress={() => handleOpenDetail(item.id)}
                />
              )}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 0, // A safeArea cuida disso
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoText: {
    fontWeight: '600',
    fontSize: 16,
  },
  menuIcon: {
    fontSize: 20,
  },
  welcome: {
    marginTop: 12,
    fontSize: 16,
    color: '#444',
    paddingHorizontal: 16,
    fontWeight: '700'
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
  },
  searchInput: {
    height: 40,
    borderRadius: 8,
    backgroundColor: '#EDEDED',
    paddingHorizontal: 16,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    marginBottom: 8,
    fontWeight: '600',
    color: '#333',
    fontSize: 14,
  },
  mapCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#DDD',
    height: 120, // Altura ajustada
  },
  map: {
    flex: 1,
  },
  mapButton: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapButtonText: {
    color: '#333',
    fontWeight: '500',
    marginLeft: 4,
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  counterText: {
    color: '#555',
    fontSize: 12
  },
  createButton: {
    backgroundColor: '#0011FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});