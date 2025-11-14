import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/styles/colors';

type Props = TextInputProps & {
  iconName: keyof typeof Ionicons.glyphMap;
};

export default function TextInputWithIcon({ iconName, style, ...rest }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name={iconName} size={18} color={colors.textDark} style={styles.icon} />
      <TextInput
        placeholderTextColor={colors.inputPlaceholder}
        style={[styles.input, style]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.inputBackground,
    borderRadius: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
    height: 40,
    marginBottom: 12,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.textDark,
  },
});
