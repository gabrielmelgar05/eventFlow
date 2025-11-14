// src/screens/Events/EventFormScreen.js
import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { Ionicons } from '@expo/vector-icons'
// Importe seus componentes de input, se existirem (ex: Input, TextInputField)

// Simulação de componentes de seleção de Data e Hora
const DatePickerInput = ({ value, onPress }) => (
  <TouchableOpacity style={styles.dateInputContainer} onPress={onPress}>
    <Text style={styles.dateInputText}>{value || 'Select date'}</Text>
    <Ionicons name="calendar-outline" size={20} color="#999" />
  </TouchableOpacity>
)

const TimePickerInput = ({ value, onPress }) => (
  <TouchableOpacity style={styles.timeInputContainer} onPress={onPress}>
    <Text style={styles.timeInputText}>{value || 'Select time'}</Text>
    <Ionicons name="time-outline" size={20} color="#999" />
  </TouchableOpacity>
)

export default function EventFormScreen({ navigation }) {
  // Estados do formulário (simplificado)
  const [eventName, setEventName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [eventDate, setEventDate] = useState('13/11/2025') // Valor inicial
  const [startTime, setStartTime] = useState('22:13') // Valor inicial
  const [endTime, setEndTime] = useState('22:13') // Valor inicial
  const [price, setPrice] = useState('0')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [newLocationName, setNewLocationName] = useState('')

  // Função para simular o picker (precisa ser implementada para abrir o calendário)
  const handleDatePress = () => console.log('Abrir Date Picker')
  const handleTimePress = () => console.log('Abrir Time Picker')
  const handleMarkOnMap = () => {
    // A tela para marcar no mapa deve ser LocationMapScreen ou EventMapScreen
    // Usaremos LocationMapScreen, se estiver registrada no RootNavigator
    navigation.navigate('LocationForm', { screen: 'LocationMap' }) 
    console.log('Navegar para LocationMapScreen')
  }

  const handleSubmit = () => {
    console.log('Submeter evento')
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Cadastrar Evento</Text>

      {/* Inputs de Imagem (Simplificado) */}
      <View style={styles.imagePlaceholderContainer}>
        <View style={styles.imagePlaceholder} />
        <View style={styles.imagePlaceholder} />
        <TouchableOpacity style={styles.uploadButton}>
          <Text style={styles.uploadText}>+ Upload</Text>
        </TouchableOpacity>
      </View>

      {/* Nome */}
      <Text style={styles.label}>Nome</Text>
      <TextInput style={styles.input} value={eventName} onChangeText={setEventName} placeholder="Nome do evento" />

      {/* Descrição */}
      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        value={description}
        onChangeText={setDescription}
        multiline
        placeholder="Descrição detalhada do evento"
      />

      {/* Categoria */}
      <Text style={styles.label}>Categoria</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Please select" value="" />
          <Picker.Item label="Show" value="show" />
          <Picker.Item label="Palestra" value="palestra" />
        </Picker>
      </View>

      {/* Data do Evento */}
      <Text style={styles.label}>Data do Evento</Text>
      <DatePickerInput value={eventDate} onPress={handleDatePress} />

      {/* HORÁRIOS CORRIGIDOS */}
      <View style={styles.timeRow}>
        <View style={styles.timeInputWrapper}>
          <Text style={styles.label}>Horário Inicial</Text>
          <TimePickerInput value={startTime} onPress={handleTimePress} />
        </View>
        <View style={styles.timeInputWrapper}>
          <Text style={styles.label}>Horário Final</Text>
          <TimePickerInput value={endTime} onPress={handleTimePress} />
        </View>
      </View>
      {/* FIM CORREÇÃO HORÁRIOS */}

      {/* Valor Ingresso */}
      <Text style={styles.label}>Valor Ingresso</Text>
      <TextInput 
        style={styles.input} 
        value={price} 
        onChangeText={setPrice} 
        keyboardType="numeric"
        placeholder="0" 
      />

      {/* Selecionar Local Existente */}
      <Text style={styles.label}>Selecione os Locais Cadastrados</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedLocation}
          onValueChange={(itemValue) => setSelectedLocation(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Please select" value="" />
          {/* Opções de locais... */}
        </Picker>
      </View>

      <Text style={styles.orText}>Ou</Text>

      {/* Marcar no Mapa (CORRIGIDO) */}
      <View style={styles.mapPromptContainer}>
        <Text style={styles.label}>Marque no Mapa o Local Desejado</Text>
        <TouchableOpacity style={styles.mapButton} onPress={handleMarkOnMap}>
          <Text style={styles.mapButtonText}>Marque no Mapa</Text>
        </TouchableOpacity>
      </View>

      {/* Campos para Novo Local (Se necessário) */}
      <Text style={styles.label}>Nome do Novo Local</Text>
      <TextInput style={styles.input} value={newLocationName} onChangeText={setNewLocationName} placeholder="Nome" />

      <View style={styles.timeRow}>
        <View style={styles.timeInputWrapper}>
          <Text style={styles.label}>Latitude</Text>
          <TextInput style={styles.input} placeholder="example" />
        </View>
        <View style={styles.timeInputWrapper}>
          <Text style={styles.label}>Longitude</Text>
          <TextInput style={styles.input} placeholder="example" />
        </View>
      </View>
      
      <Text style={styles.label}>Endereço (opcional)</Text>
      <TextInput style={styles.input} placeholder="Rua, Bairro, Cidade" />

      {/* Botões de Ação */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
      
      <View style={{ height: 50 }} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginTop: 15,
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },

  // --- Estilos de Data e Hora Corrigidos ---
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  timeInputWrapper: {
    width: '48%', // Garante que caibam lado a lado
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
    height: 50,
  },
  dateInputText: {
    fontSize: 16,
    color: '#000',
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
    height: 50,
  },
  timeInputText: {
    fontSize: 16,
    color: '#000',
  },
  // --- Fim Estilos de Data e Hora Corrigidos ---

  // Estilos de Picker (Categoria e Locais)
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 50,
    width: '100%',
  },

  // Estilos do Mapa
  orText: {
    textAlign: 'center',
    marginVertical: 15,
    fontSize: 16,
    color: '#666',
  },
  mapPromptContainer: {
    marginBottom: 10,
  },
  mapButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 5,
  },
  mapButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  // Botões de Ação
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  cancelButton: {
    backgroundColor: '#F44336',
    borderRadius: 8,
    padding: 15,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#0011FF',
    borderRadius: 8,
    padding: 15,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // ... Outros estilos (imagePlaceholderContainer, etc.)
  imagePlaceholderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: '30%',
    height: 100,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  uploadButton: {
    width: '30%',
    height: 100,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    color: '#666',
    fontWeight: 'bold',
  },
})