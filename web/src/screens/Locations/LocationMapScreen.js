import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { useNavigation, useRoute } from '@react-navigation/native'

export default function LocationMapScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const readOnly = route.params?.readOnly || false

  const [marker, setMarker] = useState({
    latitude: route.params?.latitude || -8.76,
    longitude: route.params?.longitude || -63.87,
  })

  function handleConfirm() {
    if (readOnly) {
      navigation.goBack()
      return
    }
    navigation.navigate('LocationFormScreen', {
      latitude: marker.latitude,
      longitude: marker.longitude,
    })
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
        onPress={(e) => {
          if (!readOnly) setMarker(e.nativeEvent.coordinate)
        }}
      >
        <Marker coordinate={marker} />
      </MapView>
      {!readOnly && (
        <View style={styles.bottomPanel}>
          <Text style={styles.coords}>
            {marker.latitude.toFixed(6)} | {marker.longitude.toFixed(6)}
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleConfirm}>
            <Text style={styles.buttonText}>Confirmar Local</Text>
          </TouchableOpacity>
        </View>
      )}
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
