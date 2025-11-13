import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
<<<<<<< HEAD
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
=======
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'
import api from '../../api/client'
import { Picker } from '@react-native-picker/picker'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { format } from 'date-fns'
import MapView, { Marker } from 'react-native-maps'

function formatCurrencyBR(value) {
  const onlyDigits = value.replace(/\D/g, '')
  const number = Number(onlyDigits) / 100
  if (Number.isNaN(number)) return 'R$ 0,00'
  return number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
>>>>>>> f28fa6f4d3d8036830a9e6f78154ae84b7c596ef
}

export default function EventFormScreen() {
  const navigation = useNavigation()
  const route = useRoute()

<<<<<<< HEAD
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
=======
  const [image, setImage] = useState(null)
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [description, setDescription] = useState('')
  const [categories, setCategories] = useState([])
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  const [locations, setLocations] = useState([])
  const [selectedLocationId, setSelectedLocationId] = useState(null)
  const [eventDate, setEventDate] = useState(new Date())
  const [startTime, setStartTime] = useState(new Date())
  const [endTime, setEndTime] = useState(new Date())
  const [ticketDisplay, setTicketDisplay] = useState('R$ 0,00')
  const [ticketValue, setTicketValue] = useState(0)
  const [isDatePickerVisible, setDatePickerVisible] = useState(false)
  const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false)
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false)

  const selectedLocationObj = locations.find((l) => l.id === selectedLocationId)

  useEffect(() => {
    if (route.params?.locationCreatedId) {
      setSelectedLocationId(route.params.locationCreatedId)
    }
  }, [route.params?.locationCreatedId])
>>>>>>> f28fa6f4d3d8036830a9e6f78154ae84b7c596ef

  useEffect(() => {
    loadCategories()
    loadLocations()
  }, [])

<<<<<<< HEAD
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
=======
  async function loadCategories() {
    try {
      const res = await api.get('/categories')
      setCategories(res.data)
    } catch (e) {
      console.log(e)
>>>>>>> f28fa6f4d3d8036830a9e6f78154ae84b7c596ef
    }
  }

  async function loadLocations() {
    try {
<<<<<<< HEAD
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
=======
      const res = await api.get('/locations')
      setLocations(res.data)
    } catch (e) {
      console.log(e)
    }
  }

  async function handlePickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    })
    if (!result.canceled) {
      setImage(result.assets[0])
    }
  }

  function validate() {
    if (!name.trim()) {
      Alert.alert('Atenção', 'Informe o nome do evento.')
      return false
    }
    if (!selectedCategoryId) {
      Alert.alert('Atenção', 'Selecione uma categoria.')
      return false
    }
    if (!selectedLocationId) {
      Alert.alert('Atenção', 'Selecione o local do evento.')
      return false
    }
    return true
  }

  async function handleSubmit() {
    if (!validate()) return

    try {
      const payload = {
        name,
        description,
        event_date: format(eventDate, 'yyyy-MM-dd'),
        start_time: format(startTime, 'HH:mm:ss'),
        end_time: format(endTime, 'HH:mm:ss'),
        price: ticketValue,
        category_id: selectedCategoryId,
        location_id: selectedLocationId,
      }

      let created
      if (image) {
        const form = new FormData()
        Object.entries(payload).forEach(([key, value]) => {
          form.append(key, String(value))
        })
        const uriParts = image.uri.split('.')
        const ext = uriParts[uriParts.length - 1]
        form.append('file', {
          uri: image.uri,
          name: `event.${ext}`,
          type: `image/${ext}`,
        })
        const res = await api.post('/events/create-with-image', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        created = res.data
      } else {
        const res = await api.post('/events', payload)
        created = res.data
      }

      if (created) {
        Alert.alert('Sucesso', 'Evento cadastrado com sucesso!')
        navigation.navigate('EventosTab')
      }
    } catch (e) {
      console.log(e)
      Alert.alert('Erro', 'Não foi possível salvar o evento.')
>>>>>>> f28fa6f4d3d8036830a9e6f78154ae84b7c596ef
    }
  }

  return (
<<<<<<< HEAD
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
=======
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.rowHorizontal}>
        <TouchableOpacity style={styles.uploadBox} onPress={handlePickImage}>
          {image ? (
            <Image source={{ uri: image.uri }} style={styles.uploadImage} />
          ) : (
            <Text style={styles.uploadText}>Upload</Text>
          )}
        </TouchableOpacity>

        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={styles.field}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Nome do evento"
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Tipo</Text>
            <TextInput
              style={styles.input}
              value={type}
              onChangeText={setType}
              placeholder="Tipo do evento"
            />
          </View>
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={description}
          onChangeText={setDescription}
          placeholder="Descreva o evento"
          multiline
          textAlignVertical="top"
        />
      </View>

      <View style={styles.field}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Categoria</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CategoryScreen')}>
            <Text style={styles.linkLabel}>Gerenciar categorias</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.pickerBox}>
          <Picker
            selectedValue={selectedCategoryId}
            onValueChange={(v) => setSelectedCategoryId(v)}
          >
            <Picker.Item label="Selecione uma categoria" value={null} />
            {categories.map((c) => (
              <Picker.Item key={c.id} label={c.name} value={c.id} />
            ))}
          </Picker>
        </View>
>>>>>>> f28fa6f4d3d8036830a9e6f78154ae84b7c596ef
      </View>

      <Text style={styles.sectionTitle}>Data e Horário</Text>

      <View style={styles.row}>
<<<<<<< HEAD
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
=======
        <TouchableOpacity
          style={styles.inputBox}
          onPress={() => setDatePickerVisible(true)}
        >
          <Text style={styles.inputLabelSmall}>Data do Evento</Text>
          <Text style={styles.inputValue}>
            {format(eventDate, 'dd/MM/yyyy')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.inputBox}
          onPress={() => setStartTimePickerVisible(true)}
        >
          <Text style={styles.inputLabelSmall}>Horário Inicial</Text>
          <Text style={styles.inputValue}>
            {format(startTime, 'HH:mm')}
>>>>>>> f28fa6f4d3d8036830a9e6f78154ae84b7c596ef
          </Text>
        </TouchableOpacity>
      </View>

<<<<<<< HEAD
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
=======
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.inputBox}
          onPress={() => setEndTimePickerVisible(true)}
        >
          <Text style={styles.inputLabelSmall}>Horário Final</Text>
          <Text style={styles.inputValue}>
            {format(endTime, 'HH:mm')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Valor do Ingresso</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={ticketDisplay}
          onChangeText={(text) => {
            const onlyDigits = text.replace(/\D/g, '')
            const number = Number(onlyDigits) / 100
            setTicketValue(number)
            setTicketDisplay(formatCurrencyBR(text))
          }}
        />
      </View>

      <Text style={styles.sectionTitle}>Local do Evento</Text>

      <Text style={styles.helperText}>Selecione os Locais Cadastrados</Text>

      <View style={styles.field}>
        <View style={styles.pickerBox}>
          <Picker
            selectedValue={selectedLocationId}
            onValueChange={(v) => setSelectedLocationId(v)}
          >
            <Picker.Item label="Selecione um local" value={null} />
            {locations.map((l) => (
              <Picker.Item
                key={l.id}
                label={l.name}
                value={l.id}
              />
            ))}
          </Picker>
        </View>
        {selectedLocationObj && (
          <Text style={styles.locationSummary}>
            {selectedLocationObj.address}
          </Text>
        )}
      </View>

      <Text style={styles.orText}>Ou</Text>

      <TouchableOpacity
        style={styles.mapPreview}
        onPress={() => navigation.navigate('LocationMapScreen', { from: 'event' })}
      >
        <MapView
          style={styles.mapInner}
          pointerEvents="none"
          initialRegion={{
            latitude: -8.76,
            longitude: -63.87,
            latitudeDelta: 0.08,
            longitudeDelta: 0.08,
          }}
        >
          {selectedLocationObj && (
            <Marker
              coordinate={{
                latitude: selectedLocationObj.latitude,
                longitude: selectedLocationObj.longitude,
              }}
            />
          )}
        </MapView>
        <View style={styles.mapOverlay}>
          <Text style={styles.mapOverlayText}>Marque no Mapa o Local Desejado</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.footerButtons}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveButtonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        minimumDate={new Date()}
        date={eventDate}
        onConfirm={(date) => {
          setEventDate(date)
          setDatePickerVisible(false)
        }}
        onCancel={() => setDatePickerVisible(false)}
      />

      <DateTimePickerModal
        isVisible={isStartTimePickerVisible}
        mode="time"
        is24Hour
        date={startTime}
        onConfirm={(time) => {
          setStartTime(time)
          setStartTimePickerVisible(false)
        }}
        onCancel={() => setStartTimePickerVisible(false)}
      />

      <DateTimePickerModal
        isVisible={isEndTimePickerVisible}
        mode="time"
        is24Hour
        date={endTime}
        onConfirm={(time) => {
          setEndTime(time)
          setEndTimePickerVisible(false)
        }}
        onCancel={() => setEndTimePickerVisible(false)}
      />
>>>>>>> f28fa6f4d3d8036830a9e6f78154ae84b7c596ef
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
    backgroundColor: '#F4F4F4',
=======
    backgroundColor: '#F3F4F6',
>>>>>>> f28fa6f4d3d8036830a9e6f78154ae84b7c596ef
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
<<<<<<< HEAD
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
=======
  rowHorizontal: {
    flexDirection: 'row',
  },
  uploadBox: {
    width: 110,
    height: 110,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    color: '#6B7280',
  },
  uploadImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  field: {
    marginTop: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
>>>>>>> f28fa6f4d3d8036830a9e6f78154ae84b7c596ef
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
<<<<<<< HEAD
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
=======
  },
  linkLabel: {
    fontSize: 12,
    color: '#1D4ED8',
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
  multilineInput: {
    minHeight: 100,
  },
  sectionTitle: {
    marginTop: 24,
    fontSize: 16,
    fontWeight: '700',
  },
  row: {
>>>>>>> f28fa6f4d3d8036830a9e6f78154ae84b7c596ef
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
<<<<<<< HEAD
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#E5E5E5',
  },
  modalConfirmButton: {
    flex: 1,
    backgroundColor: '#0066FF',
=======
  inputBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFF',
  },
  inputLabelSmall: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 4,
  },
  inputValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFF',
  },
  helperText: {
    marginTop: 4,
    fontSize: 13,
    color: '#4B5563',
  },
  orText: {
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
    fontSize: 14,
    color: '#4B5563',
  },
  mapPreview: {
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  mapInner: {
    flex: 1,
  },
  mapOverlay: {
    position: 'absolute',
    top: 8,
    left: 16,
    right: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
  },
  mapOverlayText: {
    fontSize: 13,
    fontWeight: '500',
  },
  footerButtons: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#1D4ED8',
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  locationSummary: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 4,
>>>>>>> f28fa6f4d3d8036830a9e6f78154ae84b7c596ef
  },
})
