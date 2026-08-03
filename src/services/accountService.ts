import { apiRequest } from "./apiClient";
import * as SecureStore from "expo-secure-store";

export interface AccountData {
  id: string;
  name: string;
  currency: "USD" | "VES" | "EUR" | "BTC" | "ETH" | "USDT";
  balance: number;
}

export const accountService = {
  getAccounts: async (): Promise<AccountData[]> => {
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      const response = await apiRequest<AccountData[]>("/accounts", {
        token: token || undefined,
      });
      return response;
    } catch (error) {
      console.error("Error fetching accounts:", error);
      throw error;
    }
  },

  createAccount: async (
    data: Omit<AccountData, "id">,
  ): Promise<AccountData> => {
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      const response = await apiRequest<AccountData>("/accounts", {
        method: "POST",
        body: data,
        token: token || undefined,
      });
      return response;
    } catch (error) {
      console.error("Error creating account:", error);
      throw error;
    }
  },
};
