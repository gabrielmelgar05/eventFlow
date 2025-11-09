import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import Input from '../components/Input';
import useAuth from '../hooks/useAuth';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@demo.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    try {
      setLoading(true);
      await login(email, password);
    } catch (e) {
      Alert.alert('Erro', 'Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-2xl font-bold mb-4">EventFlow</Text>
      <Input placeholder="E-mail" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
      <Input placeholder="Senha" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity onPress={onSubmit} disabled={loading} className="bg-blue-500 py-3 rounded-lg mt-2">
        <Text className="text-white text-center font-semibold">{loading ? 'Entrando...' : 'Entrar'}</Text>
      </TouchableOpacity>
    </View>
  );
}
