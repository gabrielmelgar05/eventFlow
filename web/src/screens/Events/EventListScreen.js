import React, { useCallback, useState } from 'react'
<<<<<<< HEAD
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
=======
import { View, Text, StyleSheet, TouchableOpacity, FlatList, RefreshControl } from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import api from '../../api/client'
import { format } from 'date-fns'
>>>>>>> f28fa6f4d3d8036830a9e6f78154ae84b7c596ef

export default function EventListScreen() {
  const navigation = useNavigation()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)

  async function loadEvents() {
<<<<<<< HEAD
    setLoading(true)
    try {
      const response = await api.get('/events')
      setEvents(response.data || [])
    } catch (error) {
      console.log(error)
=======
    try {
      setLoading(true)
      const res = await api.get('/events')
      setEvents(res.data)
    } catch (e) {
      console.log(e)
>>>>>>> f28fa6f4d3d8036830a9e6f78154ae84b7c596ef
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadEvents()
<<<<<<< HEAD
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
=======
    }, []),
  )

  function renderItem({ item }) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.subtitle}>{item.description}</Text>
        <View style={styles.row}>
          <Text style={styles.chip}>
            {format(new Date(item.event_date), 'dd/MM/yyyy')}
          </Text>
          <Text style={styles.chip}>
            {item.start_time?.slice(0, 5)} - {item.end_time?.slice(0, 5)}
          </Text>
        </View>
        <Text style={styles.price}>
          R$ {Number(item.price).toFixed(2).replace('.', ',')}
>>>>>>> f28fa6f4d3d8036830a9e6f78154ae84b7c596ef
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
<<<<<<< HEAD
      <Text style={styles.title}>Listagem de Eventos</Text>

      <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
        <Text style={styles.createButtonText}>Criar Evento +</Text>
      </TouchableOpacity>

      <Text style={styles.counterText}>Mostrando {events.length} eventos</Text>

      <FlatList
        data={events}
        keyExtractor={item => String(item.id)}
=======
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Listagem de Eventos</Text>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate('EventFormScreen')}
      >
        <Text style={styles.primaryButtonText}>Criar Evento +</Text>
      </TouchableOpacity>

      <Text style={styles.counterText}>
        Mostrando {events.length} eventos
      </Text>

      <FlatList
        data={events}
        keyExtractor={(item) => String(item.id)}
>>>>>>> f28fa6f4d3d8036830a9e6f78154ae84b7c596ef
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadEvents} />
        }
        ListEmptyComponent={
<<<<<<< HEAD
          !loading ? (
            <Text style={styles.emptyText}>Nenhum evento cadastrado.</Text>
          ) : null
=======
          <Text style={styles.emptyText}>Nenhum evento cadastrado.</Text>
>>>>>>> f28fa6f4d3d8036830a9e6f78154ae84b7c596ef
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
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
=======
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerRow: {
    marginBottom: 8,
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
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  chip: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
  },
  price: {
    marginTop: 4,
    fontWeight: '700',
    color: '#111827',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    color: '#6B7280',
>>>>>>> f28fa6f4d3d8036830a9e6f78154ae84b7c596ef
  },
})
