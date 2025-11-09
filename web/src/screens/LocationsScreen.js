import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import Input from '../components/Input';
import { useState } from 'react';

export default function LocationsScreen() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['locs'], queryFn: async () => (await api.get('/locations')).data });

  const [form, setForm] = useState({ name:'', latitude:'', longitude:'', address:'' });

  const create = useMutation({
    mutationFn: async () =>
      api.post('/locations', { ...form, latitude: Number(form.latitude), longitude: Number(form.longitude) }),
    onSuccess: () => { setForm({ name:'', latitude:'', longitude:'', address:'' }); qc.invalidateQueries({ queryKey: ['locs'] }); },
    onError: () => Alert.alert('Erro', 'Falha ao criar local')
  });

  return (
    <View className="flex-1 p-4 bg-white">
      <Input placeholder="Nome" value={form.name} onChangeText={(t)=>setForm(s=>({...s,name:t}))} />
      <Input placeholder="Latitude" value={form.latitude} onChangeText={(t)=>setForm(s=>({...s,latitude:t}))} />
      <Input placeholder="Longitude" value={form.longitude} onChangeText={(t)=>setForm(s=>({...s,longitude:t}))} />
      <Input placeholder="Endereço (opcional)" value={form.address} onChangeText={(t)=>setForm(s=>({...s,address:t}))} />
      <TouchableOpacity onPress={() => create.mutate()} className="bg-blue-600 rounded-lg py-3">
        <Text className="text-white text-center font-semibold">Adicionar</Text>
      </TouchableOpacity>

      <FlatList
        className="mt-4"
        data={data || []}
        keyExtractor={(it)=>String(it.id)}
        renderItem={({item}) => (
          <View className="border-b py-3">
            <Text className="text-base font-semibold">{item.name}</Text>
            <Text className="text-gray-600">{item.latitude}, {item.longitude}</Text>
            {item.address ? <Text className="text-gray-600">{item.address}</Text> : null}
          </View>
        )}
      />
    </View>
  );
}
