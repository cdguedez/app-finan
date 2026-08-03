import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { BaseScreen } from "../../components/Layout/BaseScreen";
import { StylesTransactionManagement } from "./styles/TransactionManagement.styles";
import {
  financeService,
  Transaction,
  Category,
} from "../../services/financeService";
import { accountService, AccountData } from "../../services/accountService";
import Skeleton from "../../components/Skeleton/Skeleton";

const TransactionManagementScreen = () => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<AccountData[]>([]);

  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [transData, catData, accData] = await Promise.all([
        financeService.getTransactions(),
        financeService.getCategories(),
        accountService.getAccounts(),
      ]);
      setTransactions(transData);
      setCategories(catData);
      setAccounts(accData);

      if (accData.length > 0) setSelectedAccountId(accData[0].id);
      if (catData.length > 0) setSelectedCategoryId(catData[0].id);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async () => {
    if (!amount || isNaN(Number(amount))) {
      return Alert.alert("Error", "Monto inválido");
    }
    if (!selectedAccountId) {
      return Alert.alert("Error", "Selecciona una cuenta");
    }

    setIsAdding(true);
    try {
      const newTransaction = await financeService.addTransaction({
        accountId: selectedAccountId,
        categoryId: selectedCategoryId || undefined,
        amount: Number(amount),
        type,
        description: description.trim() || undefined,
        date: new Date().toISOString(),
      });

      // Reload transactions to get category info populated
      const transData = await financeService.getTransactions();
      setTransactions(transData);

      setDescription("");
      setAmount("");
      Alert.alert("Éxito", "Transacción agregada");
    } catch (error) {
      Alert.alert("Error", "No se pudo agregar la transacción");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <BaseScreen title="Transacciones" showBackButton scrollable>
      <View style={StylesTransactionManagement.formContainer}>
        <View style={StylesTransactionManagement.pickerContainer}>
          <TouchableOpacity
            style={[
              StylesTransactionManagement.typeButton,
              type === "INCOME" && StylesTransactionManagement.typeButtonActive,
              {
                backgroundColor:
                  type === "INCOME" ? "rgba(16,185,129,0.2)" : "transparent",
              },
            ]}
            onPress={() => setType("INCOME")}
          >
            <Text style={StylesTransactionManagement.typeButtonText}>
              Ingreso
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              StylesTransactionManagement.typeButton,
              type === "EXPENSE" &&
                StylesTransactionManagement.typeButtonActive,
              {
                backgroundColor:
                  type === "EXPENSE" ? "rgba(239,68,68,0.2)" : "transparent",
              },
            ]}
            onPress={() => setType("EXPENSE")}
          >
            <Text style={StylesTransactionManagement.typeButtonText}>
              Gasto
            </Text>
          </TouchableOpacity>
        </View>

        <View style={StylesTransactionManagement.inputGroup}>
          <Text style={StylesTransactionManagement.label}>Monto</Text>
          <TextInput
            style={StylesTransactionManagement.input}
            placeholder="0.00"
            placeholderTextColor="#64748B"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        <View style={StylesTransactionManagement.inputGroup}>
          <Text style={StylesTransactionManagement.label}>Descripción</Text>
          <TextInput
            style={StylesTransactionManagement.input}
            placeholder="Ej. Almuerzo, Salario..."
            placeholderTextColor="#64748B"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Here we should ideally have a dropdown/picker for Account and Category. 
            For simplicity in this layout, we could just let them select from a horizontal scroll 
            or assume the first account if there's no complex picker available natively.
            Since native pickers require extra libs sometimes, we will render a small custom selector. */}

        {categories.length > 0 && (
          <View style={StylesTransactionManagement.inputGroup}>
            <Text style={StylesTransactionManagement.label}>
              Categoría (Primeras 3 para demo)
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {categories.slice(0, 3).map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={{
                    padding: 8,
                    margin: 4,
                    borderWidth: 1,
                    borderColor:
                      selectedCategoryId === cat.id
                        ? "#F8FAFC"
                        : "rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    backgroundColor: `${cat.color}20`,
                  }}
                  onPress={() => setSelectedCategoryId(cat.id)}
                >
                  <Text style={{ color: "#F8FAFC" }}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[
            StylesTransactionManagement.addButton,
            isAdding && { opacity: 0.7 },
          ]}
          onPress={handleAddTransaction}
          disabled={isAdding}
        >
          <LinearGradient
            colors={["#3B82F6", "#2563EB"]}
            style={StylesTransactionManagement.addButtonGradient}
          >
            {isAdding ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={StylesTransactionManagement.addButtonText}>
                Agregar Transacción
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <Text style={StylesTransactionManagement.listTitle}>Historial</Text>
      {loading ? (
        <ActivityIndicator color="#3B82F6" />
      ) : (
        transactions.map((item) => (
          <View
            key={item.id}
            style={StylesTransactionManagement.transactionItem}
          >
            <View
              style={[
                StylesTransactionManagement.transactionIcon,
                { backgroundColor: `${item.category?.color || "#3B82F6"}20` },
              ]}
            >
              <Ionicons
                name={item.type === "INCOME" ? "trending-up" : "trending-down"}
                size={20}
                color={item.category?.color || "#3B82F6"}
              />
            </View>
            <View style={StylesTransactionManagement.transactionInfo}>
              <Text style={StylesTransactionManagement.transactionName}>
                {item.description ||
                  (item.type === "INCOME" ? "Ingreso" : "Gasto")}
              </Text>
              <Text style={StylesTransactionManagement.transactionCategory}>
                {item.category?.name || "Sin Categoría"}
              </Text>
            </View>
            <Text
              style={[
                StylesTransactionManagement.transactionAmount,
                item.type === "INCOME"
                  ? StylesTransactionManagement.amountPositive
                  : StylesTransactionManagement.amountNegative,
              ]}
            >
              {item.type === "INCOME" ? "+" : "-"}$
              {Number(item.amount).toFixed(2)}
            </Text>
          </View>
        ))
      )}
    </BaseScreen>
  );
};

export default TransactionManagementScreen;
