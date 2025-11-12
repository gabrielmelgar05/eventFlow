import React from 'react';
import { View, TextInput } from 'react-native';

export default function SearchBar({ value, onChangeText, placeholder="Pesquisar Eventos" }) {
  return (
    <View style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 10, paddingHorizontal: 12, marginBottom: 12 }}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={{ height: 44 }}
        autoCapitalize="none"
      />
    </View>
  );
}
