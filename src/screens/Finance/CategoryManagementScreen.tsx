import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { StylesCategoryManagement } from "./styles/CategoryManagement.styles";
import { financeService, Category } from "../../services/financeService";
import Skeleton from "../../components/Skeleton/Skeleton";
import { BaseScreen } from "../../components/Layout/BaseScreen";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#EF4444",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#F97316",
  "#5c1f98",
  "#700b00",
  "#007038",
];

const CategorySkeleton = () => (
  <View>
    {[1, 2, 3, 4, 5].map((i) => (
      <View
        key={i}
        style={[StylesCategoryManagement.categoryItem, { opacity: 0.5 }]}
      >
        <Skeleton
          width={16}
          height={16}
          borderRadius={8}
          style={{ marginRight: 15 }}
        />
        <Skeleton width="50%" height={16} borderRadius={4} />
      </View>
    ))}
  </View>
);

const CategoryManagementScreen = ({ navigation }: any) => {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await financeService.getCategories();
      setCategories(data);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar las categorías");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!name.trim()) {
      return Alert.alert(
        "Error",
        "Por favor ingresa un nombre para la categoría",
      );
    }

    setIsAdding(true);
    try {
      const newCat = await financeService.addCategory({
        name: name.trim(),
        color: selectedColor,
      });

      setCategories([newCat, ...categories]);
      setName("");
      Alert.alert("Éxito", "Categoría agregada correctamente");
    } catch (error) {
      Alert.alert("Error", "No se pudo agregar la categoría");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  return (
    <BaseScreen title="Categorías" showBackButton>
      {/* Add Category Form */}
      <View style={StylesCategoryManagement.formContainer}>
        <View style={StylesCategoryManagement.inputGroup}>
          <Text style={StylesCategoryManagement.label}>
            Nombre de la Categoría
          </Text>
          <TextInput
            style={StylesCategoryManagement.input}
            placeholder="Ej. Viajes, Regalos..."
            placeholderTextColor="#64748B"
            value={name}
            onChangeText={setName}
            editable={!isAdding}
          />
        </View>

        <View style={StylesCategoryManagement.inputGroup}>
          <Text style={StylesCategoryManagement.label}>
            Selecciona un Color
          </Text>
          <View style={StylesCategoryManagement.colorGrid}>
            {COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  StylesCategoryManagement.colorOption,
                  { backgroundColor: color },
                  selectedColor === color &&
                    StylesCategoryManagement.selectedColor,
                ]}
                onPress={() => setSelectedColor(color)}
                disabled={isAdding}
              >
                {selectedColor === color && (
                  <Ionicons name="checkmark" size={24} color="#F8FAFC" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[
            StylesCategoryManagement.addButton,
            isAdding && { opacity: 0.7 },
          ]}
          onPress={handleAddCategory}
          disabled={isAdding}
        >
          <LinearGradient
            colors={["#3B82F6", "#2563EB"]}
            style={StylesCategoryManagement.addButtonGradient}
          >
            {isAdding ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={StylesCategoryManagement.addButtonText}>
                Agregar Categoría
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Categories List */}
      <Text style={StylesCategoryManagement.listTitle}>Tus Categorías</Text>
      {loading ? (
        <CategorySkeleton />
      ) : (
        categories.map((item) => (
          <View key={item.id} style={StylesCategoryManagement.categoryItem}>
            <View
              style={[
                StylesCategoryManagement.categoryColorDot,
                { backgroundColor: item.color },
              ]}
            />
            <Text style={StylesCategoryManagement.categoryName}>
              {item.name}
            </Text>
            <TouchableOpacity
              style={StylesCategoryManagement.deleteButton}
              onPress={() => handleDeleteCategory(item.id)}
            >
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        ))
      )}
    </BaseScreen>
  );
};

export default CategoryManagementScreen;
