// src/components/Header.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '@/styles/colors';
import type { MainStackParamList } from '@/navigation/MainStack';

export default function Header() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  return (
    <View style={styles.container}>
      {/* Logo em forma de texto, igual Figma */}
      <View style={styles.logoWrapper}>
        <View style={styles.logoOval}>
          <Text style={styles.logoText}>Logo</Text>
        </View>
      </View>

      {/* Botão menu (vai pra tela de Perfil) */}
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Ionicons name="menu-outline" size={26} color={colors.textDark} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoOval: {
    width: 120,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.logoBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontWeight: '600',
    color: colors.textDark,
  },
});
