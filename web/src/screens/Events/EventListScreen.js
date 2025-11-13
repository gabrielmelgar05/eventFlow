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

export default function EventListScreen() {
  const navigation = useNavigation()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)

  async function loadEvents() {
    setLoading(true)
    try {
      const response = await api.get('/events')
      setEvents(response.data || [])
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadEvents()
    }, [])
  )

  function handleCreate() {
    navigation.navigate('EventFormScreen')
  }

  function renderItem({ item }) {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSubtitle}>
          {item.event_date} • {item.event_time}
        </Text>
        <Text style={styles.cardSubtitle}>
          R$ {Number(item.price || 0).toFixed(2).replace('.', ',')}
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Listagem de Eventos</Text>

      <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
        <Text style={styles.createButtonText}>Criar Evento +</Text>
      </TouchableOpacity>

      <Text style={styles.counterText}>Mostrando {events.length} eventos</Text>

      <FlatList
        data={events}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadEvents} />
        }
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.emptyText}>Nenhum evento cadastrado.</Text>
          ) : null
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#F4F4F4',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  createButton: {
    backgroundColor: '#0066FF',
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: 'center',
    marginBottom: 8,
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
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#555555',
  },
  emptyText: {
    marginTop: 32,
    textAlign: 'center',
    color: '#777777',
  },
})
