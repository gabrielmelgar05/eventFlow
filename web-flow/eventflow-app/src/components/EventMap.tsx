// src/components/EventMap.tsx
import React from 'react';
import MapView, { Marker, Region, MapPressEvent } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

// Tipo bem flexível para não brigar com o resto do projeto
type Props = {
  events: any[];
  onSelectEvent?: (event: any) => void;
  // opcionalmente você pode reaproveitar esse componente em outros lugares
  onMapPress?: (e: MapPressEvent) => void;
};

export default function EventMap({ events, onSelectEvent, onMapPress }: Props) {
  // Região padrão: Porto Velho
  const defaultRegion: Region = {
    latitude: -8.76077,
    longitude: -63.90391,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const initialRegion: Region =
    events && events.length > 0
      ? {
          latitude: events[0].location.latitude,
          longitude: events[0].location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }
      : defaultRegion;

  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        onPress={onMapPress}
      >
        {events.map((event) => (
          <Marker
            key={event.id}
            coordinate={{
              latitude: event.location.latitude,
              longitude: event.location.longitude,
            }}
            onPress={() => onSelectEvent?.(event)}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    width: '100%',
    height: 180,
    borderRadius: 18,
    overflow: 'hidden',
    marginTop: 12,
    marginBottom: 8,
  },
  map: {
    flex: 1,
  },
});
