import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { useNavigation, useRoute } from '@react-navigation/native'
import * as Location from 'expo-location'
import api from '../../api/client'
import { Alert } from 'react-native'

export default function EventMapScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const [marker, setMarker] = useState({
    latitude: -8.76,
    longitude: -63.87,
  })

  async function handleConfirm() {
    try {
      const geocode = await Location.reverseGeocodeAsync(marker)
      const first = geocode[0]
      const address = `${first?.street || ''} ${first?.name || ''} | ${first?.district || ''} - ${
        first?.city || ''
      } | CEP ${first?.postalCode || ''}`

      const res = await api.post('/locations', {
        name: first?.street || 'Local',
        latitude: marker.latitude,
        longitude: marker.longitude,
        address,
      })

      navigation.navigate('EventFormScreen', {
        locationCreatedId: res.data.id,
      })
    } catch (e) {
      console.log(e)
      Alert.alert('Erro', 'Não foi possível salvar o local.')
    }
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: marker.latitude,
          longitude: marker.longitude,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}
        onPress={(e) => setMarker(e.nativeEvent.coordinate)}
      >
        <Marker coordinate={marker} />
      </MapView>
      <View style={styles.bottomPanel}>
        <Text style={styles.coords}>
          {marker.latitude.toFixed(6)} | {marker.longitude.toFixed(6)}
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleConfirm}>
          <Text style={styles.buttonText}>Confirmar Local</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  bottomPanel: {
    padding: 16,
    backgroundColor: '#FFF',
  },
  coords: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#4B5563',
  },
  button: {
    backgroundColor: '#1D4ED8',
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
})
