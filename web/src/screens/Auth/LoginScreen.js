import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function onSubmit() {
    try {
      await login(email.trim(), password);
    } catch (e) {
      Alert.alert('Erro', 'Credenciais inválidas');
    }
  }

  return (
    <View style={{ flex: 1, padding: 24, gap: 14, justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: '600', textAlign: 'center' }}>EventFlow</Text>

      <TextInput
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12 }}
      />

      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12 }}
      />

      <TouchableOpacity onPress={onSubmit} style={{ backgroundColor: '#1E2EFF', padding: 14, borderRadius: 10 }}>
        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={{ textAlign: 'center', marginTop: 10 }}>Não tem conta? <Text style={{ color: '#1E2EFF' }}>Cadastre-se</Text></Text>
      </TouchableOpacity>
    </View>
  );
}
