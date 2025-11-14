import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { Location } from '@/api/events';
import { colors } from '@/styles/colors';

type Props = {
  location: Location;
  onEdit: () => void;
  onDelete: () => void;
};

export default function LocationCard({ location, onEdit, onDelete }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{location.name}</Text>
      <Text style={styles.address}>{location.address}</Text>
      <Text style={styles.coords}>
        Lat: {location.latitude.toFixed(5)} | Long: {location.longitude.toFixed(5)}
      </Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <Text>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={{ color: colors.textLight }}>Excluir Local</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  name: {
    fontWeight: '600',
    fontSize: 14,
  },
  address: {
    fontSize: 12,
    marginTop: 2,
  },
  coords: {
    fontSize: 11,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
    backgroundColor: colors.inputBackground,
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
    backgroundColor: colors.dangerRed,
  },
});
