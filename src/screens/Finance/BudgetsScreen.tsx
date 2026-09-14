import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BaseScreen } from "../../components/Layout/BaseScreen";
import { LinearGradient } from "expo-linear-gradient";

export default function BudgetsScreen({ navigation }: any) {
  return (
    <BaseScreen title="Presupuestos" showBackButton>
      <View style={styles.container}>
        <Text style={styles.title}>Tus Presupuestos</Text>
        <LinearGradient colors={["#8B5CF6", "#6D28D9"]} style={styles.card}>
          <Text style={styles.cardText}>Límite Mensual - Comida</Text>
          <Text style={styles.amountText}>$300 / $500</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "60%" }]} />
          </View>
        </LinearGradient>
      </View>
    </BaseScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { color: "white", fontSize: 20, marginBottom: 20, fontWeight: "bold" },
  card: { padding: 20, borderRadius: 16, marginBottom: 15 },
  cardText: { color: "rgba(255,255,255,0.8)", fontSize: 16 },
  amountText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#34D399" },
});
