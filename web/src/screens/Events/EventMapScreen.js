// src/screens/Events/EventMapScreen.js
import React from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import MapView, { Callout, Marker } from 'react-native-maps'
import { useNavigation } from '@react-navigation/native'
import { useEvents } from '../../hooks/useEvents' // Usamos a lista de events

export default function EventMapScreen() {
  const { events } = useEvents() // Pega a lista de eventos
  const navigation = useNavigation()
  
  const eventsWithLocation = events.filter((e) => e.location);

  const initialRegion = React.useMemo(() => {
    const firstWithLocation = eventsWithLocation.find((e) => e.location)
    if (!firstWithLocation) {
      // Região Padrão (Porto Velho)
      return {
        latitude: -8.7612,
        longitude: -63.9007,
        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
      }
    }

    // Centraliza no primeiro evento
    return {
      latitude: firstWithLocation.location.latitude,
      longitude: firstWithLocation.location.longitude,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    }
  }, [eventsWithLocation])

  return (
    <SafeAreaView style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion}>
        {eventsWithLocation
          .map((event) => (
            <Marker
              key={event.id}
              coordinate={{
                latitude: event.location.latitude,
                longitude: event.location.longitude,
              }}
            >
              <Callout
                onPress={() =>
                  navigation.navigate('EventDetail', { eventId: event.id })
                }
              >
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle}>{event.name}</Text>
                  <Text style={styles.calloutSubtitle}>
                    R$ {event.price.toFixed(2).replace('.', ',')}
                  </Text>
                  <Text style={styles.calloutLink}>Ver detalhes</Text>
                </View>
              </Callout>
            </Marker>
          ))}
      </MapView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  callout: { maxWidth: 200 },
  calloutTitle: { fontWeight: '600', marginBottom: 2 },
  calloutSubtitle: { fontSize: 12 },
  calloutLink: { marginTop: 4, fontSize: 12, color: '#00008B' },
})