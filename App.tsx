import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/Auth/LoginScreen";
import RegisterScreen from "./src/screens/Auth/RegisterScreen";
import HomeScreen from "./src/screens/HomeScreen";
import CategoryManagementScreen from "./src/screens/Finance/CategoryManagementScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState<any>(null);

  const handleLogout = () => {
    setUser(null);
  };

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
