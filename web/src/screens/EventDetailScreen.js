import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';

async function fetchEvent(id) {
  const { data } = await api.get(`/events/${id}`);
  return data;
}

export default function EventDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const { data } = useQuery({ queryKey: ['event', id], queryFn: () => fetchEvent(id) });

  const onDelete = async () => {
    try {
      await api.delete(`/events/${id}`);
      Alert.alert('OK', 'Evento removido');
      navigation.goBack();
    } catch {
      Alert.alert('Erro', 'Não foi possível remover');
    }
  };

  if (!data) return null;

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      {data.image_url ? (
        <Image className="h-56 rounded-lg mb-3" source={{ uri: process.env.EXPO_PUBLIC_API_URL + data.image_url }} />
      ) : null}
      <Text className="text-2xl font-bold">{data.title}</Text>
      <Text className="text-gray-700 mt-1">{data.date} • {data.time}</Text>
      <Text className="text-gray-700 mt-1">R$ {Number(data.price).toFixed(2)}</Text>
      {data.category?.name && <Text className="text-gray-600 mt-1">Categoria: {data.category.name}</Text>}
      {data.location?.name && <Text className="text-gray-600">Local: {data.location.name}</Text>}
      {data.location?.address && <Text className="text-gray-500">{data.location.address}</Text>}
      {data.description && <Text className="mt-3">{data.description}</Text>}

      <View className="flex-row gap-3 mt-6">
        <TouchableOpacity onPress={() => navigation.navigate('EventForm', { editId: id })} className="bg-blue-600 px-4 py-3 rounded-lg">
          <Text className="text-white font-semibold">Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} className="bg-red-600 px-4 py-3 rounded-lg">
          <Text className="text-white font-semibold">Excluir</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
