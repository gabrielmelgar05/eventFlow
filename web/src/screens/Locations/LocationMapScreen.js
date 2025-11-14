import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { Ionicons } from '@expo/vector-icons'

// Coordenada inicial para o mapa
const initialRegion = {
  latitude: -10.0, // Exemplo de coordenada (Porto Velho/Brasil)
  longitude: -65.0,
  latitudeDelta: 10,
  longitudeDelta: 10,
}

export default function LocationMapScreen({ navigation }) {
  const [selectedLocation, setSelectedLocation] = useState(null)

  const handleMapPress = (e) => {
    // Quando o usuário toca no mapa, salva a coordenada
    setSelectedLocation(e.nativeEvent.coordinate)
  }

  const handleSaveLocation = () => {
    if (selectedLocation) {
      // Aqui você enviaria 'selectedLocation' de volta para o EventFormScreen
      // Exemplo: navigation.navigate('EventForm', { location: selectedLocation });
      console.log('Localização salva:', selectedLocation)
      navigation.goBack() 
    } else {
      console.log('Selecione uma localização no mapa.')
    }
  }

  return (
    <View style={styles.container}>
      {/* Top Bar com botão Voltar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Marcar Local no Mapa</Text>
        <View style={{ width: 30 }} />
      </View>

      {/* Instrução */}
      <View style={styles.instructionBox}>
        <Text style={styles.instructionText}>Toque no mapa para marcar a localização do evento.</Text>
      </View>

      {/* Componente de Mapa */}
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        onPress={handleMapPress}
      >
        {/* Marcador da localização selecionada */}
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title="Local do Evento"
            draggable
            onDragEnd={(e) => setSelectedLocation(e.nativeEvent.coordinate)}
          />
        )}
      </MapView>

      {/* Botão de Ação */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.saveButton, !selectedLocation && styles.disabledButton]} 
          onPress={handleSaveLocation}
          disabled={!selectedLocation}
        >
          <Text style={styles.saveButtonText}>Salvar Localização</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 5,
  },
  instructionBox: {
    padding: 10,
    backgroundColor: '#fff3cd',
    borderBottomWidth: 1,
    borderColor: '#ffeeba',
    alignItems: 'center',
  },
  instructionText: {
    color: '#856404',
    fontSize: 14,
  },
  map: {
    flex: 1,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#0011FF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})