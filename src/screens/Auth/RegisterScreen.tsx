import { useRef } from "react";
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
import { useRegister } from "../../hooks/auth/useRegister";

const RegisterScreen = ({ navigation, setUser }: any) => {
  const { register, onChangeRegister, handleRegister } = useRegister({
    setUser,
  });

  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

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
              <Text style={StylesRegisterScreen.label}>Nombre</Text>
              <TextInput
                style={StylesRegisterScreen.input}
                placeholder="Juan Pérez"
                placeholderTextColor="#94a3b8"
                value={register.firstName}
                onChangeText={(text) => onChangeRegister("firstName", text)}
                returnKeyType="next"
                onSubmitEditing={() => lastNameRef.current?.focus()}
                blurOnSubmit={false}
              />
            </View>
            <View style={StylesRegisterScreen.inputContainer}>
              <Text style={StylesRegisterScreen.label}>Apellido</Text>
              <TextInput
                ref={lastNameRef}
                style={StylesRegisterScreen.input}
                placeholder="Juan Pérez"
                placeholderTextColor="#94a3b8"
                value={register.lastName}
                onChangeText={(text) => onChangeRegister("lastName", text)}
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
                blurOnSubmit={false}
              />
            </View>

            <View style={StylesRegisterScreen.inputContainer}>
              <Text style={StylesRegisterScreen.label}>Correo Electrónico</Text>
              <TextInput
                ref={emailRef}
                style={StylesRegisterScreen.input}
                placeholder="tu@email.com"
                placeholderTextColor="#94a3b8"
                value={register.email}
                onChangeText={(text) => onChangeRegister("email", text)}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                blurOnSubmit={false}
              />
            </View>

            <View style={StylesRegisterScreen.inputContainer}>
              <Text style={StylesRegisterScreen.label}>Contraseña</Text>
              <TextInput
                ref={passwordRef}
                style={StylesRegisterScreen.input}
                placeholder="••••••••"
                placeholderTextColor="#94a3b8"
                value={register.password}
                onChangeText={(text) => onChangeRegister("password", text)}
                secureTextEntry={true}
                returnKeyType="done"
                onSubmitEditing={handleRegister}
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
