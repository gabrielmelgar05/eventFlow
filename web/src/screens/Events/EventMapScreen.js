import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import * as Location from 'expo-location'
import { useNavigation } from '@react-navigation/native'
import api from '../../api/client'

export default function EventMapScreen() {
  const navigation = useNavigation()
  const [region, setRegion] = useState(null)
  const [marker, setMarker] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCurrentLocation()
  }, [])

  async function getCurrentLocation() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setRegion({
          latitude: -8.76077,
          longitude: -63.8999,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        })
        setLoading(false)
        return
      }
      const loc = await Location.getCurrentPositionAsync({})
      const reg = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
      setRegion(reg)
      setMarker({ latitude: reg.latitude, longitude: reg.longitude })
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  function handlePressMap(event) {
    const { latitude, longitude } = event.nativeEvent.coordinate
    setMarker({ latitude, longitude })
  }

  async function handleConfirm() {
    if (!marker) {
      alert('Marque um ponto no mapa.')
      return
    }
    try {
      const payload = {
        name: 'Local do Evento',
        latitude: marker.latitude,
        longitude: marker.longitude,
        address: null,
      }
      const response = await api.post('/locations', payload)
      const location = response.data
      navigation.navigate('EventFormScreen', { locationFromMap: location })
    } catch (error) {
      console.log(error)
      alert('Erro ao salvar local.')
    }
  }

  if (loading || !region) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0066FF" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region} onPress={handlePressMap}>
        {marker && <Marker coordinate={marker} />}
      </MapView>
      <View style={styles.bottomPanel}>
        <Text style={styles.infoText}>Toque no mapa para marcar o local do evento.</Text>
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonTextCancel}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.confirmButton]}
            onPress={handleConfirm}
          >
            <Text style={styles.buttonTextConfirm}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F4F4',
  },
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  bottomPanel: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  infoText: {
    textAlign: 'center',
    marginBottom: 12,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 32,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E5E5E5',
  },
  confirmButton: {
    backgroundColor: '#0066FF',
  },
  buttonTextCancel: {
    color: '#333333',
    fontWeight: '600',
  },
  buttonTextConfirm: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
})
