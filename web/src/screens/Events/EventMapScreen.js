import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Platform, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function EventMapScreen() {
  const [status, setStatus] = useState("loading");
  const [region, setRegion] = useState(null);
  const [markers, setMarkers] = useState([]); // se tiver eventos vindos da API, coloque aqui
  const watchRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setStatus("denied");
        return;
      }
      setStatus("granted");
      const loc = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.06,
        longitudeDelta: 0.06,
      });

      // exemplo: carregar markers da API (substituir pela sua chamada)
      // fetchEvents().then(e => setMarkers(e.map(ev => ({id: ev.id, latitude: ev.lat, longitude: ev.lng, title: ev.name}))))

      // watch posição em tempo real (atualiza marker do usuário)
      watchRef.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 3000, distanceInterval: 5 },
        (newLoc) => {
          setRegion((r) =>
            r
              ? {
                  ...r,
                  latitude: newLoc.coords.latitude,
                  longitude: newLoc.coords.longitude,
                }
              : {
                  latitude: newLoc.coords.latitude,
                  longitude: newLoc.coords.longitude,
                  latitudeDelta: 0.06,
                  longitudeDelta: 0.06,
                }
          );
        }
      );
    })();

    return () => {
      if (watchRef.current && watchRef.current.remove) watchRef.current.remove();
    };
  }, []);

  if (status === "loading" || !region) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Localizando...</Text>
      </View>
    );
  }

  if (status === "denied") {
    return (
      <View style={styles.center}>
        <Text>Permissão de localização negada. Ative nas configurações do sistema.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation
        showsMyLocationButton
        onRegionChangeComplete={(r) => setRegion(r)}
        mapType={Platform.OS === "ios" ? "standard" : "standard"}
      >
        {/* markers vindos da API */}
        {markers.map((m) => (
          <Marker
            key={m.id}
            coordinate={{ latitude: m.latitude, longitude: m.longitude }}
            title={m.title}
            description={m.description}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
