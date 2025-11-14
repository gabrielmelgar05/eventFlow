import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { colors } from '@/styles/colors';
import PrimaryButton from '@/components/PrimaryButton';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header />

      <View style={styles.inner}>
        <Text style={styles.title}>Perfil</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Nome</Text>
          <Text>{user?.name}</Text>

          <Text style={styles.label}>Email</Text>
          <Text>{user?.email}</Text>
        </View>

        <PrimaryButton title="Sair" onPress={signOut} style={{ marginTop: 24 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inner: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  card: {
    backgroundColor: colors.cardBackground,
    padding: 16,
    borderRadius: 12,
  },
  label: {
    fontWeight: '700',
    marginTop: 8,
  },
});
