// src/screens/Events/EventMapScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import Header from '@/components/Header';
import { colors } from '@/styles/colors';
import EventMap from '@/components/EventMap';
import { getEvents } from '@/api/events';
import type { MainStackParamList } from '@/navigation/MainStack';

type Props = NativeStackScreenProps<MainStackParamList, 'EventMap'>;

export default function EventMapScreen({ navigation, route }: Props) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadEvents() {
    try {
      setLoading(true);

      if (route.params?.events && route.params.events.length > 0) {
        setEvents(route.params.events);
      } else {
        const data = await getEvents();
        setEvents(data);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primaryBlue} />
        </View>
      ) : (
        <View style={styles.mapWrapper}>
          <EventMap
            events={events}
            onSelectEvent={(event) =>
              navigation.navigate('EventDetail', { event })
            }
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapWrapper: {
    flex: 1,
    padding: 16,
    paddingBottom: 24,
  },
});
