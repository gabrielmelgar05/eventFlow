import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Telas de Navegação
// ATENÇÃO: Verifique se os caminhos (../screens/...) estão 100% corretos
// baseados na sua estrutura de pastas (/src/screens/Catalogs/ etc.)
import EventListScreen from '../screens/Events/EventListScreen'; // Mudei de Catalogs para Events
import EventMapScreen from '../screens/Events/EventMapScreen'; // Mudei de Catalogs para Events
import CategoriesScreen from '../screens/Catalogs/CategoriesScreen';
import LocationListScreen from '../screens/Locations/LocationListScreen'; // Usei LocationListScreen em vez de LocationFormScreen
import ProfileScreen from '../screens/Profile/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2f54eb',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          backgroundColor: 'white', // Adiciona cor de fundo
          borderTopWidth: 0, // Remove a linha feia
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Eventos':
              iconName = 'list';
              break;
            case 'Mapa':
              iconName = 'map';
              break;
            case 'Categorias':
              iconName = 'pricetags';
              break;
            case 'Locais':
              iconName = 'location'; // Mudei para LocationListScreen
              break;
            case 'Perfil':
              iconName = 'person';
              break;
            default:
              iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Eventos" component={EventListScreen} />
      <Tab.Screen name="Mapa" component={EventMapScreen} />
      <Tab.Screen name="Categorias" component={CategoriesScreen} />
      <Tab.Screen name="Locais" component={LocationListScreen} /> 
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}