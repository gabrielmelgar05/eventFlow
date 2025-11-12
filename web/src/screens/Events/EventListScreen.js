import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import TextInputField from "../../components/TextInputFiel";

const mockEvents = []; // se tiver eventos da API, use esse array

export default function EventListScreen({ navigation }) {
  return (
    <View style={styles.root}>
      <View style={styles.headerSpace} />
      <Text style={styles.title}>Listagem de Eventos</Text>

      <TextInputField placeholder="Pesquisar Eventos" style={{ marginHorizontal: 16 }} />

      <TouchableOpacity
        style={styles.createBtn}
        onPress={() => navigation.navigate("EventFormScreen")}
      >
        <Text style={styles.createText}>Criar Evento +</Text>
      </TouchableOpacity>

      <FlatList
        data={mockEvents}
        keyExtractor={(i) => i.id?.toString() ?? Math.random().toString()}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 60 }}
        ListEmptyComponent={() => <Text style={styles.empty}>Nenhum evento localizado</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSub}>{item.date}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f7f7f7" },
  headerSpace: { height: 12 }, // diminui corte no topo
  title: { fontSize: 22, fontWeight: "700", marginLeft: 16, marginTop: 8 },
  createBtn: {
    margin: 16,
    borderRadius: 12,
    backgroundColor: "#1b4dff",
    paddingVertical: 14,
    alignItems: "center",
  },
  createText: { color: "#fff", fontWeight: "600" },
  empty: { textAlign: "center", marginTop: 24, color: "#9a9a9a" },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardTitle: { fontWeight: "700", fontSize: 16 },
  cardSub: { color: "#777", marginTop: 6 },
});
