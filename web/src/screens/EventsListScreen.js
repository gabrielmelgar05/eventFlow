import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import { View, FlatList, RefreshControl, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EventCard from '../components/EventCard';
import { useState } from 'react';
import Input from '../components/Input';

async function fetchEvents(q) {
  const { data } = await api.get('/events', { params: { q } });
  return data;
}

export default function EventsListScreen() {
  const nav = useNavigation();
  const [q, setQ] = useState('');
  const { data, refetch, isFetching } = useQuery({ queryKey: ['events', q], queryFn: () => fetchEvents(q) });

  return (
    <View className="flex-1 p-4 bg-gray-50">
      <View className="mb-3">
        <Input placeholder="Buscar por título" value={q} onChangeText={setQ} onSubmitEditing={refetch} />
      </View>

      <FlatList
        data={data || []}
        keyExtractor={(it) => String(it.id)}
        renderItem={({ item }) => (
          <EventCard
            item={item}
            onPress={() => nav.navigate('EventDetail', { id: item.id })}
          />
        )}
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
      />

      <TouchableOpacity
        onPress={() => nav.navigate('EventForm')}
        className="bg-blue-600 rounded-full py-3 px-5 self-end mt-3"
      >
        <Text className="text-white font-semibold">Novo</Text>
      </TouchableOpacity>
    </View>
  );
}
