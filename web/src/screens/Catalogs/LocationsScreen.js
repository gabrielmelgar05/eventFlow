import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';
import EmptyState from '../../components/EmptyState';

export default function LocationsScreen({ navigation }) {
  const [locations, setLocations] = useState([]);

  const load = async () => {
    const { data } = await api.get(endpoints.locations);
    setLocations(data ?? []);
  };

  useEffect(() => {
    const unsub = navigation.addListener('focus', load);
    return unsub;
  }, [navigation]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '700' }}>Locais</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('LocationForm')}
        style={{ backgroundColor: '#1E2EFF', padding: 10, borderRadius: 8, marginVertical: 10 }}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>Criar Local +</Text>
      </TouchableOpacity>

      <ScrollView>
        {!locations.length ? <EmptyState message="Sem locais" /> : locations.map((l) => (
          <View key={l.id} style={{ borderBottomWidth: 1, borderColor: '#eee', paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text numberOfLines={1} style={{ flex: 1 }}>{l.name} • {l.latitude},{l.longitude}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('LocationForm', { id: l.id })}>
              <Text style={{ color: '#1E2EFF' }}>Editar</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
