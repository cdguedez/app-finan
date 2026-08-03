import { StyleSheet } from "react-native";

export const StylesTransactionManagement = StyleSheet.create({
  formContainer: {
    backgroundColor: "rgba(30, 41, 59, 0.7)",
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    borderRadius: 12,
    padding: 15,
    color: "#F8FAFC",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  typeButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    marginHorizontal: 5,
  },
  typeButtonActive: {
    borderColor: "#F8FAFC",
  },
  typeButtonText: {
    color: "#F8FAFC",
    fontWeight: "600",
  },
  addButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 10,
  },
  addButtonGradient: {
    padding: 16,
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F8FAFC",
    marginBottom: 15,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30, 41, 59, 0.7)",
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 13,
    color: "#94A3B8",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  amountPositive: {
    color: "#10B981",
  },
  amountNegative: {
    color: "#F8FAFC",
  },
});
