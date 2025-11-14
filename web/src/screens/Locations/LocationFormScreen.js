import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,

  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import MapView, { Marker } from 'react-native-maps'
import api from '../../api/client'

export default function LocationFormScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const editingLocation = route.params?.location || null

  const [name, setName] = useState(editingLocation?.name || '')
  const [street, setStreet] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [city, setCity] = useState('')
  const [cep, setCep] = useState('')
  const [latitude, setLatitude] = useState(
    editingLocation?.latitude || -8.76,
  )
  const [longitude, setLongitude] = useState(
    editingLocation?.longitude || -63.87,
  )

  useEffect(() => {
    if (editingLocation?.address) {
      setStreet(editingLocation.address)
    }
  }, [editingLocation])

  function buildAddress() {
    if (!street && !neighborhood && !city && !cep) return ''
    const cepPart = cep ? `CEP ${cep}` : ''
    return `${street || ''} | ${neighborhood || ''} - ${city || ''} | ${cepPart}`.trim()
  }

  async function handleSubmit() {
    if (!name.trim()) {
      Alert.alert('Atenção', 'Informe o nome do local.')
      return
    }

    const payload = {
      name,

      latitude,
      longitude,
      address: buildAddress(),
    }

    try {
      if (editingLocation) {
        await api.put(`/locations/${editingLocation.id}`, payload)
      } else {
        await api.post('/locations', payload)
      }
      Alert.alert('Sucesso', 'Local salvo com sucesso!')
      navigation.navigate('LocaisTab')
    } catch (e) {
      console.log(e)
      Alert.alert('Erro', 'Não foi possível salvar o local.')
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.sectionTitle}>Cadastrar Local</Text>

      <TouchableOpacity
        style={styles.mapPreview}
        onPress={() =>
          navigation.navigate('LocationMapScreen', {
            from: 'location',
            latitude,
            longitude,
          })
        }
      >
        <MapView
          style={styles.mapInner}
          pointerEvents="none"
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker coordinate={{ latitude, longitude }} />
        </MapView>
        <View style={styles.mapOverlay}>
          <Text style={styles.mapOverlayText}>Marque no mapa o local desejado</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.field}>
        <Text style={styles.label}>Nome do Local</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Nome"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Rua</Text>
        <TextInput
          style={styles.input}
          value={street}
          onChangeText={setStreet}
          placeholder="Rua"
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.fieldRow, { flex: 1 }]}>
          <Text style={styles.label}>Bairro</Text>
          <TextInput
            style={styles.input}
            value={neighborhood}
            onChangeText={setNeighborhood}
            placeholder="Bairro"
          />
        </View>
        <View style={[styles.fieldRow, { flex: 1 }]}>
          <Text style={styles.label}>Cidade</Text>
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={setCity}
            placeholder="Cidade"
          />
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>CEP</Text>
        <TextInput
          style={styles.input}
          value={cep}
          onChangeText={setCep}
          placeholder="CEP"
          keyboardType="numeric"
        />
      </View>

      <Text style={styles.sectionSubTitle}>Coordenadas</Text>

      <View style={styles.row}>
        <View style={[styles.fieldRow, { flex: 1 }]}>
          <Text style={styles.label}>Latitude</Text>
          <TextInput
            style={styles.input}
            value={String(latitude)}
            editable={false}
          />
        </View>
        <View style={[styles.fieldRow, { flex: 1 }]}>
          <Text style={styles.label}>Longitude</Text>
          <TextInput
            style={styles.input}
            value={String(longitude)}
            editable={false}
          />
        </View>
      </View>

      <View style={styles.footerButtons}>
        <TouchableOpacity

          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveButtonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#F3F4F6',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  mapPreview: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  mapInner: {
    flex: 1,
  },
  mapOverlay: {
    position: 'absolute',
    top: 8,
    left: 16,
    right: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
  },
  mapOverlayText: {
    fontSize: 13,
    fontWeight: '500',
  },
  field: {
    marginTop: 12,
  },
  fieldRow: {
    marginTop: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  sectionSubTitle: {
    marginTop: 24,
    fontSize: 16,
    fontWeight: '700',
  },
  footerButtons: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#1D4ED8',
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
})
