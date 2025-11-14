// src/navigation/TabNavigator.js
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'

// Telas
import EventListScreen from '../screens/Events/EventListScreen'
import EventMapScreen from '../screens/Events/EventMapScreen'
import LocationsScreen from '../screens/Locations/LocationScreen'
import ProfileScreen from '../screens/Profile/ProfileScreen'

const Tab = createBottomTabNavigator()

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#0011FF',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName = 'ellipse'

          if (route.name === 'Eventos') iconName = 'calendar-outline'
          if (route.name === 'Mapa') iconName = 'map-outline'
          if (route.name === 'Locais') iconName = 'pin-outline'
          if (route.name === 'Perfil') iconName = 'person-outline'

          return <Ionicons name={iconName} size={size} color={color} />
        },
      })}
    >
      <Tab.Screen
        name="Eventos"
        component={EventListScreen}
        options={{ title: 'Eventos' }}
      />
      <Tab.Screen
        name="Mapa"
        component={EventMapScreen}
        options={{ title: 'Mapa' }}
      />
      <Tab.Screen
        name="Locais"
        component={LocationsScreen}
        options={{ title: 'Locais' }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  )
}
