import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Header from '@/components/Header';
import { colors } from '@/styles/colors';
import PrimaryButton from '@/components/PrimaryButton';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import { createLocation, updateLocation } from '@/api/locations';
import type { MainStackParamList } from '@/navigation/MainStack';
import type { Location } from '@/api/events';

type Props = NativeStackScreenProps<MainStackParamList, 'LocationForm'>;

export default function LocationFormScreen({ route, navigation }: Props) {
  const editingLocation: Location | undefined = route.params?.location;

  const [name, setName] = useState(editingLocation?.name ?? '');
  const [address, setAddress] = useState(editingLocation?.address ?? '');
  const [latitude, setLatitude] = useState<number | undefined>(
    editingLocation?.latitude,
  );
  const [longitude, setLongitude] = useState<number | undefined>(
    editingLocation?.longitude,
  );

  const isEditing = !!editingLocation;

  const initialRegion = {
    latitude: latitude ?? -8.76077,
    longitude: longitude ?? -63.89992,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  function handleMapPress(e: MapPressEvent) {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLatitude(latitude);
    setLongitude(longitude);
  }

  async function handleSave() {
    if (!name || !latitude || !longitude) {
      Alert.alert(
        'Campos obrigatórios',
        'Nome, latitude e longitude são obrigatórios (toque no mapa para selecionar).',
      );
      return;
    }

    try {
      if (isEditing) {
        await updateLocation(editingLocation!.id, {
          name,
          latitude,
          longitude,
          address,
        });
      } else {
        await createLocation({
          name,
          latitude,
          longitude,
          address,
        });
      }

      Alert.alert('Sucesso', 'Local salvo com sucesso.');
      navigation.goBack();
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível salvar o local.');
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header />

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <Text style={styles.title}>
          {isEditing ? 'Editar Local' : 'Cadastrar Local'}
        </Text>

        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          onPress={handleMapPress}
        >
          {latitude && longitude && (
            <Marker coordinate={{ latitude, longitude }} />
          )}
        </MapView>

        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="example"
        />

        <Text style={styles.label}>Endereço (opcional)</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Rua, bairro, cidade..."
        />

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Latitude</Text>
            <TextInput
              style={styles.input}
              value={latitude ? String(latitude) : ''}
              editable={false}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Longitude</Text>
            <TextInput
              style={styles.input}
              value={longitude ? String(longitude) : ''}
              editable={false}
            />
          </View>
        </View>

        <View style={{ marginTop: 16 }}>
          <PrimaryButton title="Salvar" onPress={handleSave} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 16, fontWeight: '700', marginTop: 8, marginBottom: 8 },
  map: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 8,
  },
  label: { fontSize: 12, marginTop: 8, marginBottom: 4 },
  input: {
    backgroundColor: colors.inputBackground,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
  },
});
