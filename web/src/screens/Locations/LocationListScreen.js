import React, { useCallback, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  TextInput,
} from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import MapView, { Marker } from 'react-native-maps'
import api from '../../api/client'

function LocationCard({ item, onEdit }) {
  const region = {
    latitude: item.latitude,
    longitude: item.longitude,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  }

  return (
    <View style={styles.card}>
      <MapView style={styles.cardMap} region={region} pointerEvents="none">
        <Marker coordinate={{ latitude: item.latitude, longitude: item.longitude }} />
      </MapView>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        {item.address ? (
          <Text style={styles.cardSubtitle}>{item.address}</Text>
        ) : null}
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.btnEdit} onPress={onEdit}>
          <Text style={styles.btnText}>Editar</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default function LocationListScreen() {
  const navigation = useNavigation()
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  async function loadLocations() {
    setLoading(true)
    try {
      const response = await api.get('/locations')
      setLocations(response.data || [])
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadLocations()
    }, [])
  )

  function handleCreate() {
    navigation.navigate('LocationFormScreen')
  }

  function handleEdit(location) {
    navigation.navigate('LocationFormScreen', { location })
  }

  function filteredData() {
    if (!search) return locations
    const term = search.toLowerCase()
    return locations.filter(loc => loc.name.toLowerCase().includes(term))
  }

  function renderItem({ item }) {
    return (
      <LocationCard
        item={item}
        onEdit={() => handleEdit(item)}
      />
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Listagem de Locais</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Pesquise locais"
        value={search}
        onChangeText={setSearch}
      />

      <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
        <Text style={styles.createButtonText}>Criar Local +</Text>
      </TouchableOpacity>

      <Text style={styles.counterText}>
        Mostrando {filteredData().length} locais
      </Text>

      <FlatList
        data={filteredData()}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadLocations} />
        }
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.emptyText}>Nenhum local cadastrado.</Text>
          ) : null
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: '#0066FF',
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: 'center',
    marginBottom: 6,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  counterText: {
    marginBottom: 12,
    color: '#666666',
  },
  listContent: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  cardMap: {
    height: 120,
    width: '100%',
  },
  cardBody: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardSubtitle: {
    color: '#555555',
    fontSize: 14,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
    paddingBottom: 10,
    gap: 8,
  },
  btnEdit: {
    backgroundColor: '#FFC107',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  btnText: {
    color: '#1E1E1E',
    fontWeight: '600',
  },
  emptyText: {
    marginTop: 32,
    textAlign: 'center',
    color: '#777777',
  },
})
