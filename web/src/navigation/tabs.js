// src/navigation/tabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import EventListScreen from '../screens/Catalogs/EventListScreen';
import EventMapScreen from '../screens/Catalogs/EventMapScreen';
import CategoriesScreen from '../screens/Catalogs/CategoriesScreen';
import LocationFormScreen from '../screens/Catalogs/LocationFormScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2f54eb',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName = 'ellipse';

          if (route.name === 'Eventos') iconName = 'list';
          if (route.name === 'Mapa') iconName = 'map';
          if (route.name === 'Categorias') iconName = 'pricetags';
          if (route.name === 'Locais') iconName = 'location';
          if (route.name === 'Perfil') iconName = 'person';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Eventos" component={EventListScreen} />
      <Tab.Screen name="Mapa" component={EventMapScreen} />
      <Tab.Screen name="Categorias" component={CategoriesScreen} />
      <Tab.Screen name="Locais" component={LocationFormScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
