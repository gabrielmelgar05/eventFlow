import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import api from '../api/client';
import { useNavigation } from '@react-navigation/native';

export default function EventsMapScreen() {
  const nav = useNavigation();
  const [region, setRegion] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setRegion({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      } else {
        setRegion({ latitude: -8.761, longitude: -63.903, latitudeDelta: 0.06, longitudeDelta: 0.06 });
      }
      const { data } = await api.get('/events');
      setEvents(data);
    })();
  }, []);

  if (!region) return null;

  return (
    <MapView style={{ flex: 1 }} initialRegion={region}>
      {events.map(ev => (
        ev.location && (
          <Marker
            key={ev.id}
            coordinate={{ latitude: ev.location.latitude, longitude: ev.location.longitude }}
            title={ev.title}
            description={`R$ ${Number(ev.price).toFixed(2)} • ${ev.date}`}
          >
            <Callout onPress={() => nav.navigate('EventDetail', { id: ev.id })}>
              <View style={{ maxWidth: 220 }}>
                <Text className="font-bold">{ev.title}</Text>
                <Text>{ev.date} • R$ {Number(ev.price).toFixed(2)}</Text>
                <Text className="text-blue-600 mt-1">Ver detalhes</Text>
              </View>
            </Callout>
          </Marker>
        )
      ))}
    </MapView>
  );
}
