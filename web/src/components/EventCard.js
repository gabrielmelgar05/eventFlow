import { View, Text, Image, TouchableOpacity } from 'react-native';

export default function EventCard({ item, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} className="bg-white rounded-xl p-3 mb-3 shadow">
      {item.image_url ? (
        <Image source={{ uri: process.env.EXPO_PUBLIC_API_URL + item.image_url }} className="h-40 rounded-md mb-2" />
      ) : null}
      <Text className="text-lg font-semibold">{item.title}</Text>
      <Text className="text-gray-600">{item.date} • {item.time}</Text>
      <Text className="text-gray-700">R$ {Number(item.price).toFixed(2)}</Text>
      {item.category?.name ? <Text className="text-gray-500 mt-1">Categoria: {item.category.name}</Text> : null}
    </TouchableOpacity>
  );
}
