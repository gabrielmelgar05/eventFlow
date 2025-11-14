import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
} from 'react-native';
import { colors } from '@/styles/colors';

type PrimaryButtonProps = TouchableOpacityProps & {
  /** Texto do botão.
   *  Pode usar `title` ou `label` nas telas. */
  title?: string;
  label?: string;
  /** Estilo do botão */
  variant?: 'primary' | 'secondary';
  /** Se estiver carregando, desabilita o botão e mostra um spinner opcional */
  loading?: boolean;
};

export default function PrimaryButton({
  title,
  label,
  variant = 'primary',
  loading = false,
  style,
  disabled,
  ...rest
}: PrimaryButtonProps) {
  const text = title ?? label ?? '';

  const isSecondary = variant === 'secondary';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isSecondary && styles.secondaryButton,
        style,
        (disabled || loading) && styles.disabledButton,
      ]}
      activeOpacity={0.8}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={colors.textLight} />
      ) : (
        <Text style={[styles.text, isSecondary && styles.secondaryText]}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primaryBlue,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  secondaryButton: {
    backgroundColor: '#E0E0E0',
  },
  disabledButton: {
    opacity: 0.7,
  },
  text: {
    color: colors.textLight,
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryText: {
    color: '#333333',
  },
});
