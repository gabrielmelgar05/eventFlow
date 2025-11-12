import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import Tabs from './tabs';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import EventDetailScreen from '../screens/Events/EventDetailScreen';
import EventFormScreen from '../screens/Events/EventFormScreen';
import LocationFormScreen from '../screens/Catalogs/LocationFormScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user, booting } = useAuth();

  if (booting) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name="Home" component={Tabs} options={{ headerShown: false }} />
            <Stack.Screen name="EventoDetalhe" component={EventDetailScreen} options={{ title: 'Evento' }} />
            <Stack.Screen name="EventoForm" component={EventFormScreen} options={{ title: 'Criar/Editar Evento' }} />
            <Stack.Screen name="LocationForm" component={LocationFormScreen} options={{ title: 'Local' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Entrar' }} />
            <Stack.Screen name="Signup" component={SignupScreen} options={{ title: 'Cadastrar' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
