// src/screens/Auth/RegisterScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import TextInputWithIcon from '@/components/TextInputWithIcon';
import PrimaryButton from '@/components/PrimaryButton';
import { colors } from '@/styles/colors';
import { useAuth } from '@/hooks/useAuth';
import { AuthStackParamList } from '@/navigation/AuthStack';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!name || !email || !password) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    try {
      setLoading(true);
      await signUp({ name, email, password });
      // após cadastrar já entra logado, RootNavigator leva pra MainStack
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cadastrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.logoWrapper}>
        <View style={styles.logoOval}>
          <Text style={styles.logoText}>Logo</Text>
        </View>
      </View>

      <View style={styles.form}>
        <TextInputWithIcon
          iconName="person-outline"
          placeholder="Nome"
          value={name}
          onChangeText={setName}
        />

        <TextInputWithIcon
          iconName="mail-outline"
          placeholder="E-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInputWithIcon
          iconName="key-outline"
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <PrimaryButton
          title={loading ? 'Cadastrando...' : 'Cadastrar'}
          onPress={handleRegister}
          disabled={loading}
        />

        <Text style={styles.loginText} onPress={() => navigation.goBack()}>
          Já tem conta? Entrar
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoOval: {
    width: 160,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.logoBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontWeight: '600',
    color: colors.textDark,
  },
  form: {
    width: '100%',
  },
  loginText: {
    marginTop: 16,
    textAlign: 'center',
    color: colors.textDark,
    textDecorationLine: 'underline',
    fontSize: 13,
  },
});
