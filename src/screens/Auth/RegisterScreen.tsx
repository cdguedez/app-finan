import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { StylesRegisterScreen } from "./styles/RegisterScreen.styles";

const RegisterScreen = ({ navigation, setUser }: any) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    if (name && email && password) {
      setUser({ email, name });
    } else {
      alert("Por favor, completa todos los campos");
    }
  };

  return (
    <View style={StylesRegisterScreen.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={["#1a1a2e", "#16213e", "#0f3460"]}
        style={StylesRegisterScreen.background}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={StylesRegisterScreen.content}
      >
        <ScrollView
          contentContainerStyle={StylesRegisterScreen.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={StylesRegisterScreen.header}>
            <Text style={StylesRegisterScreen.title}>Crear Cuenta</Text>
            <Text style={StylesRegisterScreen.subtitle}>
              Únete a nosotros hoy
            </Text>
          </View>

          <View style={StylesRegisterScreen.form}>
            <View style={StylesRegisterScreen.inputContainer}>
              <Text style={StylesRegisterScreen.label}>Nombre Completo</Text>
              <TextInput
                style={StylesRegisterScreen.input}
                placeholder="Juan Pérez"
                placeholderTextColor="#94a3b8"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={StylesRegisterScreen.inputContainer}>
              <Text style={StylesRegisterScreen.label}>Correo Electrónico</Text>
              <TextInput
                style={StylesRegisterScreen.input}
                placeholder="tu@email.com"
                placeholderTextColor="#94a3b8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={StylesRegisterScreen.inputContainer}>
              <Text style={StylesRegisterScreen.label}>Contraseña</Text>
              <TextInput
                style={StylesRegisterScreen.input}
                placeholder="••••••••"
                placeholderTextColor="#94a3b8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
              />
            </View>

            <TouchableOpacity
              style={StylesRegisterScreen.button}
              onPress={handleRegister}
            >
              <LinearGradient
                colors={["#4facfe", "#00f2fe"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StylesRegisterScreen.buttonGradient}
              >
                <Text style={StylesRegisterScreen.buttonText}>Registrarse</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              style={StylesRegisterScreen.linkContainer}
            >
              <Text style={StylesRegisterScreen.linkText}>
                ¿Ya tienes cuenta?{" "}
                <Text style={StylesRegisterScreen.linkTextBold}>
                  Inicia Sesión
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default RegisterScreen;
