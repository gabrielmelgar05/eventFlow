import * as ImagePicker from 'expo-image-picker';
import api from '../api/client';
import { View, Text, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import { useEffect, useState } from 'react';
import Input from '../components/Input';

async function fetchBasics() {
  const [cats, locs] = await Promise.all([api.get('/categories'), api.get('/locations')]);
  return { categories: cats.data, locations: locs.data };
}
async function fetchOne(id) { const { data } = await api.get(`/events/${id}`); return data; }

export default function EventFormScreen({ route, navigation }) {
  const editId = route.params?.editId;
  const [form, setForm] = useState({
    title: '', description: '', date: '', time: '', price: '0', category_id: '', location_id: '',
  });
  const [img, setImg] = useState(null);
  const [cats, setCats] = useState([]); const [locs, setLocs] = useState([]);

  useEffect(() => {
    fetchBasics().then(({categories, locations}) => { setCats(categories); setLocs(locations); });
    if (editId) fetchOne(editId).then(e => setForm({
      title: e.title, description: e.description || '', date: e.date, time: e.time,
      price: String(e.price), category_id: String(e.category_id), location_id: String(e.location_id)
    }));
  }, [editId]);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!res.canceled) setImg(res.assets[0]);
  };

  const submit = async () => {
    try {
      const data = new FormData();
      Object.entries({
        ...form,
        price: Number(form.price || 0),
        category_id: Number(form.category_id),
        location_id: Number(form.location_id)
      }).forEach(([k,v]) => data.append(k, String(v)));

      if (img) {
        data.append('image', {
          uri: img.uri,
          name: 'upload.jpg',
          type: 'image/jpeg',
        });
      }

      if (editId) await api.put(`/events/${editId}`, data, { headers: { 'Content-Type': 'multipart/form-data' }});
      else await api.post('/events', data, { headers: { 'Content-Type': 'multipart/form-data' }});
      Alert.alert('OK', 'Salvo com sucesso');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro', 'Falha ao salvar');
    }
  };

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      <Input placeholder="Título" value={form.title} onChangeText={(t)=>setForm(s=>({...s,title:t}))} />
      <Input placeholder="Descrição" value={form.description} onChangeText={(t)=>setForm(s=>({...s,description:t}))} />
      <Input placeholder="Data (YYYY-MM-DD)" value={form.date} onChangeText={(t)=>setForm(s=>({...s,date:t}))} />
      <Input placeholder="Hora (HH:MM:SS)" value={form.time} onChangeText={(t)=>setForm(s=>({...s,time:t}))} />
      <Input placeholder="Preço" keyboardType="numeric" value={form.price} onChangeText={(t)=>setForm(s=>({...s,price:t}))} />
      <Input placeholder="Categoria ID" value={String(form.category_id)} onChangeText={(t)=>setForm(s=>({...s,category_id:t}))} />
      <Input placeholder="Local ID" value={String(form.location_id)} onChangeText={(t)=>setForm(s=>({...s,location_id:t}))} />

      {img && <Image source={{ uri: img.uri }} className="h-40 rounded-lg my-3" />}
      <View className="flex-row gap-3 mt-2">
        <TouchableOpacity onPress={pickImage} className="bg-gray-200 px-4 py-3 rounded-lg"><Text>Escolher imagem</Text></TouchableOpacity>
        <TouchableOpacity onPress={submit} className="bg-blue-600 px-4 py-3 rounded-lg"><Text className="text-white font-semibold">Salvar</Text></TouchableOpacity>
      </View>
    </ScrollView>
  );
}
