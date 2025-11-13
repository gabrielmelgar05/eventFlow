import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import EventListScreen from './src/screens/Events/EventListScreen'
import EventFormScreen from './src/screens/Events/EventFormScreen'
import EventMapScreen from './src/screens/Events/EventMapScreen'
import LocationListScreen from './src/screens/Locations/LocationListScreen'
import LocationFormScreen from './src/screens/Locations/LocationFormScreen'
import LocationMapScreen from './src/screens/Locations/LocationMapScreen'
import CategoryScreen from './src/screens/Categories/CategoryScreen'
import { Ionicons } from '@expo/vector-icons'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarLabelStyle: { fontSize: 12 },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'EventosTab') {
            return <Ionicons name="calendar-outline" size={size} color={color} />
          }
          if (route.name === 'LocaisTab') {
            return <Ionicons name="location-outline" size={size} color={color} />
          }
          return null
        },
      })}
    >
      <Tab.Screen
        name="EventosTab"
        component={EventListScreen}
        options={{ title: 'Eventos' }}
      />
      <Tab.Screen
        name="LocaisTab"
        component={LocationListScreen}
        options={{ title: 'Locais' }}
      />
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EventFormScreen"
          component={EventFormScreen}
          options={{ title: 'Cadastrar Evento' }}
        />
        <Stack.Screen
          name="EventMapScreen"
          component={EventMapScreen}
          options={{ title: 'Selecione no mapa' }}
        />
        <Stack.Screen
          name="LocationFormScreen"
          component={LocationFormScreen}
          options={{ title: 'Cadastrar Local' }}
        />
        <Stack.Screen
          name="LocationMapScreen"
          component={LocationMapScreen}
          options={{ title: 'Selecione no mapa' }}
        />
        <Stack.Screen
          name="CategoryScreen"
          component={CategoryScreen}
          options={{ title: 'Categorias' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
