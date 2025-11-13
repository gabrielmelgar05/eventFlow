import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as EventsApi from '../../api/events';

export default function EventDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { eventId } = route.params || {};
  const [event, setEvent] = useState(null);

  useEffect(() => {
    async function loadEvent() {
      if (!eventId) return;
      const data = await EventsApi.getEventById(eventId);
      setEvent(data);
    }
    loadEvent().catch(() => {});
  }, [eventId]);

  if (!event) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando evento...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.logoText}>Logo</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Image
          source={{ uri: event.banner_url || 'https://via.placeholder.com/400x200' }}
          style={styles.banner}
        />
        <View style={styles.section}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventType}>{event.type || 'Palestra'}</Text>
          <Text style={styles.eventDescription}>
            {event.description || 'Descrição do evento não informada.'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações do Evento</Text>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Data</Text>
              <Text style={styles.infoValue}>{event.date || 'DD/MM/AAAA'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Horário</Text>
              <Text style={styles.infoValue}>
                {event.start_time || '08:00'} --- {event.end_time || '12:30h'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Valor Ingresso</Text>
          <Text style={styles.priceText}>
            R$ {event.price != null ? event.price.toFixed(2) : '0,00'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Localização</Text>
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapText}>Mapa do local</Text>
          </View>
          <View style={styles.addressBlock}>
            <Text style={styles.addressLine}>
              Endereço: {event.address || 'Avenida Central, 1234'}
            </Text>
            <Text style={styles.addressLine}>
              Bairro: {event.neighborhood || 'Aurora, Solaris City — SP'}
            </Text>
            <Text style={styles.addressLine}>
              Ponto de Referência:{' '}
              {event.reference_point ||
                'Próximo ao Lago da Lua e ao Shopping Estação Aurora'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 48,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  backText: {
    color: '#0047FF',
    fontSize: 14,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  banner: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  eventType: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: '#555555',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
  },
  infoLabel: {
    fontSize: 12,
    color: '#777777',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0047FF',
  },
  mapPlaceholder: {
    height: 160,
    borderRadius: 12,
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  mapText: {
    color: '#555555',
  },
  addressBlock: {
    marginTop: 4,
  },
  addressLine: {
    fontSize: 13,
    color: '#555555',
    marginBottom: 2,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
  },
});
