import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { StylesHomeScreen } from "./Auth/styles/HomeScreen.styles";
import { financeService, DashboardData } from "../services/financeService";
import Skeleton from "../components/Skeleton";

const HomeSkeleton = () => (
  <View style={StylesHomeScreen.container}>
    <SafeAreaView style={StylesHomeScreen.content}>
      {/* Header Skeleton */}
      <View style={StylesHomeScreen.header}>
        <View style={StylesHomeScreen.headerLeft}>
          <Skeleton width={120} height={16} borderRadius={4} />
          <Skeleton
            width={180}
            height={28}
            borderRadius={6}
            style={{ marginTop: 8 }}
          />
        </View>
        <Skeleton width={44} height={44} borderRadius={12} />
      </View>

      {/* Balance Card Skeleton */}
      <Skeleton
        width="100%"
        height={160}
        borderRadius={24}
        style={{ marginBottom: 25 }}
      />

      {/* Stats Grid Skeleton */}
      <View style={StylesHomeScreen.statsGrid}>
        <Skeleton width="48%" height={100} borderRadius={20} />
        <Skeleton width="48%" height={100} borderRadius={20} />
      </View>

      {/* Section Header Skeleton */}
      <View style={[StylesHomeScreen.sectionHeader, { marginBottom: 15 }]}>
        <Skeleton width={150} height={20} borderRadius={4} />
        <Skeleton width={60} height={16} borderRadius={4} />
      </View>

      {/* Transactions List Skeleton */}
      {[1, 2, 3, 4].map((i) => (
        <View
          key={i}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 15,
          }}
        >
          <Skeleton
            width={48}
            height={48}
            borderRadius={14}
            style={{ marginRight: 15 }}
          />
          <View style={{ flex: 1 }}>
            <Skeleton width="60%" height={16} borderRadius={4} />
            <Skeleton
              width="40%"
              height={12}
              borderRadius={4}
              style={{ marginTop: 6 }}
            />
          </View>
          <Skeleton width={70} height={18} borderRadius={4} />
        </View>
      ))}
    </SafeAreaView>
  </View>
);

const HomeScreen = ({ navigation, user, onLogout }: any) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
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
    <View style={StylesHomeScreen.container}>
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={StylesHomeScreen.scrollContent}
      >
        <SafeAreaView style={StylesHomeScreen.content}>
          {/* Header */}
          <View style={StylesHomeScreen.header}>
            <View style={StylesHomeScreen.headerLeft}>
              <Text style={StylesHomeScreen.welcomeText}>Panel Financiero</Text>
              <Text style={StylesHomeScreen.userNameText}>
                Hola, {user?.email.split("@")[0]}
              </Text>
            </View>
            <TouchableOpacity
              style={StylesHomeScreen.logoutIcon}
              onPress={onLogout}
            >
              <Ionicons name="log-out-outline" size={24} color="#F8FAFC" />
            </TouchableOpacity>
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
                <Text style={StylesHomeScreen.balanceFooterText}>
                  **** 4290
                </Text>
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

          {/* Recent Transactions Section Header */}
          <View style={StylesHomeScreen.sectionHeader}>
            <Text style={StylesHomeScreen.sectionTitle}>
              Actividad Reciente
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("CategoryManagement")}
            >
              <Text style={StylesHomeScreen.seeAllText}>
                Gestionar Categorías
              </Text>
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
                  <Ionicons
                    name={item.icon as any}
                    size={22}
                    color={item.color}
                  />
                </View>
                <View style={StylesHomeScreen.transactionInfo}>
                  <Text style={StylesHomeScreen.transactionName}>
                    {item.name}
                  </Text>
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
        </SafeAreaView>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
