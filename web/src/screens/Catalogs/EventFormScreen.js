import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
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
}

export default function EventFormScreen() {
  const navigation = useNavigation()
  const route = useRoute()

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

  useEffect(() => {
    loadCategories()
    loadLocations()
  }, [])

  async function loadCategories() {
    try {
      const res = await api.get('/categories')
      setCategories(res.data)
    } catch (e) {
      console.log(e)
    }
  }

  async function loadLocations() {
    try {
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
    }
  }

  return (
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
      </View>

      <Text style={styles.sectionTitle}>Data e Horário</Text>

      <View style={styles.row}>
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
          </Text>
        </TouchableOpacity>
      </View>

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
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
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
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
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
  },
})
