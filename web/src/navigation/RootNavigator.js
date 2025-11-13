import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/Auth/LoginScreen';
import EventListScreen from '../screens/Catalogs/EventListScreen';
import EventDetailScreen from '../screens/Catalogs/EventDetailScreen';
import EventFormScreen from '../screens/Catalogs/EventFormScreen';
import LocationsScreen from '../screens/Catalogs/LocationsScreen';
import LocationFormScreen from '../screens/Catalogs/LocationFormScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AppTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Eventos" component={EventListScreen} />
      <Tab.Screen name="Locais" component={LocationsScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { signed, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      {signed ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={AppTabs} />
          <Stack.Screen name="EventDetail" component={EventDetailScreen} />
          <Stack.Screen name="EventForm" component={EventFormScreen} />
          <Stack.Screen name="LocationForm" component={LocationFormScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
