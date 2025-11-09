import { createNativeStackNavigator } from '@react-navigation/native-stack';
import useAuth from '../hooks/useAuth';
import LoginScreen from '../screens/LoginScreen';
import TabsNavigator from './TabsNavigator';
import EventDetailScreen from '../screens/EventDetailScreen';
import EventFormScreen from '../screens/EventFormScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user, loading } = useAuth();
  if (loading) return null;

  return (
    <Stack.Navigator>
      {!user ? (
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      ) : (
        <>
          <Stack.Screen name="HomeTabs" component={TabsNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="EventDetail" component={EventDetailScreen} options={{ title: 'Detalhes' }} />
          <Stack.Screen name="EventForm" component={EventFormScreen} options={{ title: 'Evento' }} />
        </>
      )}
    </Stack.Navigator>
  );
}
