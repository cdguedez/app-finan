import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { accountService } from "../../services/accountService";

const CURRENCIES = ["USD", "VES", "EUR", "BTC", "ETH", "USDT"];

const RegisterAccountScreen = ({ navigation }: any) => {
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [balance, setBalance] = useState("0.00");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!name.trim()) {
      setError("Por favor ingresa un nombre para la cuenta.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await accountService.createAccount({
        name,
        currency: currency as any,
        balance: parseFloat(balance) || 0,
      });
      // Redirect to MainTabs after successful creation
      navigation.reset({
        index: 0,
        routes: [{ name: "MainTabs" }],
      });
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al registrar la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={["#1E1B4B", "#312E81", "#1e1a3d"]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Ionicons name="wallet" size={40} color="#60A5FA" />
              </View>
              <Text style={styles.title}>Configura tu Cuenta</Text>
              <Text style={styles.subtitle}>
                Registra tu primera cuenta para empezar a gestionar tus finanzas
              </Text>
            </View>

            <View style={styles.formContainer}>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nombre de la cuenta</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="card-outline"
                    size={20}
                    color="#94A3B8"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Ej. Banesco, PayPal, Binance..."
                    placeholderTextColor="#64748B"
                    value={name}
                    onChangeText={setName}
                    maxLength={100}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Moneda</Text>
                <View style={styles.currencyContainer}>
                  {CURRENCIES.map((c) => (
                    <TouchableOpacity
                      key={c}
                      style={[
                        styles.currencyChip,
                        currency === c && styles.currencyChipActive,
                      ]}
                      onPress={() => setCurrency(c)}
                    >
                      <Text
                        style={[
                          styles.currencyChipText,
                          currency === c && styles.currencyChipTextActive,
                        ]}
                      >
                        {c}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Saldo Inicial</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="cash-outline"
                    size={20}
                    color="#94A3B8"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    placeholderTextColor="#64748B"
                    value={balance}
                    onChangeText={setBalance}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleRegister}
                disabled={loading}
              >
                <LinearGradient
                  colors={["#3B82F6", "#2563EB"]}
                  style={styles.gradientButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.submitButtonText}>Comenzar</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.3)",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#F8FAFC",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#94A3B8",
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  formContainer: {
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  errorText: {
    color: "#EF4444",
    marginBottom: 16,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    color: "#E2E8F0",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: "#F8FAFC",
    fontSize: 16,
  },
  currencyContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  currencyChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  currencyChipActive: {
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    borderColor: "#3B82F6",
  },
  currencyChipText: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "600",
  },
  currencyChipTextActive: {
    color: "#60A5FA",
  },
  submitButton: {
    height: 56,
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 8,
  },
  gradientButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});

export default RegisterAccountScreen;
