import React, { useCallback, useState } from "react";
import { Text, View, TouchableOpacity, Modal } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { StylesHomeScreen } from "./Auth/styles/HomeScreen.styles";
import { financeService, DashboardData } from "../services/financeService";
import { accountService } from "../services/accountService";
import { HomeSkeleton } from "../components/Skeleton/HomeSkeleton";
import { Currency } from "../interfaces/Currency";
import { BaseScreen } from "../components/Layout/BaseScreen";

const HomeScreen = ({ navigation, user, onLogout }: any) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [isCurrencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(
    user?.user?.baseCurrency || "USD",
  );

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const accounts = await accountService.getAccounts();
      if (accounts.length === 0) {
        navigation.reset({
          index: 0,
          routes: [{ name: "RegisterAccount" }],
        });
        return;
      }

      const dashboardData = await financeService.getDashboardData();
      setData(dashboardData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <HomeSkeleton />;
  }

  return (
    <BaseScreen
      scrollable
      contentContainerStyle={StylesHomeScreen.scrollContent}
    >
      {/* Header */}
      <View style={StylesHomeScreen.header}>
        <View style={StylesHomeScreen.headerLeft}>
          <Text style={StylesHomeScreen.welcomeText}>Panel Financiero</Text>
          <Text style={StylesHomeScreen.userNameText}>
            Hola,{" "}
            {`${user?.user?.firstName ?? user?.firstName ?? ""} ${user?.user?.lastName ?? user?.lastName ?? ""}`}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            style={[StylesHomeScreen.logoutIcon, { marginRight: 15 }]}
            onPress={() => setCurrencyModalVisible(true)}
          >
            <Ionicons name="settings-outline" size={24} color="#F8FAFC" />
          </TouchableOpacity>
          <TouchableOpacity
            style={StylesHomeScreen.logoutIcon}
            onPress={onLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="#F8FAFC" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Balance Card */}
      <LinearGradient
        colors={["#3B82F6", "#2563EB", "#1D4ED8"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StylesHomeScreen.balanceCard}
      >
        <Text style={StylesHomeScreen.balanceLabel}>Saldo Total</Text>
        <Text style={StylesHomeScreen.balanceAmount}>{data?.balance}</Text>
        <View style={StylesHomeScreen.balanceFooter}>
          <View style={StylesHomeScreen.balanceFooterItem}>
            <Ionicons name="arrow-up-circle" size={20} color="#10B981" />
            <Text style={StylesHomeScreen.balanceFooterText}>+12.5%</Text>
          </View>
          <View style={StylesHomeScreen.balanceFooterItem}>
            <Ionicons name="card" size={20} color="rgba(255,255,255,0.8)" />
            <Text style={StylesHomeScreen.balanceFooterText}>**** 4290</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Stats Grid */}
      <View style={StylesHomeScreen.statsGrid}>
        <View style={StylesHomeScreen.statCard}>
          <View
            style={[
              StylesHomeScreen.statIcon,
              { backgroundColor: "rgba(16, 185, 129, 0.15)" },
            ]}
          >
            <Ionicons name="trending-up" size={20} color="#10B981" />
          </View>
          <Text style={StylesHomeScreen.statLabel}>Ingresos</Text>
          <Text style={StylesHomeScreen.statValue}>{data?.income}</Text>
        </View>

        <View style={StylesHomeScreen.statCard}>
          <View
            style={[
              StylesHomeScreen.statIcon,
              { backgroundColor: "rgba(239, 68, 68, 0.15)" },
            ]}
          >
            <Ionicons name="trending-down" size={20} color="#EF4444" />
          </View>
          <Text style={StylesHomeScreen.statLabel}>Gastos</Text>
          <Text style={StylesHomeScreen.statValue}>{data?.expenses}</Text>
        </View>
      </View>

      {/* Quick Actions Grid */}
      <View style={StylesHomeScreen.statsGrid}>
        <TouchableOpacity
          style={StylesHomeScreen.statCard}
          onPress={() => navigation.navigate("Budgets")}
        >
          <View
            style={[
              StylesHomeScreen.statIcon,
              { backgroundColor: "rgba(139, 92, 246, 0.15)" },
            ]}
          >
            <Ionicons name="pie-chart" size={20} color="#8B5CF6" />
          </View>
          <Text style={StylesHomeScreen.statLabel}>Presupuestos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={StylesHomeScreen.statCard}
          onPress={() => navigation.navigate("Subscriptions")}
        >
          <View
            style={[
              StylesHomeScreen.statIcon,
              { backgroundColor: "rgba(239, 68, 68, 0.15)" },
            ]}
          >
            <Ionicons name="calendar" size={20} color="#EF4444" />
          </View>
          <Text style={StylesHomeScreen.statLabel}>Suscripciones</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Transactions Section Header */}
      <View style={StylesHomeScreen.sectionHeader}>
        <Text style={StylesHomeScreen.sectionTitle}>Actividad Reciente</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Transacciones")}>
          <Text style={StylesHomeScreen.seeAllText}>Ver Transacciones</Text>
        </TouchableOpacity>
      </View>

      <View style={StylesHomeScreen.transactionList}>
        {data?.transactions.map((item, index) => (
          <View
            key={item.id}
            style={[
              StylesHomeScreen.transactionItem,
              index !== data.transactions.length - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: "rgba(255,255,255,0.05)",
              },
            ]}
          >
            <View
              style={[
                StylesHomeScreen.transactionIcon,
                { backgroundColor: `${item.color}20` },
              ]}
            >
              <Ionicons name={item.icon as any} size={22} color={item.color} />
            </View>
            <View style={StylesHomeScreen.transactionInfo}>
              <Text style={StylesHomeScreen.transactionName}>{item.name}</Text>
              <Text style={StylesHomeScreen.transactionCategory}>
                {item.category}
              </Text>
            </View>
            <Text
              style={[
                StylesHomeScreen.transactionAmount,
                item.amount.startsWith("+")
                  ? StylesHomeScreen.amountPositive
                  : StylesHomeScreen.amountNegative,
              ]}
            >
              {item.amount}
            </Text>
          </View>
        ))}
      </View>

      {/* Currency Modal */}
      <Modal
        visible={isCurrencyModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCurrencyModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "#1E293B",
              padding: 20,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text
                style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
              >
                Moneda Principal
              </Text>
              <TouchableOpacity onPress={() => setCurrencyModalVisible(false)}>
                <Ionicons name="close" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {Object.values(Currency).map((currency) => (
              <TouchableOpacity
                key={currency}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 15,
                  borderRadius: 10,
                  backgroundColor:
                    selectedCurrency === currency
                      ? "rgba(59, 130, 246, 0.2)"
                      : "transparent",
                  marginBottom: 10,
                }}
                onPress={async () => {
                  setSelectedCurrency(currency);
                  setCurrencyModalVisible(false);
                  // TODO: Call API to update baseCurrency in the backend
                }}
              >
                <Text
                  style={{
                    color: selectedCurrency === currency ? "#60A5FA" : "white",
                    fontSize: 16,
                  }}
                >
                  {currency}
                </Text>
                {selectedCurrency === currency && (
                  <Ionicons name="checkmark" size={20} color="#60A5FA" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </BaseScreen>
  );
};

export default HomeScreen;
