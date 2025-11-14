// src/screens/Events/EventFormScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import MapView, { MapPressEvent, Marker, Region } from 'react-native-maps';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { colors } from '@/styles/colors';
import type { MainStackParamList } from '@/navigation/MainStack';
import Header from '@/components/Header';
import PrimaryButton from '@/components/PrimaryButton';
import { getCategories } from '@/api/categories';
import { getLocations } from '@/api/locations';
import {
  createEventWithImage,
  EventCreatePayload,
  updateEvent,
  Event,
} from '@/api/events';

type Props = NativeStackScreenProps<MainStackParamList, 'EventForm'>;

type Category = {
  id: number;
  name: string;
};

type Location = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  address?: string | null;
};

const INITIAL_REGION: Region = {
  latitude: -8.76194,
  longitude: -63.90389,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function EventFormScreen({ route, navigation }: Props) {
  const editingEvent: Event | undefined = route.params?.event;

  // campos
  const [name, setName] = useState(editingEvent?.name ?? '');
  const [description, setDescription] = useState(editingEvent?.description ?? '');
  const [date, setDate] = useState(editingEvent?.event_date ?? '');
  const [startTime, setStartTime] = useState(editingEvent?.event_time ?? '');
  const [endTime, setEndTime] = useState(editingEvent?.end_time ?? '');
  const [price, setPrice] = useState(
    editingEvent ? String(editingEvent.price) : '',
  );

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    editingEvent?.category_id ?? null,
  );

  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    editingEvent?.location_id ?? null,
  );

  // mapa para novo local (somente para este evento)
  const [pickedLatLng, setPickedLatLng] = useState<{
    latitude: number;
    longitude: number;
  } | null>(
    editingEvent
      ? {
          latitude: editingEvent.location.latitude,
          longitude: editingEvent.location.longitude,
        }
      : null,
  );
  const [newLocationName, setNewLocationName] = useState('');
  const [newLocationAddress, setNewLocationAddress] = useState('');
  const [mapRegion, setMapRegion] = useState<Region>(INITIAL_REGION);

  // imagens (até 3) – guardando URIs locais
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // listas iniciais
  useEffect(() => {
    async function loadData() {
      try {
        const [cats, locs] = await Promise.all([
          getCategories(),
          getLocations(),
        ]);
        setCategories(cats);
        setLocations(locs);
      } catch (err) {
        Alert.alert('Erro', 'Não foi possível carregar categorias/locais.');
      }
    }
    loadData();
  }, []);

  // === IMAGE PICKER ===
  async function handlePickImage() {
    if (images.length >= 3) {
      Alert.alert('Limite', 'Você pode selecionar no máximo 3 imagens.');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissão necessária',
        'Precisamos de acesso à galeria para escolher imagens.',
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setImages(prev => [...prev, result.assets[0].uri]);
    }
  }

  function handleClearImages() {
    setImages([]);
  }

  // === MAPA: clique para escolher ponto ===
  function handleMapPress(e: MapPressEvent) {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setPickedLatLng({ latitude, longitude });
    setSelectedLocationId(null); // se escolher no mapa, desmarca local cadastrado
  }

  function handleSelectLocation(id: number) {
    setSelectedLocationId(id);
    setPickedLatLng(null); // se escolher local cadastrado, limpa ponto manual
  }

  // === SUBMIT ===
  async function handleSubmit() {
    if (!name.trim()) {
      Alert.alert('Validação', 'Informe o nome do evento.');
      return;
    }
    if (!date.trim()) {
      Alert.alert('Validação', 'Informe a data do evento (yyyy-mm-dd).');
      return;
    }
    if (!startTime.trim()) {
      Alert.alert('Validação', 'Informe o horário inicial (hh:mm:ss).');
      return;
    }
    if (!selectedCategoryId) {
      Alert.alert('Validação', 'Selecione a categoria.');
      return;
    }

    if (!selectedLocationId && !pickedLatLng) {
      Alert.alert(
        'Validação',
        'Selecione um local cadastrado ou marque no mapa.',
      );
      return;
    }

    const payload: EventCreatePayload = {
      name,
      description,
      event_date: date,
      event_time: startTime,
      end_time: endTime || undefined,
      price: Number(price) || 0,
      category_id: selectedCategoryId,
    };

    // modo 1 – local cadastrado
    if (selectedLocationId) {
      payload.location_id = selectedLocationId;
    }

    // modo 2 – ponto no mapa (somente para este evento)
    if (!selectedLocationId && pickedLatLng) {
      payload.latitude = pickedLatLng.latitude;
      payload.longitude = pickedLatLng.longitude;
      payload.new_location_name =
        newLocationName.trim() || 'Local temporário do evento';
      if (newLocationAddress.trim()) {
        payload.address = newLocationAddress.trim();
      }
    }

    try {
      setLoading(true);

      if (!editingEvent) {
        // CRIAÇÃO
        await createEventWithImage(payload, images);
        Alert.alert('Sucesso', 'Evento criado com sucesso!');
      } else {
        // EDIÇÃO (sem trocar imagem por enquanto)
        await updateEvent(editingEvent.id, payload);
        Alert.alert('Sucesso', 'Evento atualizado com sucesso!');
      }

      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível salvar o evento.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
      >
        <Text style={styles.screenTitle}>
          {editingEvent ? 'Editar Evento' : 'Cadastrar Evento'}
        </Text>

        {/* Imagens */}
        <View style={styles.imageRow}>
          {images.map(uri => (
            <View key={uri} style={styles.imagePreviewBox}>
              <Text style={styles.imagePreviewText}>Imagem selecionada</Text>
            </View>
          ))}

          {images.length < 3 && (
            <TouchableOpacity
              style={styles.uploadBox}
              onPress={handlePickImage}
            >
              <Text style={styles.uploadText}>Upload</Text>
            </TouchableOpacity>
          )}
        </View>

        {images.length > 0 && (
          <TouchableOpacity
            style={styles.clearImagesButton}
            onPress={handleClearImages}
          >
            <Text style={styles.clearImagesText}>Limpar imagens</Text>
          </TouchableOpacity>
        )}

        {/* Nome */}
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Nome do evento"
        />

        {/* Descrição */}
        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          value={description}
          onChangeText={setDescription}
          multiline
          placeholder="Descrição do evento"
        />

        {/* Categoria */}
        <Text style={styles.label}>Categoria</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.chip,
                  selectedCategoryId === cat.id && styles.chipSelected,
                ]}
                onPress={() => setSelectedCategoryId(cat.id)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedCategoryId === cat.id && styles.chipTextSelected,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Data */}
        <Text style={styles.label}>Data do Evento</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
        />

        {/* Horário */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Horário Inicial</Text>
            <TextInput
              style={styles.input}
              value={startTime}
              onChangeText={setStartTime}
              placeholder="HH:MM:SS"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Horário Final</Text>
            <TextInput
              style={styles.input}
              value={endTime}
              onChangeText={setEndTime}
              placeholder="HH:MM:SS"
            />
          </View>
        </View>

        {/* Preço */}
        <Text style={styles.label}>Preço</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          placeholder="Ex: 25.00"
        />

        {/* Locais cadastrados */}
        <Text style={styles.label}>Selecione os Locais Cadastrados</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {locations.map(loc => (
              <TouchableOpacity
                key={loc.id}
                style={[
                  styles.chip,
                  selectedLocationId === loc.id && styles.chipSelected,
                ]}
                onPress={() => handleSelectLocation(loc.id)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedLocationId === loc.id && styles.chipTextSelected,
                  ]}
                >
                  {loc.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <Text style={styles.orText}>Ou</Text>
        <Text style={styles.label}>Marque no mapa o local desejado</Text>

        <MapView
          style={styles.map}
          initialRegion={mapRegion}
          onRegionChangeComplete={setMapRegion}
          onPress={handleMapPress}
        >
          {pickedLatLng && <Marker coordinate={pickedLatLng} />}
        </MapView>

        {/* Nome / endereço do novo local (somente se marcar no mapa) */}
        <Text style={styles.label}>Nome do novo local</Text>
        <TextInput
          style={styles.input}
          value={newLocationName}
          onChangeText={setNewLocationName}
          placeholder="Ex: Praça Central"
        />

        <Text style={styles.label}>Endereço (opcional)</Text>
        <TextInput
          style={styles.input}
          value={newLocationAddress}
          onChangeText={setNewLocationAddress}
          placeholder="Rua, número, bairro..."
        />

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Latitude</Text>
            <TextInput
              style={styles.input}
              value={pickedLatLng ? String(pickedLatLng.latitude) : ''}
              editable={false}
              placeholder="Latitude"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Longitude</Text>
            <TextInput
              style={styles.input}
              value={pickedLatLng ? String(pickedLatLng.longitude) : ''}
              editable={false}
              placeholder="Longitude"
            />
          </View>
        </View>

        <View style={{ marginTop: 24, flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <PrimaryButton title="Salvar" onPress={handleSubmit} loading={loading} />
          </View>
          <View style={{ flex: 1 }}>
            <PrimaryButton
              title="Cancelar"
              variant="secondary"
              onPress={() => navigation.goBack()}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 12,
  },
  imageRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  imagePreviewBox: {
    flex: 1,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePreviewText: {
    fontSize: 12,
    color: '#555',
  },
  uploadBox: {
    flex: 1,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#d9d9d9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    fontWeight: '600',
  },
  clearImagesButton: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  clearImagesText: {
    fontSize: 12,
    color: '#777',
    textDecorationLine: 'underline',
  },
  label: {
    marginTop: 8,
    marginBottom: 4,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#e6e6e6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#d9d9d9',
  },
  chipSelected: {
    backgroundColor: colors.primaryBlue,
  },
  chipText: {
    fontSize: 13,
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 8,
    fontWeight: '600',
  },
  map: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    marginBottom: 8,
  },
});
