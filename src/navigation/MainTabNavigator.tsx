import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import AccountsScreen from "../screens/Finance/AccountsScreen";
import CategoryManagementScreen from "../screens/Finance/CategoryManagementScreen";
import TransactionManagementScreen from "../screens/Finance/TransactionManagementScreen";

const Tab = createBottomTabNavigator();

const MainTabNavigator = ({ user, onLogout }: any) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          if (route.name === "Inicio") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Cuentas") {
            iconName = focused ? "card" : "card-outline";
          } else if (route.name === "Categorías") {
            iconName = focused ? "grid" : "grid-outline";
          } else if (route.name === "Transacciones") {
            iconName = focused ? "swap-horizontal" : "swap-horizontal-outline";
          }

          return (
            <View
              style={[
                styles.iconContainer,
                focused && styles.iconContainerFocused,
              ]}
            >
              <Ionicons
                name={iconName}
                size={24}
                color={focused ? "#60A5FA" : "#64748B"}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Inicio">
        {(props) => <HomeScreen {...props} user={user} onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen
        name="Transacciones"
        component={TransactionManagementScreen}
      />
      <Tab.Screen name="Cuentas" component={AccountsScreen} />
      <Tab.Screen name="Categorías" component={CategoryManagementScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    elevation: 0,
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    borderRadius: 24,
    height: 70,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    top: 5,
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  iconContainerFocused: {
    backgroundColor: "rgba(59, 130, 246, 0.15)",
  },
});

export default MainTabNavigator;
