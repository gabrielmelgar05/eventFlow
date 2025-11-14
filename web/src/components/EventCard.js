// src/components/EventCard.js
import React from 'react'
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

export default function EventCard({ event, onPress }) {
  const dateStr = new Date(event.event_date).toLocaleDateString('pt-BR')
  const priceStr = `R$ ${event.price.toFixed(2).replace('.', ',')}`

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {event.image_path && (
        <Image source={{ uri: event.image_path }} style={styles.image} />
      )}

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title} numberOfLines={1}>
              {event.name}
            </Text>
            <Text style={styles.subtitle}>
              {event.category?.name || 'Palestra'}
            </Text>
          </View>
          <Text style={styles.date}>{dateStr}</Text>
        </View>

        <View style={styles.priceBlock}>
          <Text style={styles.priceLabel}>Ingresso</Text>
          <Text style={styles.priceValue}>{priceStr}</Text>
        </View>

        <View style={styles.footerRow}>
          <TouchableOpacity style={styles.moreButton}>
            <Text style={styles.moreButtonText}>Mais Detalhes ▸</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  image: { width: '100%', height: 140 },
  content: { padding: 10 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: { fontSize: 14, fontWeight: '700' },
  subtitle: { fontSize: 11, color: '#777' },
  date: { fontSize: 11, color: '#777' },
  priceBlock: { marginTop: 6, marginBottom: 10 },
  priceLabel: { fontSize: 11, color: '#777' },
  priceValue: { fontSize: 14, fontWeight: '700' },
  footerRow: { alignItems: 'flex-end' },
  moreButton: {
    backgroundColor: '#00008B',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  moreButtonText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
})
