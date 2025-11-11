import { View, Text, TouchableOpacity } from 'react-native';
import useAuth from '../hooks/useAuth';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-2xl font-bold mb-2">Perfil</Text>
      <Text className="text-base">Nome: {user?.name}</Text>
      <Text className="text-base">Email: {user?.email}</Text>

      <TouchableOpacity onPress={logout} className="bg-red-600 px-4 py-3 rounded-lg mt-6">
        <Text className="text-white text-center font-semibold">Sair</Text>
      </TouchableOpacity>
    </View>
  );
}
