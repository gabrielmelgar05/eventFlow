import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';

export default function EventFormScreen({ route, navigation }) {
  const id = route?.params?.id;
  const [form, setForm] = useState({
    name: '', description: '', date: '', start_time: '', end_time: '',
    price: '', category_id: '', location_id: ''
  });
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      const [c, l] = await Promise.all([api.get(endpoints.categories), api.get(endpoints.locations)]);
      setCategories(c.data ?? []);
      setLocations(l.data ?? []);
      if (id) {
        const { data } = await api.get(endpoints.event(id));
        setForm({
          name: data.name || '',
          description: data.description || '',
          date: data.date || '',
          start_time: data.start_time || '',
          end_time: data.end_time || '',
          price: String(data.price ?? ''),
          category_id: data.category?.id || '',
          location_id: data.location?.id || ''
        });
        setImage(data.image_url ? { uri: data.image_url, readonly: true } : null);
      }
    })();
  }, [id]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Permissão', 'Conceda acesso às imagens.');
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7, mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) setImage(result.assets[0]);
  };

  async function save() {
    try {
      if (image && !image.readonly) {
        // cria com imagem em multipart (ou atualiza)
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => v !== '' && fd.append(k, String(v)));
        fd.append('image', {
          uri: image.uri,
          name: 'event.jpg',
          type: 'image/jpeg',
        });
        if (id) {
          await api.put(endpoints.event(id), fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        } else {
          await api.post(endpoints.eventCreateWithImage, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        }
      } else {
        if (id) await api.put(endpoints.event(id), form);
        else await api.post(endpoints.events, form);
      }
      Alert.alert('Sucesso', 'Evento salvo!');
      navigation.goBack();
    } catch (e) {
      console.log(e?.response?.data || e.message);
      Alert.alert('Erro', 'Não foi possível salvar.');
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: '700' }}>{id ? 'Editar Evento' : 'Cadastrar Evento'}</Text>

      <TouchableOpacity onPress={pickImage} style={{ height: 120, backgroundColor: '#f2f2f2', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
        {image?.uri ? <Image source={{ uri: image.uri }} style={{ width: '100%', height: '100%', borderRadius: 10 }} /> : <Text>Upload</Text>}
      </TouchableOpacity>

      {[
        ['name', 'Nome'],
        ['description', 'Descrição (curta)'],
        ['date', 'Data (YYYY-MM-DD)'],
        ['start_time', 'Hora Inicial (HH:MM)'],
        ['end_time', 'Hora Final (HH:MM)'],
        ['price', 'Preço (numérico)'],
        ['category_id', `Categoria ID (${categories?.length} disponíveis)`],
        ['location_id', `Local ID (${locations?.length} disponíveis)`],
      ].map(([key, label]) => (
        <View key={key}>
          <Text style={{ marginBottom: 6, color: '#666' }}>{label}</Text>
          <TextInput
            value={form[key]}
            onChangeText={(v) => setForm((s) => ({ ...s, [key]: v }))}
            keyboardType={key.includes('price') ? 'numeric' : 'default'}
            style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12 }}
          />
        </View>
      ))}

      <TouchableOpacity onPress={save} style={{ backgroundColor: '#1E2EFF', padding: 14, borderRadius: 10 }}>
        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>{id ? 'Salvar alterações' : 'Salvar'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
