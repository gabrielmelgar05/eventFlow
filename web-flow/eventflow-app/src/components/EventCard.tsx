// src/components/EventCard.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

import { Event, resolveEventImageUrl } from '@/api/events';
import { colors } from '@/styles/colors';

type Props = {
  event: Event;
  categoryName: string;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void | Promise<void>;
};

export default function EventCard({
  event,
  categoryName,
  onView,
  onEdit,
  onDelete,
}: Props) {
  const imageUrl = resolveEventImageUrl(event.image_path ?? undefined);

  return (
    <View style={styles.card}>
      {/* Imagem no topo (se existir) */}
      {imageUrl && (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      )}

      <View style={styles.content}>
        {/* Linha de título + botão excluir lá em cima (como no Figma) */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name} numberOfLines={1}>
              {event.name}
            </Text>
            <Text style={styles.category} numberOfLines={1}>
              {categoryName}
            </Text>
          </View>

          <TouchableOpacity style={styles.deletePill} onPress={onDelete}>
            <Text style={styles.deletePillText}>Excluir Evento</Text>
          </TouchableOpacity>
        </View>

        {/* Descrição resumida */}
        {!!event.description && (
          <Text style={styles.description} numberOfLines={2}>
            {event.description}
          </Text>
        )}

        {/* Data */}
        <View style={styles.row}>
          <Text style={styles.label}>Data</Text>
          <Text style={styles.value}>{event.event_date}</Text>
        </View>

        {/* Preço + botões */}
        <View style={styles.footerRow}>
          <View>
            <Text style={styles.label}>Ingresso</Text>
            <Text style={styles.price}>R$ {event.price.toFixed(2)}</Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.editButton} onPress={onEdit}>
              <Text style={styles.editButtonText}>✏️ Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.viewButton} onPress={onView}>
              <Text style={styles.viewButtonText}>Ver 🔍</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 140,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
  },
  category: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
  deletePill: {
    backgroundColor: '#E53935',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  deletePillText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  description: {
    fontSize: 12,
    color: '#444',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
  value: {
    fontSize: 12,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#FFC107',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  viewButton: {
    backgroundColor: '#3F0071', // roxo do Figma
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});
