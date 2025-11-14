// src/screens/Auth/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import TextInputWithIcon from '@/components/TextInputWithIcon';
import PrimaryButton from '@/components/PrimaryButton';
import { colors } from '@/styles/colors';
import { useAuth } from '@/hooks/useAuth';
import { AuthStackParamList } from '@/navigation/AuthStack';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Preencha e-mail e senha.');
      return;
    }

    try {
      setLoading(true);
      await signIn({ email, password });
      // Se der certo, o RootNavigator já troca pra MainStack
    } catch (error: any) {
      // Se a API devolver 401, mostramos a mensagem Figma-style
      if (error?.response?.status === 401) {
        setErrorMessage('Usuário não cadastrado!');
      } else {
        Alert.alert('Erro', 'Não foi possível entrar. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* LOGO */}
      <View style={styles.logoWrapper}>
        <View style={styles.logoOval}>
          <Text style={styles.logoText}>Logo</Text>
        </View>
      </View>

      {/* FORM */}
      <View style={styles.form}>
        <TextInputWithIcon
          iconName="person-outline"
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

        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

        <PrimaryButton title={loading ? 'Entrando...' : 'Entrar'} onPress={handleLogin} disabled={loading} />

        <Text style={styles.registerText} onPress={() => navigation.navigate('Register')}>
          Não tem conta? Cadastre-se
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
  errorText: {
    color: colors.dangerRed,
    fontSize: 13,
    marginTop: 4,
    marginBottom: 4,
  },
  registerText: {
    marginTop: 16,
    textAlign: 'center',
    color: colors.textDark,
    textDecorationLine: 'underline',
    fontSize: 13,
  },
});
