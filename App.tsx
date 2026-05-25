import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator, View } from "react-native";
import LoginScreen from "./src/screens/Auth/LoginScreen";
import RegisterScreen from "./src/screens/Auth/RegisterScreen";
import HomeScreen from "./src/screens/HomeScreen";
import CategoryManagementScreen from "./src/screens/Finance/CategoryManagementScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await SecureStore.getItemAsync("accessToken");
        if (token) {
          // Asumimos carga inicial del usuario con el token guardado.
          // El API Client o Home se encargarán de usar el token o refrescarlo si fuera necesario.
          setUser({
            accessToken: token,
            user: { firstName: "Usuario", lastName: "" },
          });
        }
      } catch (error) {
        console.error("Error al restaurar sesión:", error);
      } finally {
        setIsRestoring(false);
      }
    };

    restoreSession();
  }, []);

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("accessToken");
      setUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (isRestoring) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1a1a2e",
        }}
      >
        <ActivityIndicator size="large" color="#4facfe" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Login">
              {(props) => <LoginScreen {...props} setUser={setUser} />}
            </Stack.Screen>
            <Stack.Screen name="Register">
              {(props) => <RegisterScreen {...props} setUser={setUser} />}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen name="Home">
              {(props) => (
                <HomeScreen {...props} user={user} onLogout={handleLogout} />
              )}
            </Stack.Screen>
            <Stack.Screen
              name="CategoryManagement"
              component={CategoryManagementScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
