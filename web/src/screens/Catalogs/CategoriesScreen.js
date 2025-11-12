import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import api from '../../api/client';
import { endpoints } from '../../api/endpoints';
import EmptyState from '../../components/EmptyState';

export default function CategoriesScreen() {
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState('');

  const load = async () => {
    const { data } = await api.get(endpoints.categories);
    setCategories(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!name.trim()) return;
    try {
      if (editing) await api.put(endpoints.category(editing), { name: name.trim() });
      else await api.post(endpoints.categories, { name: name.trim() });
      setName(''); setEditing(null); load();
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar categoria');
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>Categorias</Text>

      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
        <TextInput value={name} onChangeText={setName} placeholder="Nome da categoria"
          style={{ flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12 }} />
        <TouchableOpacity onPress={save} style={{ backgroundColor: '#1E2EFF', padding: 12, borderRadius: 8 }}>
          <Text style={{ color: '#fff' }}>{editing ? 'Atualizar' : 'Salvar'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {!categories.length ? <EmptyState message="Sem categorias" /> : categories.map((c) => (
          <View key={c.id} style={{ borderBottomWidth: 1, borderColor: '#eee', paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>{c.name}</Text>
            <TouchableOpacity onPress={() => { setEditing(c.id); setName(c.name); }}>
              <Text style={{ color: '#1E2EFF' }}>Editar</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
