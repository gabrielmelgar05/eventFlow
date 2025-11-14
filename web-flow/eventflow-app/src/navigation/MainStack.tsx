// src/navigation/MainStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import EventListScreen from '@/screens/Events/EventListScreen';
import EventFormScreen from '@/screens/Events/EventFormScreen';
import EventDetailScreen from '@/screens/Events/EventDetailScreen';
import EventMapScreen from '@/screens/Events/EventMapScreen';
import LocationListScreen from '@/screens/Locations/LocationListScreen';
import LocationFormScreen from '@/screens/Locations/LocationFormScreen';
import ProfileScreen from '@/screens/Profile/ProfileScreen';

export type MainStackParamList = {
  EventList: undefined;
  EventForm: { event?: any } | undefined;
  EventDetail: { event: any };
  EventMap: { events?: any[] } | undefined;
  LocationList: undefined;
  LocationForm: { location?: any } | undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainStack() {
  return (
    <Stack.Navigator
      initialRouteName="EventList"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="EventList" component={EventListScreen} />
      <Stack.Screen name="EventForm" component={EventFormScreen} />
      <Stack.Screen name="EventDetail" component={EventDetailScreen} />
      <Stack.Screen name="EventMap" component={EventMapScreen} />

      <Stack.Screen name="LocationList" component={LocationListScreen} />
      <Stack.Screen name="LocationForm" component={LocationFormScreen} />

      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
