import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';

export default function LocationFormScreen({ route, navigation }) {
  const id = route?.params?.id;
  const [form, setForm] = useState({ name: '', address: '', latitude: '', longitude: '' });

  useEffect(() => {
    (async () => {
      if (id) {
        const { data } = await api.get(endpoints.location(id));
        setForm({
          name: data.name || '',
          address: data.address || '',
          latitude: String(data.latitude ?? ''),
          longitude: String(data.longitude ?? '')
        });
      }
    })();
  }, [id]);

  const save = async () => {
    try {
      const payload = {
        name: form.name,
        address: form.address || null,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude)
      };
      if (id) await api.put(endpoints.location(id), payload);
      else await api.post(endpoints.locations, payload);
      Alert.alert('Sucesso', 'Local salvo!');
      navigation.goBack();
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar.');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: '700' }}>{id ? 'Editar Local' : 'Cadastrar Local'}</Text>
      {['name','address','latitude','longitude'].map((k) => (
        <View key={k}>
          <Text style={{ marginBottom: 6, color: '#666' }}>
            {k === 'name' ? 'Nome' : k === 'address' ? 'Endereço' : k}
          </Text>
          <TextInput
            value={form[k]}
            onChangeText={(v) => setForm((s) => ({ ...s, [k]: v }))}
            keyboardType={k === 'latitude' || k === 'longitude' ? 'numeric' : 'default'}
            style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12 }}
          />
        </View>
      ))}
      <TouchableOpacity onPress={save} style={{ backgroundColor: '#1E2EFF', padding: 14, borderRadius: 10 }}>
        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>Salvar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
