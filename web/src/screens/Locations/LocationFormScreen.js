import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import api from '../../api/client'

export default function LocationFormScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const editingLocation = route.params?.location || null

  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')

  useEffect(() => {
    if (editingLocation) {
      setName(editingLocation.name || '')
      setAddress(editingLocation.address || '')
      setLatitude(String(editingLocation.latitude))
      setLongitude(String(editingLocation.longitude))
    }
    if (route.params && route.params.locationFromMap) {
      const loc = route.params.locationFromMap
      if (!editingLocation) {
        setLatitude(String(loc.latitude))
        setLongitude(String(loc.longitude))
      }
    }
  }, [editingLocation, route.params])

  function handleOpenMap() {
    navigation.navigate('LocationMapScreen')
  }

  async function handleSubmit() {
    if (!name || !latitude || !longitude) {
      alert('Preencha nome e coordenadas.')
      return
    }

    const payload = {
      name,
      address: address || null,
      latitude: Number(latitude),
      longitude: Number(longitude),
    }

    try {
      if (editingLocation) {
        await api.put(`/locations/${editingLocation.id}`, payload)
      } else {
        await api.post('/locations', payload)
      }
      alert('Local salvo com sucesso!')
      navigation.goBack()
    } catch (error) {
      console.log(error)
      alert('Erro ao salvar local.')
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.mapPreview}>
        <TouchableOpacity style={styles.mapButton} onPress={handleOpenMap}>
          <Text style={styles.mapButtonText}>Marque no mapa o local desejado</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Dados do Local</Text>

      <Text style={styles.label}>Nome do Local</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nome"
      />

      <Text style={styles.label}>Endereço</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="Endereço"
      />

      <Text style={styles.sectionTitle}>Coordenadas</Text>

      <View style={styles.row}>
        <View style={styles.rowItem}>
          <Text style={styles.label}>Latitude</Text>
          <TextInput
            style={styles.input}
            value={latitude}
            onChangeText={setLatitude}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.rowItem}>
          <Text style={styles.label}>Longitude</Text>
          <TextInput
            style={styles.input}
            value={longitude}
            onChangeText={setLongitude}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.footerButtons}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonTextCancel}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonTextSubmit}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  mapPreview: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#DDE7FF',
    marginBottom: 16,
  },
  mapButton: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  mapButtonText: {
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowItem: {
    flex: 1,
  },
  footerButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 32,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FF4B4B',
  },
  submitButton: {
    backgroundColor: '#0066FF',
  },
  buttonTextCancel: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  buttonTextSubmit: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
})
