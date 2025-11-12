// web/src/components/Header.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Header({ title = 'EventFlow', onMenuPress }) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Logo</Text>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity
        accessibilityRole="button"
        onPress={onMenuPress}
        style={styles.menuBtn}
      >
        <Text style={styles.menuTxt}>≡</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E6E6E6',
  },
  logo: {
    fontWeight: '700',
    fontSize: 16,
    color: '#111',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  menuBtn: { padding: 8 },
  menuTxt: { fontSize: 20, fontWeight: '700' },
});
