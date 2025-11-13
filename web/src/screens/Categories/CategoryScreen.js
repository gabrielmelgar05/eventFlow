import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native'
import api from '../../api/client'

export default function CategoryScreen() {
  const [name, setName] = useState('')
  const [categories, setCategories] = useState([])

  async function loadCategories() {
    try {
      const response = await api.get('/categories')
      setCategories(response.data || [])
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  async function handleSubmit() {
    if (!name) {
      alert('Informe o nome da categoria.')
      return
    }
    try {
      await api.post('/categories', { name })
      setName('')
      await loadCategories()
    } catch (error) {
      console.log(error)
      alert('Erro ao salvar categoria.')
    }
  }

  function renderItem({ item }) {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.name}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categorias</Text>

      <Text style={styles.label}>Nome da Categoria</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Ex: Adoção, Festa, Show"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Salvar Categoria</Text>
      </TouchableOpacity>

      <FlatList
        data={categories}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#0066FF',
    borderRadius: 32,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  cardTitle: {
    fontWeight: '600',
  },
})
