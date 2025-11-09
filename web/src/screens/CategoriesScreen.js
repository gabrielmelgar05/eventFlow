import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import Input from '../components/Input';
import { useState } from 'react';

export default function CategoriesScreen() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['cats'], queryFn: async () => (await api.get('/categories')).data });
  const [name, setName] = useState('');

  const createMut = useMutation({
    mutationFn: async () => api.post('/categories', { name }),
    onSuccess: () => { setName(''); qc.invalidateQueries({ queryKey: ['cats'] }); },
    onError: () => Alert.alert('Erro', 'Não foi possível criar')
  });

  return (
    <View className="flex-1 p-4 bg-white">
      <Input placeholder="Nova categoria" value={name} onChangeText={setName} />
      <TouchableOpacity onPress={() => createMut.mutate()} className="bg-blue-600 rounded-lg py-3">
        <Text className="text-white text-center font-semibold">Adicionar</Text>
      </TouchableOpacity>

      <FlatList
        className="mt-4"
        data={data || []}
        keyExtractor={(it)=>String(it.id)}
        renderItem={({item}) => (
          <View className="border-b py-3">
            <Text className="text-base">{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
}
