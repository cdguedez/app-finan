import { StyleSheet } from "react-native";

const StylesCategoryManagement = StyleSheet.create({
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
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
  
  // Form
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
  
  // Color Picker
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  colorOption: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedColor: {
    borderColor: "#F8FAFC",
  },
  
  // Button
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
  
  // List
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F8FAFC",
    marginBottom: 15,
  },
  categoryList: {
    flex: 1,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30, 41, 59, 0.7)",
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  categoryColorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 15,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F8FAFC",
    flex: 1,
  },
  deleteButton: {
    padding: 5,
  },
});

export { StylesCategoryManagement };
