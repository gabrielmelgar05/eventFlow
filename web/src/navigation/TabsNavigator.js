import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EventsListScreen from '../screens/EventsListScreen';
import EventsMapScreen from '../screens/EventsMapScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import LocationsScreen from '../screens/LocationsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function TabsNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      <Tab.Screen name="Eventos" component={EventsListScreen} />
      <Tab.Screen name="Mapa" component={EventsMapScreen} />
      <Tab.Screen name="Categorias" component={CategoriesScreen} />
      <Tab.Screen name="Locais" component={LocationsScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
