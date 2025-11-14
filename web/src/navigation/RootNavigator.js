import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import { useAuth } from '../context/AuthContext'

import LoginScreen from '../screens/Auth/LoginScreen'

import TabNavigator from './TabNavigator'

import EventDetailScreen from '../screens/Events/EventDetailScreen'
import EventFormScreen from '../screens/Events/EventFormScreen'
import LocationFormScreen from '../screens/Locations/LocationFormScreen'
import LocationMapScreen from '../screens/Locations/LocationMapScreen'
import ProfileScreen from '../screens/Profile/ProfileScreen'

const Stack = createStackNavigator()

export default function RootNavigator() {
  const { signed, loading } = useAuth()

  if (loading) {
    // aqui depois você pode colocar uma SplashScreen bonitinha
    return null
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {signed ? (
          <>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="EventDetail" component={EventDetailScreen} />
            <Stack.Screen name="EventForm" component={EventFormScreen} />
            <Stack.Screen name="LocationForm" component={LocationFormScreen} />
            <Stack.Screen name="LocationMap" component={LocationMapScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
