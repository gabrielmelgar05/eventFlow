// src/screens/Catalogs/CategoriesScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';

export default function CategoriesScreen() {
  const { api } = useAuth();

  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);

  async function loadCategories() {
    try {
      const resp = await api.get('/categories');
      setCategories(resp.data);
    } catch (err) {
      console.log('Erro categorias', err.message);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function handleSave() {
    try {
      if (!name.trim()) return;

      if (editingId) {
        await api.put(`/categories/${editingId}`, { name });
      } else {
        await api.post('/categories', { name });
      }

      setName('');
      setEditingId(null);
      loadCategories();
    } catch (err) {
      console.log('Erro ao salvar categoria', err.message);
    }
  }

  function startEdit(category) {
    setEditingId(category.id);
    setName(category.name);
  }

  function renderItem({ item }) {
    return (
      <View style={styles.catRow}>
        <Text style={styles.catName}>{item.name}</Text>
        <TouchableOpacity onPress={() => startEdit(item)}>
          <Text style={styles.editText}>Editar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categorias</Text>

      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Nome da categoria"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Salvar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingTop: 12 }}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhuma categoria cadastrada</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  saveButton: {
    backgroundColor: '#2f54eb',
    borderRadius: 999,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
  },
  catRow: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  catName: {
    fontSize: 15,
  },
  editText: {
    color: '#2f54eb',
    fontWeight: '600',
  },
  empty: {
    marginTop: 16,
    textAlign: 'center',
    color: '#999',
  },
});
