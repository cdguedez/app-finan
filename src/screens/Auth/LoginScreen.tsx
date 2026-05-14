import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import * as LocalAuthentication from "expo-local-authentication";
import { Ionicons } from "@expo/vector-icons";
import { StylesLoginScreen } from "./styles/LoginScreen.styles";

const { width } = Dimensions.get("window");

const LoginScreen = ({ navigation, setUser }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  React.useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  }, []);

  const handleBiometricAuth = async () => {
    try {
      const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
      if (!savedBiometrics) {
        return Alert.alert(
          "Biometría no encontrada",
          "Por favor, asegúrate de tener configurada la biometría en tu dispositivo."
        );
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Inicia sesión con biometría",
        fallbackLabel: "Usar contraseña",
      });

      if (result.success) {
        // En una aplicación real, se usaría un token seguro
        setUser({ email: "usuario@biometrico.com" });
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error durante la autenticación");
    }
  };

  const handleLogin = () => {
    if (email && password) {
      setUser({ email });
    } else {
      alert("Por favor, ingresa tus credenciales");
    }
  };

  return (
    <View style={StylesLoginScreen.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={["#1a1a2e", "#16213e", "#0f3460"]}
        style={StylesLoginScreen.background}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={StylesLoginScreen.content}
      >
        <View style={StylesLoginScreen.header}>
          <Text style={StylesLoginScreen.title}>Bienvenido</Text>
          <Text style={StylesLoginScreen.subtitle}>
            Inicia sesión para continuar
          </Text>
        </View>

        <View style={StylesLoginScreen.form}>
          <View style={StylesLoginScreen.inputContainer}>
            <Text style={StylesLoginScreen.label}>Correo Electrónico</Text>
            <TextInput
              style={StylesLoginScreen.input}
              placeholder="tu@email.com"
              placeholderTextColor="#94a3b8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={StylesLoginScreen.inputContainer}>
            <Text style={StylesLoginScreen.label}>Contraseña</Text>
            <TextInput
              style={StylesLoginScreen.input}
              placeholder="••••••••"
              placeholderTextColor="#94a3b8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
            />
          </View>

          <TouchableOpacity
            style={StylesLoginScreen.button}
            onPress={handleLogin}
          >
            <LinearGradient
              colors={["#4facfe", "#00f2fe"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StylesLoginScreen.buttonGradient}
            >
              <Text style={StylesLoginScreen.buttonText}>Iniciar Sesión</Text>
            </LinearGradient>
          </TouchableOpacity>

          {isBiometricSupported && (
            <TouchableOpacity
              style={StylesLoginScreen.biometricButton}
              onPress={handleBiometricAuth}
            >
              <Ionicons name="finger-print-outline" size={40} color="#4facfe" />
              <Text style={StylesLoginScreen.biometricText}>Acceso Rápido</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            style={StylesLoginScreen.linkContainer}
          >
            <Text style={StylesLoginScreen.linkText}>
              ¿No tienes cuenta?{" "}
              <Text style={StylesLoginScreen.linkTextBold}>Regístrate</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;
