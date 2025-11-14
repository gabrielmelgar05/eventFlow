// src/screens/Events/EventDetailScreen.js
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useEvents } from '../../hooks/useEvents'
import { getEventById } from '../../api/events' // Importar diretamente a API

export default function EventDetailScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const { eventId } = route.params || {}

  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      if (!eventId) {
          if (mounted) setLoading(false);
          return;
      }
      try {
        const data = await getEventById(eventId)
        if (mounted) setEvent(data)
      } catch (e) {
        console.error("Erro ao carregar detalhes do evento:", e);
        Alert.alert("Erro", "Não foi possível carregar os detalhes do evento.");
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [eventId])

  if (loading || !event) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#0011FF"/>
      </SafeAreaView>
    )
  }

  const dateStr = new Date(event.event_date).toLocaleDateString('pt-BR')
  const startTimeStr = event.event_time?.slice(0, 5) || 'N/A'
  const endTimeStr = event.end_time ? event.end_time.slice(0, 5) : null
  
  const timeDisplay = endTimeStr ? `${startTimeStr}h – ${endTimeStr}h` : `${startTimeStr}h`
  
  const priceStr = `R$ ${event.price.toFixed(2).replace('.', ',')}`

  const hasLocation = !!event.location
  const region =
    hasLocation && {
      latitude: event.location.latitude,
      longitude: event.location.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          {event.image_path && (
            <Image source={{ uri: event.image_path }} style={styles.image} />
          )}

          <View style={styles.cardContent}>
            <View style={styles.titleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title} numberOfLines={2}>
                  {event.name}
                </Text>
                <Text style={styles.subtitle}>
                  {event.category?.name || 'Palestra'}
                </Text>
              </View>
              <Text style={styles.date}>{dateStr}</Text>
            </View>

            <Text style={styles.description}>{event.description}</Text>

            <View style={styles.infoBlock}>
              <Text style={styles.infoTitle}>Informações do Evento</Text>
              <View style={styles.infoRow}>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>Data</Text>
                  <Text style={styles.infoValue}>{dateStr}</Text>
                </View>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>Horário</Text>
                  <Text style={styles.infoValue}>{timeDisplay}</Text>
                </View>
              </View>
            </View>

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Valor Ingresso</Text>
              <Text style={styles.priceValue}>{priceStr}</Text>
              <View style={styles.priceButton} /> 
            </View>

            <Text style={styles.locationTitle}>📍 Localização</Text>

            {hasLocation && (
              <View style={styles.mapContainer}>
                <MapView style={styles.map} initialRegion={region}>
                  <Marker
                    coordinate={{
                      latitude: event.location.latitude,
                      longitude: event.location.longitude,
                    }}
                    title={event.location.name}
                  />
                </MapView>
              </View>
            )}

            {hasLocation && (
              <View style={styles.addressBlock}>
                <Text style={styles.addressText}>
                  <Text style={styles.addressLabel}>Endereço: </Text>
                  {event.location.address || 'Não informado'}
                </Text>
                {/* Outras Infos que estavam no Figma */}
                <Text style={styles.addressSubtext}>
                    Bairro: Aurora, Solaris City – SP
                </Text>
                <Text style={styles.addressSubtext}>
                    Ponto de Referência: Próximo ao Lago da Lua e ao Shopping Estação Aurora
                </Text>
              </View>
            )}
          </View>
        </View>
        {/* Barra de Ação (Criar Conta/Continuar) - Mock */}
        <View style={styles.bottomBar}>
            <Text style={styles.bottomBarText}>
                Cadastre-se para comentar, editar, inspecionar e outras ações.
            </Text>
            <View style={styles.bottomBarButtons}>
                <TouchableOpacity style={styles.bottomBarButton1}>
                    <Text style={styles.bottomBarButtonText1}>Crie sua conta</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomBarButton2}>
                    <Text style={styles.bottomBarButtonText2}>Continuar</Text>
                </TouchableOpacity>
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F4F4' },
  scroll: { padding: 16, paddingBottom: 100 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 8,
  },
  backButtonText: { fontSize: 13 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  image: { width: '100%', height: 180, resizeMode: 'cover' },
  cardContent: { padding: 16 },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: { fontSize: 18, fontWeight: '700' },
  subtitle: { fontSize: 13, color: '#666' },
  date: { fontSize: 13, color: '#666' },
  description: { fontSize: 14, color: '#444', marginTop: 12, marginBottom: 16, lineHeight: 20 },
  infoBlock: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 12,
    marginBottom: 16,
  },
  infoTitle: {
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 12,
    fontSize: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoCol: { flex: 1, alignItems: 'center' },
  infoLabel: { fontSize: 12, color: '#777' },
  infoValue: { fontSize: 14, fontWeight: '700', marginTop: 4 },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E0FF', // Fundo azul claro para o bloco de preço
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 20,
    justifyContent: 'space-between'
  },
  priceLabel: {
    fontWeight: '700',
    fontSize: 14,
    color: '#333'
  },
  priceValue: {
    fontWeight: '900',
    fontSize: 16,
    color: '#00008B',
    // Mock do botão 'R$ 800'
    backgroundColor: '#00008B',
    color: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16
  },
  priceButton: {
    // Vazio, a lógica de preço está no priceValue
  },
  locationTitle: {
    fontWeight: '700',
    marginBottom: 10,
    fontSize: 15,
  },
  mapContainer: {
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc'
  },
  map: { flex: 1 },
  addressBlock: { marginTop: 4 },
  addressLabel: { fontWeight: '700', fontSize: 14, color: '#333' },
  addressText: { fontSize: 14, color: '#444', marginBottom: 4 },
  addressSubtext: { fontSize: 12, color: '#666', marginBottom: 2 },
  
  // Estilos da Barra Inferior (Figma)
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0011FF',
    padding: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomBarText: {
    flex: 1,
    color: '#FFF',
    fontSize: 12,
    marginRight: 10,
  },
  bottomBarButtons: {
      flexDirection: 'row',
      gap: 8,
  },
  bottomBarButton1: {
      backgroundColor: '#FFF',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 16
  },
  bottomBarButtonText1: {
      color: '#0011FF',
      fontWeight: '600',
      fontSize: 12
  },
  bottomBarButton2: {
      backgroundColor: 'transparent',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#FFF',
  },
  bottomBarButtonText2: {
      color: '#FFF',
      fontWeight: '600',
      fontSize: 12
  },
})