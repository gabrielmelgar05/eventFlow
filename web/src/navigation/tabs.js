import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import EventsListScreen from "../screens/Events/EventListScreen";
import EventMapScreen from "../screens/Events/EventMapScreen";
import CategoriesScreen from "../screens/Catalogs/CategoriesScreen";
import LocationsScreen from "../screens/Catalogs/LocationsScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import { MaterialIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { View } from "react-native";

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#0077ff",
        tabBarStyle: { height: 64, paddingBottom: 8, paddingTop: 6 },
        tabBarIcon: ({ color, size, focused }) => {
          if (route.name === "Eventos")
            return <MaterialIcons name="event" size={22} color={color} />;
          if (route.name === "Mapa")
            return <Ionicons name="map" size={22} color={color} />;
          if (route.name === "Categorias")
            return <FontAwesome5 name="tags" size={18} color={color} />;
          if (route.name === "Locais")
            return <Ionicons name="location" size={20} color={color} />;
          if (route.name === "Perfil")
            return <MaterialIcons name="person" size={22} color={color} />;
          return <View />;
        },
      })}
    >
      <Tab.Screen name="Eventos" component={EventsListScreen} />
      <Tab.Screen name="Mapa" component={EventMapScreen} />
      <Tab.Screen name="Categorias" component={CategoriesScreen} />
      <Tab.Screen name="Locais" component={LocationsScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
