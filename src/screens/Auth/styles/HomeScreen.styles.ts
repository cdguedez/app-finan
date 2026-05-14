import { StyleSheet } from "react-native";

const StylesHomeScreen = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  headerLeft: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: "#94A3B8",
    fontWeight: "500",
  },
  userNameText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F8FAFC",
    marginTop: 4,
  },
  logoutIcon: {
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
  },

  // Balance Card
  balanceCard: {
    borderRadius: 24,
    padding: 25,
    marginBottom: 25,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  balanceLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  balanceAmount: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "bold",
    marginTop: 8,
  },
  balanceFooter: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
  },
  balanceFooterItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  balanceFooterText: {
    color: "#FFFFFF",
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
  },

  // Stats Grid
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  statCard: {
    width: "48%",
    backgroundColor: "rgba(30, 41, 59, 0.7)",
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statLabel: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "600",
  },
  statValue: {
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 4,
  },

  // Section Header
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F8FAFC",
  },
  seeAllText: {
    fontSize: 14,
    color: "#3B82F6",
    fontWeight: "600",
  },

  // Transaction Item
  transactionList: {
    backgroundColor: "rgba(30, 41, 59, 0.7)",
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F8FAFC",
  },
  transactionCategory: {
    fontSize: 13,
    color: "#94A3B8",
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
  },
  amountNegative: {
    color: "#EF4444",
  },
  amountPositive: {
    color: "#10B981",
  },
});

export { StylesHomeScreen };
