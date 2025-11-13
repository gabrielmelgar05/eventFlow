import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Picker } from '@react-native-picker/picker'
import api from '../../api/client'

function formatDate(date) {
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

function formatTime(date) {
  const d = new Date(date)
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

function formatCurrencyInput(value) {
  const onlyNumbers = value.replace(/\D/g, '')
  const intValue = parseInt(onlyNumbers || '0', 10)
  const cents = intValue / 100
  return cents.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function parseCurrencyToNumber(formatted) {
  const onlyNumbers = formatted.replace(/\D/g, '')
  const intValue = parseInt(onlyNumbers || '0', 10)
  return intValue / 100
}

export default function EventFormScreen() {
  const navigation = useNavigation()
  const route = useRoute()

  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [description, setDescription] = useState('')
  const [priceText, setPriceText] = useState('R$ 0,00')

  const [categories, setCategories] = useState([])
  const [locations, setLocations] = useState([])
  const [categoryId, setCategoryId] = useState(null)
  const [locationId, setLocationId] = useState(null)

  const [date, setDate] = useState(new Date())
  const [time, setTime] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCategories()
    loadLocations()
  }, [])

  useEffect(() => {
    if (route.params && route.params.locationFromMap) {
      const loc = route.params.locationFromMap
      setLocationId(loc.id)
    }
  }, [route.params])

  async function loadCategories() {
    try {
      const response = await api.get('/categories')
      setCategories(response.data || [])
    } catch (error) {
      console.log(error)
    }
  }

  async function loadLocations() {
    try {
      const response = await api.get('/locations')
      setLocations(response.data || [])
    } catch (error) {
      console.log(error)
    }
  }

  function handleOpenDatePicker() {
    setShowDatePicker(true)
  }

  function handleOpenTimePicker() {
    setShowTimePicker(true)
  }

  function onChangeDate(event, selectedDate) {
    setShowDatePicker(false)
    if (selectedDate) {
      if (selectedDate < new Date()) {
        setDate(new Date())
      } else {
        setDate(selectedDate)
      }
    }
  }

  function onChangeTime(event, selectedTime) {
    setShowTimePicker(false)
    if (selectedTime) {
      setTime(selectedTime)
    }
  }

  function handlePriceChange(text) {
    const formatted = formatCurrencyInput(text)
    setPriceText(formatted)
  }

  function handleOpenMap() {
    navigation.navigate('EventMapScreen')
  }

  function handleOpenCategories() {
    navigation.navigate('CategoryScreen')
  }

  async function handleSubmit() {
    if (!name || !categoryId || !locationId) {
      alert('Preencha nome, categoria e local do evento.')
      return
    }

    setLoading(true)
    try {
      const eventDate = date.toISOString().split('T')[0]
      const eventTime = `${String(time.getHours()).padStart(2, '0')}:${String(
        time.getMinutes()
      ).padStart(2, '0')}:00`
      const priceNumber = parseCurrencyToNumber(priceText)

      const payload = {
        name,
        description,
        event_date: eventDate,
        event_time: eventTime,
        price: priceNumber,
        category_id: Number(categoryId),
        location_id: Number(locationId),
      }

      await api.post('/events', payload)
      alert('Evento cadastrado com sucesso!')
      navigation.goBack()
    } catch (error) {
      console.log(error)
      alert('Erro ao cadastrar evento.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.row}>
        <View style={styles.uploadBox}>
          <Text style={styles.uploadText}>Upload</Text>
        </View>
        <View style={styles.rowRight}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Nome do evento"
          />
          <Text style={styles.label}>Tipo</Text>
          <TextInput
            style={styles.input}
            value={type}
            onChangeText={setType}
            placeholder="Ex: Adoção, Campanha"
          />
        </View>
      </View>

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        multiline
        textAlignVertical="top"
        value={description}
        onChangeText={setDescription}
        placeholder="Descrição do evento"
      />

      <View style={styles.labelRow}>
        <Text style={styles.label}>Categoria</Text>
        <TouchableOpacity onPress={handleOpenCategories}>
          <Text style={styles.linkText}>Gerenciar categorias</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={categoryId}
          onValueChange={value => setCategoryId(value)}
        >
          <Picker.Item label="Selecione uma categoria" value={null} />
          {categories.map(cat => (
            <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.sectionTitle}>Data e Horário</Text>

      <View style={styles.row}>
        <View style={styles.rowItem}>
          <Text style={styles.label}>Data do Evento</Text>
          <TouchableOpacity onPress={handleOpenDatePicker} style={styles.input}>
            <Text>{formatDate(date)}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rowItem}>
          <Text style={styles.label}>Horário</Text>
          <TouchableOpacity onPress={handleOpenTimePicker} style={styles.input}>
            <Text>{formatTime(time)}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.label}>Valor do Ingresso</Text>
      <TextInput
        style={styles.input}
        value={priceText}
        onChangeText={handlePriceChange}
        keyboardType="numeric"
      />

      <Text style={styles.sectionTitle}>Local do Evento</Text>
      <Text style={styles.helperText}>Selecione os Locais Cadastrados</Text>

      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={locationId}
          onValueChange={value => setLocationId(value)}
        >
          <Picker.Item label="Selecione um local" value={null} />
          {locations.map(loc => (
            <Picker.Item key={loc.id} label={loc.name} value={loc.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.orText}>Ou</Text>

      <TouchableOpacity style={styles.mapPreview} onPress={handleOpenMap}>
        <Text style={styles.mapPreviewText}>Marque no Mapa o Local Desejado</Text>
      </TouchableOpacity>

      <View style={styles.footerButtons}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonTextCancel}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonTextSubmit}>
            {loading ? 'Salvando...' : 'Cadastrar'}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showDatePicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione a data</Text>
            <DateTimePicker
              value={date}
              mode="date"
              display="spinner"
              minimumDate={new Date()}
              onChange={onChangeDate}
              style={styles.dateTimePicker}
            />
            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={[styles.button, styles.modalCancelButton]}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.buttonTextCancel}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.modalConfirmButton]}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.buttonTextSubmit}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showTimePicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione o horário</Text>
            <DateTimePicker
              value={time}
              mode="time"
              display="spinner"
              onChange={onChangeTime}
              style={styles.dateTimePicker}
            />
            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={[styles.button, styles.modalCancelButton]}
                onPress={() => setShowTimePicker(false)}
              >
                <Text style={styles.buttonTextCancel}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.modalConfirmButton]}
                onPress={() => setShowTimePicker(false)}
              >
                <Text style={styles.buttonTextSubmit}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadBox: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  uploadText: {
    color: '#555555',
  },
  rowRight: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 4,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  textArea: {
    height: 100,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  linkText: {
    color: '#0066FF',
    fontWeight: '500',
  },
  pickerWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    marginTop: 4,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 4,
  },
  rowItem: {
    flex: 1,
  },
  helperText: {
    color: '#666666',
    marginBottom: 4,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 8,
    color: '#666666',
  },
  mapPreview: {
    backgroundColor: '#DDE7FF',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  mapPreviewText: {
    color: '#333333',
    fontWeight: '500',
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 32,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FF4B4B',
  },
  submitButton: {
    backgroundColor: '#0066FF',
  },
  buttonTextCancel: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  buttonTextSubmit: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  dateTimePicker: {
    height: 150,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#E5E5E5',
  },
  modalConfirmButton: {
    flex: 1,
    backgroundColor: '#0066FF',
  },
})
