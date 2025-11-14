import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native';
import Header from '@/components/Header';
import PrimaryButton from '@/components/PrimaryButton';
import { colors } from '@/styles/colors';
import { getLocations, deleteLocation } from '@/api/locations';
import type { Location } from '@/api/events';
import LocationCard from '@/components/LocationCard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MainStackParamList } from '@/navigation/MainStack';

type Props = NativeStackScreenProps<MainStackParamList, 'LocationList'>;

export default function LocationListScreen({ navigation }: Props) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [search, setSearch] = useState('');

  async function load() {
    const data = await getLocations();
    setLocations(data);
  }

  useEffect(() => {
    const unsub = navigation.addListener('focus', load);
    return unsub;
  }, [navigation]);

  const filtered = locations.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header />

      <View style={styles.inner}>
        <Text style={styles.title}>Listagem de Locais</Text>

        <TextInput
          style={styles.input}
          placeholder="Pesquise Locais"
          placeholderTextColor={colors.inputPlaceholder}
          value={search}
          onChangeText={setSearch}
        />

        <PrimaryButton
          title="Criar Local +"
          onPress={() => navigation.navigate('LocationForm')}
        />

        <Text style={styles.counter}>
          Mostrando {filtered.length} de {locations.length} Locais
        </Text>

        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <LocationCard
              location={item}
              onEdit={() => navigation.navigate('LocationForm', { location: item })}
              onDelete={async () => {
                await deleteLocation(item.id);
                load();
              }}
            />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    padding: 16,
  },
  title: { fontWeight: '700', fontSize: 16, marginBottom: 8 },
  input: {
    backgroundColor: colors.inputBackground,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    marginBottom: 8,
  },
  counter: {
    fontSize: 12,
    textAlign: 'right',
    marginVertical: 4,
  },
});
