import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { accountService } from "../../services/accountService";
import { bankService, BankData } from "../../services/bankService";

// ─── Monedas disponibles solo para cuentas internacionales ───────────────────
const INTL_CURRENCIES = ["USD", "EUR", "BTC", "ETH", "USDT"];

// ─── Formateo de monto con separador de miles y decimales ────────────────────
// Formato venezolano: punto (.) = miles, coma (,) = decimales
// Ej: 1000000.50 → "1.000.000,50"
function formatAmount(raw: string): string {
  // Conservamos solo dígitos
  const digits = raw.replace(/\D/g, "");
  if (digits === "") return "";

  // Los últimos 2 dígitos son decimales
  const padded = digits.padStart(3, "0");
  const intPart = padded.slice(0, -2);
  const decPart = padded.slice(-2);

  // Separador de miles con punto
  const intFormatted = intPart
    .replace(/^0+(?=\d)/, "") // quitar ceros a la izquierda
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `${intFormatted || "0"},${decPart}`;
}

// Convierte el valor formateado de vuelta a número para el API
function parseFormattedAmount(formatted: string): number {
  // "1.000,50" → 1000.50
  const normalized = formatted.replace(/\./g, "").replace(",", ".");
  return parseFloat(normalized) || 0;
}

// ─── Tipos de cuenta ─────────────────────────────────────────────────────────
type AccountType = "national" | "international";

const RegisterAccountScreen = ({ navigation }: any) => {
  // Tipo de cuenta
  const [accountType, setAccountType] = useState<AccountType | null>(null);

  // Banco seleccionado
  const [banks, setBanks] = useState<BankData[]>([]);
  const [selectedBank, setSelectedBank] = useState<BankData | null>(null);
  const [banksLoading, setBanksLoading] = useState(false);
  const [banksError, setBanksError] = useState("");
  const [bankDropdownOpen, setBankDropdownOpen] = useState(false);
  const [bankSearch, setBankSearch] = useState("");

  // Moneda: VES fija para nacional, seleccionable para internacional
  const [currency, setCurrency] = useState("USD");

  // Monto con formato
  const [rawDigits, setRawDigits] = useState("");
  const [displayAmount, setDisplayAmount] = useState("");

  // UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ─── Carga de bancos al cambiar tipo ─────────────────────────────────────
  const loadBanks = useCallback(async (type: AccountType) => {
    setBanksLoading(true);
    setBanksError("");
    setBanks([]);
    setSelectedBank(null);

    try {
      const data = await bankService.getBanks({
        isNational: type === "national",
        isActive: true,
      });
      setBanks(data);
    } catch {
      setBanksError("No se pudo cargar el listado de bancos.");
    } finally {
      setBanksLoading(false);
    }
  }, []);

  const handleSelectType = (type: AccountType) => {
    setAccountType(type);
    setSelectedBank(null);
    setRawDigits("");
    setDisplayAmount("");
    setError("");
    if (type === "national") {
      setCurrency("VES");
    } else {
      setCurrency("USD");
    }
    loadBanks(type);
  };

  // ─── Manejo del input de monto ───────────────────────────────────────────
  const handleAmountChange = (text: string) => {
    // Extraer solo dígitos del texto ingresado
    const digits = text.replace(/\D/g, "");
    setRawDigits(digits);
    setDisplayAmount(formatAmount(digits));
  };

  // ─── Envío del formulario ─────────────────────────────────────────────────
  const handleRegister = async () => {
    setError("");

    if (!selectedBank) {
      setError("Por favor selecciona un banco.");
      return;
    }

    const amount = parseFormattedAmount(displayAmount);
    if (amount <= 0) {
      setError("El monto inicial debe ser mayor a 0.");
      return;
    }

    setLoading(true);

    try {
      await accountService.createAccount({
        name: selectedBank.name,
        currency: currency as any,
        balance: amount,
      });
      navigation.reset({
        index: 0,
        routes: [{ name: "MainTabs" }],
      });
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al registrar la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Render: Selector de tipo de cuenta ─────────────────────────────────
  const renderTypeSelector = () => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Tipo de cuenta</Text>
      <View style={styles.typeContainer}>
        <TouchableOpacity
          style={[
            styles.typeCard,
            accountType === "national" && styles.typeCardActive,
          ]}
          onPress={() => handleSelectType("national")}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.typeIconWrap,
              accountType === "national" && styles.typeIconWrapActive,
            ]}
          >
            <Ionicons
              name="flag-outline"
              size={24}
              color={accountType === "national" ? "#60A5FA" : "#64748B"}
            />
          </View>
          <Text
            style={[
              styles.typeLabel,
              accountType === "national" && styles.typeLabelActive,
            ]}
          >
            Nacional
          </Text>
          <Text style={styles.typeDesc}>Bolívares · Bancos VE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.typeCard,
            accountType === "international" && styles.typeCardActive,
          ]}
          onPress={() => handleSelectType("international")}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.typeIconWrap,
              accountType === "international" && styles.typeIconWrapActive,
            ]}
          >
            <Ionicons
              name="globe-outline"
              size={24}
              color={accountType === "international" ? "#60A5FA" : "#64748B"}
            />
          </View>
          <Text
            style={[
              styles.typeLabel,
              accountType === "international" && styles.typeLabelActive,
            ]}
          >
            Internacional
          </Text>
          <Text style={styles.typeDesc}>USD · EUR · Cripto</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // ─── Render: Dropdown de bancos ──────────────────────────────────────────
  const renderBankSelector = () => {
    if (!accountType) return null;

    return (
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Banco</Text>

        {/* Estado: cargando */}
        {banksLoading && (
          <View style={styles.banksStateBox}>
            <ActivityIndicator color="#60A5FA" size="small" />
            <Text style={styles.banksStateText}>Cargando bancos...</Text>
          </View>
        )}

        {/* Estado: error */}
        {!banksLoading && banksError !== "" && (
          <View style={styles.banksStateBox}>
            <Ionicons name="alert-circle-outline" size={20} color="#EF4444" />
            <Text style={[styles.banksStateText, { color: "#EF4444" }]}>
              {banksError}
            </Text>
          </View>
        )}

        {/* Estado: sin bancos */}
        {!banksLoading && banksError === "" && banks.length === 0 && (
          <View style={styles.banksStateBox}>
            <Ionicons name="business-outline" size={20} color="#64748B" />
            <Text style={styles.banksStateText}>
              No existen bancos disponibles
            </Text>
          </View>
        )}

        {/* Trigger del dropdown */}
        {!banksLoading && banks.length > 0 && (
          <TouchableOpacity
            style={[
              styles.dropdownTrigger,
              selectedBank && styles.dropdownTriggerSelected,
            ]}
            onPress={() => setBankDropdownOpen(true)}
            activeOpacity={0.8}
          >
            <Ionicons
              name="business-outline"
              size={18}
              color={selectedBank ? "#60A5FA" : "#64748B"}
              style={styles.inputIcon}
            />
            <Text
              style={[
                styles.dropdownTriggerText,
                selectedBank && styles.dropdownTriggerTextSelected,
              ]}
              numberOfLines={1}
            >
              {selectedBank
                ? `${selectedBank.code} · ${selectedBank.name}`
                : "Selecciona un banco"}
            </Text>
            <Ionicons
              name="chevron-down"
              size={18}
              color={selectedBank ? "#60A5FA" : "#475569"}
            />
          </TouchableOpacity>
        )}

        {/* Modal dropdown */}
        <Modal
          visible={bankDropdownOpen}
          transparent
          animationType="slide"
          onRequestClose={() => {
            setBankDropdownOpen(false);
            setBankSearch("");
          }}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => {
              setBankDropdownOpen(false);
              setBankSearch("");
            }}
          />
          <View style={styles.modalSheet}>
            {/* Handle bar */}
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecciona un banco</Text>
              <TouchableOpacity
                onPress={() => {
                  setBankDropdownOpen(false);
                  setBankSearch("");
                }}
              >
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Buscador */}
            <View style={styles.searchWrapper}>
              <Ionicons
                name="search-outline"
                size={18}
                color="#64748B"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar banco..."
                placeholderTextColor="#475569"
                value={bankSearch}
                onChangeText={setBankSearch}
                autoCorrect={false}
                autoCapitalize="none"
                clearButtonMode="while-editing"
              />
              {bankSearch.length > 0 && (
                <TouchableOpacity onPress={() => setBankSearch("")}>
                  <Ionicons name="close-circle" size={18} color="#475569" />
                </TouchableOpacity>
              )}
            </View>

            <FlatList
              data={banks.filter(
                (b) =>
                  b.name.toLowerCase().includes(bankSearch.toLowerCase()) ||
                  b.code.includes(bankSearch),
              )}
              ListEmptyComponent={
                <View style={styles.searchEmpty}>
                  <Ionicons name="search" size={28} color="#334155" />
                  <Text style={styles.searchEmptyText}>
                    Sin resultados para &ldquo;{bankSearch}&rdquo;
                  </Text>
                </View>
              }
              keyExtractor={(item) => item.code}
              contentContainerStyle={styles.modalList}
              ItemSeparatorComponent={() => (
                <View style={styles.modalSeparator} />
              )}
              renderItem={({ item }) => {
                const isSelected = selectedBank?.code === item.code;
                return (
                  <TouchableOpacity
                    style={[
                      styles.modalOption,
                      isSelected && styles.modalOptionSelected,
                    ]}
                    onPress={() => {
                      setSelectedBank(item);
                      setBankDropdownOpen(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.bankCodeBadge}>
                      <Text style={styles.bankCodeText}>{item.code}</Text>
                    </View>
                    <Text
                      style={[
                        styles.modalOptionText,
                        isSelected && styles.modalOptionTextSelected,
                      ]}
                      numberOfLines={2}
                    >
                      {item.name}
                    </Text>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#60A5FA"
                        style={{ marginLeft: 8, flexShrink: 0 }}
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </Modal>
      </View>
    );
  };

  // ─── Render: Moneda ──────────────────────────────────────────────────────
  const renderCurrencySelector = () => {
    if (!accountType) return null;

    if (accountType === "national") {
      return (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Moneda</Text>
          <View style={styles.currencyFixed}>
            <Ionicons name="lock-closed-outline" size={16} color="#64748B" />
            <Text style={styles.currencyFixedText}>VES — Bolívar Soberano</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Moneda</Text>
        <View style={styles.currencyContainer}>
          {INTL_CURRENCIES.map((c) => (
            <TouchableOpacity
              key={c}
              style={[
                styles.currencyChip,
                currency === c && styles.currencyChipActive,
              ]}
              onPress={() => setCurrency(c)}
            >
              <Text
                style={[
                  styles.currencyChipText,
                  currency === c && styles.currencyChipTextActive,
                ]}
              >
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  // ─── Render: Monto inicial ───────────────────────────────────────────────
  const renderAmountInput = () => {
    if (!accountType) return null;

    return (
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Monto inicial</Text>
        <View style={styles.inputWrapper}>
          <Ionicons
            name="cash-outline"
            size={20}
            color="#94A3B8"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="0,00"
            placeholderTextColor="#64748B"
            value={displayAmount}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
          />
          <Text style={styles.currencyTag}>{currency}</Text>
        </View>
        <Text style={styles.amountHint}>El monto debe ser mayor a 0</Text>
      </View>
    );
  };

  // ─── Render principal ─────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={["#1E1B4B", "#312E81", "#1e1a3d"]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Ionicons name="wallet" size={40} color="#60A5FA" />
              </View>
              <Text style={styles.title}>Configura tu Cuenta</Text>
              <Text style={styles.subtitle}>
                Registra tu primera cuenta para empezar a gestionar tus finanzas
              </Text>
            </View>

            {/* Formulario */}
            <View style={styles.formContainer}>
              {error ? (
                <View style={styles.errorBox}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={16}
                    color="#EF4444"
                  />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              {renderTypeSelector()}
              {renderBankSelector()}
              {renderCurrencySelector()}
              {renderAmountInput()}

              {accountType && (
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    (!selectedBank || parseFormattedAmount(displayAmount) <= 0) &&
                      styles.submitButtonDisabled,
                  ]}
                  onPress={handleRegister}
                  disabled={
                    loading ||
                    !selectedBank ||
                    parseFormattedAmount(displayAmount) <= 0
                  }
                >
                  <LinearGradient
                    colors={
                      !selectedBank || parseFormattedAmount(displayAmount) <= 0
                        ? ["#334155", "#334155"]
                        : ["#3B82F6", "#2563EB"]
                    }
                    style={styles.gradientButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.submitButtonText}>Comenzar</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.3)",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#F8FAFC",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#94A3B8",
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  formContainer: {
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    gap: 4,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: "#E2E8F0",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 10,
    marginLeft: 2,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  // ── Tipo de cuenta ──────────────────────────────────────────────────────
  typeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  typeCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 8,
    borderRadius: 16,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.08)",
    gap: 6,
  },
  typeCardActive: {
    backgroundColor: "rgba(59, 130, 246, 0.12)",
    borderColor: "#3B82F6",
  },
  typeIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  typeIconWrapActive: {
    backgroundColor: "rgba(59, 130, 246, 0.2)",
  },
  typeLabel: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "700",
  },
  typeLabelActive: {
    color: "#60A5FA",
  },
  typeDesc: {
    color: "#475569",
    fontSize: 11,
    textAlign: "center",
  },
  // ── Bancos ──────────────────────────────────────────────────────────────
  banksStateBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 20,
    justifyContent: "center",
  },
  banksStateText: {
    color: "#64748B",
    fontSize: 14,
  },
  // Trigger del dropdown
  dropdownTrigger: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 16,
    height: 56,
  },
  dropdownTriggerSelected: {
    borderColor: "rgba(59, 130, 246, 0.4)",
    backgroundColor: "rgba(59, 130, 246, 0.07)",
  },
  dropdownTriggerText: {
    flex: 1,
    color: "#64748B",
    fontSize: 15,
  },
  dropdownTriggerTextSelected: {
    color: "#E2E8F0",
    fontWeight: "500",
  },
  // Modal sheet
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  modalSheet: {
    backgroundColor: "#1E293B",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "70%",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  modalTitle: {
    color: "#F1F5F9",
    fontSize: 16,
    fontWeight: "700",
  },
  modalList: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  modalSeparator: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.04)",
    marginHorizontal: 8,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  modalOptionSelected: {
    backgroundColor: "rgba(59, 130, 246, 0.12)",
  },
  modalOptionText: {
    flex: 1,
    color: "#94A3B8",
    fontSize: 14,
    lineHeight: 20,
  },
  modalOptionTextSelected: {
    color: "#E2E8F0",
    fontWeight: "600",
  },
  bankCodeBadge: {
    backgroundColor: "rgba(99, 102, 241, 0.2)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 12,
    flexShrink: 0,
  },
  bankCodeText: {
    color: "#818CF8",
    fontSize: 12,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  // ── Moneda ──────────────────────────────────────────────────────────────
  currencyFixed: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  currencyFixedText: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "600",
  },
  currencyContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  currencyChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  currencyChipActive: {
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    borderColor: "#3B82F6",
  },
  currencyChipText: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "600",
  },
  currencyChipTextActive: {
    color: "#60A5FA",
  },
  // ── Monto ───────────────────────────────────────────────────────────────
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  currencyTag: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 8,
  },
  amountHint: {
    color: "#475569",
    fontSize: 11,
    marginTop: 6,
    marginLeft: 4,
  },
  // ── Botón ────────────────────────────────────────────────────────────────
  submitButton: {
    height: 56,
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  gradientButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  // ── Buscador del modal ───────────────────────────────────────────────────
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    marginHorizontal: 12,
    marginBottom: 4,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#F1F5F9",
    fontSize: 15,
  },
  searchEmpty: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 10,
  },
  searchEmptyText: {
    color: "#475569",
    fontSize: 14,
    textAlign: "center",
  },
});


export default RegisterAccountScreen;
