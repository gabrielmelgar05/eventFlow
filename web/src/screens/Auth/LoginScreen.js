// src/screens/Auth/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,          // ⬅️ IMPORTANTE
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Atenção', 'Preencha email e senha.');
      return;
    }

    setLoading(true);

    try {
      await signIn({ email, password });

      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível entrar. Verifique seus dados.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoCircle}>
        <Text style={styles.logoText}>Logo</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Entrar</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.linkText}>Não tem conta? Cadastre-se</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    backgroundColor: '#ffffff',
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555555',
  },
  input: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F3F3',
    paddingHorizontal: 16,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#0047FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  linkText: {
    marginTop: 24,
    textAlign: 'center',
    color: '#0047FF',
    fontSize: 14,
  },
});
