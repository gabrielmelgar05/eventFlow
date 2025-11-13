import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'

import LoginScreen from './src/screens/Auth/LoginScreen'
import SignupScreen from './src/screens/Auth/SignupScreen'

import EventListScreen from './src/screens/Events/EventListScreen'
import EventFormScreen from './src/screens/Events/EventFormScreen'
import EventMapScreen from './src/screens/Events/EventMapScreen'

import LocationListScreen from './src/screens/Locations/LocationListScreen'
import LocationFormScreen from './src/screens/Locations/LocationFormScreen'
import LocationMapScreen from './src/screens/Locations/LocationMapScreen'

import CategoryScreen from './src/screens/Categories/CategoryScreen'
import ProfileScreen from './src/screens/Profile/ProfileScreen'

// ⬇️ importa o provider (ajusta o caminho se o arquivo estiver em outra pasta)
import { AuthProvider } from './src/context/AuthContext'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()
const EventStackNav = createNativeStackNavigator()
const LocationStackNav = createNativeStackNavigator()

function EventStack() {
  return (
    <EventStackNav.Navigator>
      <EventStackNav.Screen
        name="EventListScreen"
        component={EventListScreen}
        options={{ title: 'Listagem de Eventos' }}
      />
      <EventStackNav.Screen
        name="EventFormScreen"
        component={EventFormScreen}
        options={{ title: 'Cadastrar Evento' }}
      />
      <EventStackNav.Screen
        name="EventMapScreen"
        component={EventMapScreen}
        options={{ title: 'Selecionar Local no Mapa' }}
      />
      <EventStackNav.Screen
        name="CategoryScreen"
        component={CategoryScreen}
        options={{ title: 'Categorias' }}
      />
    </EventStackNav.Navigator>
  )
}

function LocationStack() {
  return (
    <LocationStackNav.Navigator>
      <LocationStackNav.Screen
        name="LocationListScreen"
        component={LocationListScreen}
        options={{ title: 'Listagem de Locais' }}
      />
      <LocationStackNav.Screen
        name="LocationFormScreen"
        component={LocationFormScreen}
        options={{ title: 'Cadastrar Local' }}
      />
      <LocationStackNav.Screen
        name="LocationMapScreen"
        component={LocationMapScreen}
        options={{ title: 'Selecionar Local no Mapa' }}
      />
    </LocationStackNav.Navigator>
  )
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Eventos') {
            return <Ionicons name="calendar-outline" size={size} color={color} />
          }
          if (route.name === 'Locais') {
            return <Ionicons name="location-outline" size={size} color={color} />
          }
          if (route.name === 'Perfil') {
            return <Ionicons name="person-outline" size={size} color={color} />
          }
          return null
        },
      })}
    >
      <Tab.Screen name="Eventos" component={EventStack} />
      <Tab.Screen name="Locais" component={LocationStack} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  )
}
