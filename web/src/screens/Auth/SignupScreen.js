import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function SignupScreen() {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function onSubmit() {
    if (!name || !email || !password) return Alert.alert('Atenção', 'Preencha todos os campos');
    try {
      await signup(name.trim(), email.trim(), password);
    } catch {
      Alert.alert('Erro', 'Não foi possível cadastrar');
    }
  }

  return (
    <View style={{ flex: 1, padding: 24, gap: 14, justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: '600', textAlign: 'center' }}>Criar conta</Text>

      <TextInput placeholder="Nome" value={name} onChangeText={setName}
        style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12 }} />

      <TextInput placeholder="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none"
        keyboardType="email-address" style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12 }} />

      <TextInput placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry
        style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12 }} />

      <TouchableOpacity onPress={onSubmit} style={{ backgroundColor: '#1E2EFF', padding: 14, borderRadius: 10 }}>
        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}
