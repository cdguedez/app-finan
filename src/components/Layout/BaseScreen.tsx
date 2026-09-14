import React, { ReactNode } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  ScrollView,
  ViewStyle,
  StyleProp,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

interface BaseScreenProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  scrollable?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  headerRight?: ReactNode;
}

export const BaseScreen = ({
  children,
  title,
  showBackButton = false,
  onBackPress,
  scrollable = true,
  contentContainerStyle,
  headerRight,
}: BaseScreenProps) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  const ContentWrapper = scrollable ? ScrollView : View;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <SafeAreaView style={styles.safeArea}>
        {(title || showBackButton || headerRight) && (
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              {showBackButton && (
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={handleBackPress}
                >
                  <Ionicons name="arrow-back" size={24} color="#F8FAFC" />
                </TouchableOpacity>
              )}
              {title && <Text style={styles.headerTitle}>{title}</Text>}
            </View>
            {headerRight && (
              <View style={styles.headerRight}>{headerRight}</View>
            )}
          </View>
        )}

        <ContentWrapper
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            scrollable ? styles.scrollContent : styles.flexContent,
            contentContainerStyle,
          ]}
        >
          {children}
        </ContentWrapper>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F8FAFC",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // For bottom tabs
  },
  flexContent: {
    flex: 1,
  },
});
