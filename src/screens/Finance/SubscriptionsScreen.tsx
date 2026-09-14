import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BaseScreen } from "../../components/Layout/BaseScreen";
import { Ionicons } from "@expo/vector-icons";

export default function SubscriptionsScreen({ navigation }: any) {
  return (
    <BaseScreen title="Suscripciones" showBackButton>
      <View style={styles.container}>
        <Text style={styles.title}>Próximos Pagos</Text>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Ionicons name="film" size={24} color="#EF4444" />
          </View>
          <View style={styles.info}>
            <Text style={styles.name}>Netflix</Text>
            <Text style={styles.date}>Próximo cobro: 15 Ago</Text>
          </View>
          <Text style={styles.amount}>$15.99</Text>
        </View>
      </View>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { color: "white", fontSize: 20, marginBottom: 20, fontWeight: "bold" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  info: { flex: 1 },
  name: { color: "white", fontSize: 16, fontWeight: "600" },
  date: { color: "#94A3B8", fontSize: 13, marginTop: 4 },
  amount: { color: "white", fontSize: 16, fontWeight: "bold" },
});
