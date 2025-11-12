import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Import das telas
import EventListScreen from "../screens/Events/EventListScreen";
import EventMapScreen from "../screens/Events/EventMapScreen";
import CategoriesScreen from "../screens/Catalogs/CategoriesScreen";
import LocationsScreen from "../screens/Catalogs/LocationsScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#007bff",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { height: 65, paddingBottom: 10, backgroundColor: "#fff" },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case "Eventos":
              iconName = "calendar";
              break;
            case "Mapa":
              iconName = "map";
              break;
            case "Categorias":
              iconName = "list";
              break;
            case "Locais":
              iconName = "location";
              break;
            case "Perfil":
              iconName = "person";
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Eventos" component={EventListScreen} />
      <Tab.Screen name="Mapa" component={EventMapScreen} />
      <Tab.Screen name="Categorias" component={CategoriesScreen} />
      <Tab.Screen name="Locais" component={LocationsScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
