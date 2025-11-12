import React from 'react';
import { View, Text } from 'react-native';

export default function EmptyState({ message = "Nenhum item encontrado" }) {
  return (
    <View style={{ padding: 24, alignItems: 'center' }}>
      <Text style={{ color: '#888' }}>{message}</Text>
    </View>
  );
}
