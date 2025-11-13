import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native'
import api from '../../api/client'

export default function CategoryScreen() {
  const [name, setName] = useState('')
  const [categories, setCategories] = useState([])

  async function loadCategories() {
    try {
      const res = await api.get('/categories')
      setCategories(res.data)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  async function handleAdd() {
    if (!name.trim()) return
    try {
      await api.post('/categories', { name })
      setName('')
      loadCategories()
    } catch (e) {
      console.log(e)
      Alert.alert('Erro', 'Não foi possível criar a categoria.')
    }
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/categories/${id}`)
      loadCategories()
    } catch (e) {
      console.log(e)
    }
  }

  function renderItem({ item }) {
    return (
      <View style={styles.rowItem}>
        <Text style={styles.rowText}>{item.name}</Text>
        <TouchableOpacity
          style={styles.rowDelete}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.rowDeleteText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <Text style={styles.label}>Nova Categoria</Text>
        <View style={styles.rowInput}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={name}
            onChangeText={setName}
            placeholder="Nome da categoria"
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <Text style={styles.addButtonText}>Adicionar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        style={{ marginTop: 16 }}
        data={categories}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma categoria cadastrada.</Text>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
  },
  field: {
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  rowInput: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#1D4ED8',
    borderRadius: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  rowItem: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowText: {
    fontSize: 14,
  },
  rowDelete: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  rowDeleteText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    color: '#6B7280',
  },
})
