// src/screens/Events/EventDetailScreen.tsx
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import Header from '@/components/Header';
import { colors } from '@/styles/colors';
import type { MainStackParamList } from '@/navigation/MainStack';
import { resolveEventImageUrl, Event } from '@/api/events';
import { getCategories } from '@/api/categories';

type Props = NativeStackScreenProps<MainStackParamList, 'EventDetail'>;

export default function EventDetailScreen({ route, navigation }: Props) {
  const { event } = route.params as { event: Event };

  const region: Region = {
    latitude: event.location.latitude,
    longitude: event.location.longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const imageUrl = resolveEventImageUrl(event.image_path ?? undefined);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: colors.primaryBlue, marginBottom: 8 }}>Voltar</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          {/* Imagem ou placeholder */}
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.image} />
          ) : (
            <View style={styles.noImageBox}>
              <Text style={styles.noImageText}>Sem imagem disponível</Text>
            </View>
          )}

          <View style={{ padding: 12 }}>
            <Text style={styles.title}>{event.name}</Text>
            <Text style={styles.subtitle}>Categoria ID: {event.category_id}</Text>

            {!!event.description && (
              <Text style={styles.description}>{event.description}</Text>
            )}

            <View style={styles.infoBlock}>
              <Text style={styles.infoTitle}>Informações do Evento</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Data</Text>
                <Text>{event.event_date}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Horário</Text>
                <Text>
                  {event.event_time} — {event.end_time}
                </Text>
              </View>
            </View>

            <View style={styles.priceBlock}>
              <Text style={styles.priceLabel}>Valor Ingresso</Text>
              <Text style={styles.priceValue}>R$ {event.price.toFixed(2)}</Text>
            </View>

            <View style={styles.locationBlock}>
              <Text style={styles.locationTitle}>Localização</Text>
              <MapView style={styles.map} initialRegion={region}>
                <Marker coordinate={region} />
              </MapView>

              <Text style={styles.addressLabel}>Endereço:</Text>
              <Text style={styles.addressText}>
                {event.location.address ?? 'Endereço não informado'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
  },
  noImageBox: {
    width: '100%',
    height: 180,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageText: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
  },
  title: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 6,
  },
  description: {
    fontSize: 12,
    marginBottom: 8,
  },
  infoBlock: {
    marginTop: 4,
  },
  infoTitle: { fontWeight: '700', marginBottom: 4 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontWeight: '600',
  },
  priceBlock: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.primaryBlue,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceLabel: { color: colors.textLight, fontWeight: '600' },
  priceValue: { color: colors.textLight, fontWeight: '700' },
  locationBlock: {
    marginTop: 12,
  },
  locationTitle: {
    fontWeight: '700',
    marginBottom: 4,
  },
  map: {
    width: '100%',
    height: 160,
    borderRadius: 12,
  },
  addressLabel: {
    marginTop: 8,
    fontWeight: '600',
  },
  addressText: {
    fontSize: 12,
  },
});
