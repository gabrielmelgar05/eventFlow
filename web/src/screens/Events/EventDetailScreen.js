import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';
import { formatCurrency, formatDate } from '../../utils/formatters';
import MapView, { Marker } from 'react-native-maps';

export default function EventDetailScreen({ route }) {
  const { id } = route.params;
  const [event, setEvent] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await api.get(endpoints.event(id));
      setEvent(data);
    })();
  }, [id]);

  if (!event) return null;

  const lat = event?.location?.latitude ?? 0;
  const lng = event?.location?.longitude ?? 0;

  return (
    <ScrollView style={{ flex: 1 }}>
      {event.image_url ? (
        <Image source={{ uri: event.image_url }} style={{ width: '100%', height: 220 }} />
      ) : null}

      <View style={{ padding: 16, gap: 8 }}>
        <Text style={{ fontSize: 20, fontWeight: '800' }}>{event.name}</Text>
        <Text style={{ color: '#666' }}>{formatDate(event.date)} • {event.category?.name ?? 'Sem categoria'}</Text>
        <Text style={{ fontWeight: '700', marginTop: 4 }}>{formatCurrency(event.price || 0)}</Text>
        <Text style={{ marginTop: 10 }}>{event.description || 'Sem descrição.'}</Text>

        {lat && lng ? (
          <View style={{ marginTop: 14, height: 200, borderRadius: 12, overflow: 'hidden' }}>
            <MapView
              style={{ flex: 1 }}
              initialRegion={{ latitude: lat, longitude: lng, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
            >
              <Marker coordinate={{ latitude: lat, longitude: lng }} title={event.name} />
            </MapView>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}
