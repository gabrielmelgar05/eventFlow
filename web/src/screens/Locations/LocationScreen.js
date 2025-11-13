import React, { useCallback, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import api from '../../api/client'
import MapView, { Marker } from 'react-native-maps'

function LocationCard({ item, onEdit, onDelete, onView }) {
  return (
    <View style={styles.card}>
      <MapView
        style={styles.cardMap}
        pointerEvents="none"
        initialRegion={{
          latitude: item.latitude,
          longitude: item.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        <Marker coordinate={{ latitude: item.latitude, longitude: item.longitude }} />
      </MapView>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.cardSubtitle} numberOfLines={2}>
          {item.address}
        </Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.btnEdit} onPress={onEdit}>
          <Text style={styles.btnText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnDelete} onPress={onDelete}>
          <Text style={styles.btnText}>Excluir</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnView} onPress={onView}>
          <Text style={styles.btnText}>Ver</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default function LocationListScreen() {
  const navigation = useNavigation()
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(false)

  async function loadLocations() {
    try {
      setLoading(true)
      const res = await api.get('/locations')
      setLocations(res.data)
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadLocations()
    }, []),
  )

  async function handleDeleteLocation(id) {
    try {
      await api.delete(`/locations/${id}`)
      loadLocations()
    } catch (e) {
      console.log(e)
    }
  }

  function renderItem({ item }) {
    return (
      <LocationCard
        item={item}
        onEdit={() => navigation.navigate('LocationFormScreen', { location: item })}
        onDelete={() => handleDeleteLocation(item.id)}
        onView={() =>
          navigation.navigate('LocationMapScreen', { location: item, readOnly: true })
        }
      />
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Listagem de Locais</Text>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate('LocationFormScreen')}
      >
        <Text style={styles.primaryButtonText}>Criar Local +</Text>
      </TouchableOpacity>

      <Text style={styles.counterText}>
        Mostrando {locations.length} locais
      </Text>

      <FlatList
        data={locations}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadLocations} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum local cadastrado.</Text>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  primaryButton: {
    marginTop: 8,
    backgroundColor: '#1D4ED8',
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  counterText: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 13,
    color: '#4B5563',
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    color: '#6B7280',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
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
    fontSize: 14,
    fontWeight: '600',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    padding: 10,
    gap: 8,
  },
  btnEdit: {
    flex: 1,
    backgroundColor: '#FBBF24',
    borderRadius: 999,
    alignItems: 'center',
    paddingVertical: 6,
  },
  btnDelete: {
    flex: 1,
    backgroundColor: '#EF4444',
    borderRadius: 999,
    alignItems: 'center',
    paddingVertical: 6,
  },
  btnView: {
    flex: 1,
    backgroundColor: '#1D4ED8',
    borderRadius: 999,
    alignItems: 'center',
    paddingVertical: 6,
  },
  btnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
})
